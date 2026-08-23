"use client";

import { useEffect, useMemo, useState } from "react";
import { showLoader } from "@/redux/features/uiSlice";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Truck,
  Shield,
  Tag,
  CreditCard,
  Wallet,
  Pencil,
  Trash2,
  Home,
  Plus,
  Banknote,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddress,
  editAddress,
  fetchAddresses,
} from "@/redux/features/addressSlice";
import { getCart } from "@/redux/features/cartSlice";
import { applyCoupon, resetCouponState } from "@/redux/features/couponSlice";
import { createOrder } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AddressModal from "../../../components/AddressModal";
import { sendAddress } from "@/services/profile/post-profile";
import { toast } from "sonner";
import {
  buildContents,
  savePendingPurchase,
  trackInitiateCheckout,
  trackAddPaymentInfo,
} from "@/lib/meta-pixel";
import { useProfile } from "@/Context/ProfileContext";
import { loadCashfreeSdk } from "@/lib/cashfree";
import { clearGuestCart, guestCartSyncPayload } from "@/lib/guestCart";
import { guestCheckoutAPI } from "@/services/auth/guestCheckout";
import { syncCartAPI } from "@/services/cart/syncCart";
import { getAuthToken, setAuthToken } from "@/utils/authToken";
import GuestDetailsForm from "../../../components/GuestDetailsForm";

const GUEST_REQUIRED = {
  first_name: "Enter your first name",
  email: "Enter your email",
  phone_number: "Enter your phone number",
  address_line1: "Enter your address",
  city: "Enter your city",
  state: "Enter your state",
  postal_code: "Enter your PIN code",
};

const validateGuest = (details) => {
  const errors = {};
  Object.entries(GUEST_REQUIRED).forEach(([field, message]) => {
    if (!String(details[field] || "").trim()) errors[field] = message;
  });
  if (details.email && !/^\S+@\S+\.\S+$/.test(details.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  const digits = String(details.phone_number || "").replace(/\D/g, "");
  if (details.phone_number && digits.length < 10) {
    errors.phone_number = "Enter a valid 10-digit phone number";
  }
  return errors;
};

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [couponError, setCouponError] = useState("");

  // Needed for the Meta Pixel Purchase event — the success screens have no
  // access to who the buyer is, so their details are captured here.
  const { profile } = useProfile();

  const { list: address } = useSelector((state) => state.address);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { couponData, success } = useSelector((state) => state.coupon);
  const { createLoading } = useSelector((state) => state.order);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Signed-in state is read once on mount; a guest becomes signed in only
  // through handleCreateOrder below, which re-renders via setIsGuest.
  const [isGuest, setIsGuest] = useState(false);
  const [guestChecked, setGuestChecked] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });
  const [guestErrors, setGuestErrors] = useState({});

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressData, setEditAddressData] = useState(null);


  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });

  useEffect(() => {
    const signedIn = Boolean(getAuthToken());
    setIsGuest(!signedIn);
    setGuestChecked(true);

    if (signedIn) dispatch(fetchAddresses());
    dispatch(getCart());
  }, [dispatch]);

  // Warm up the Cashfree SDK while the user is still filling in checkout, so
  // the /payment page can open the payment sheet without waiting on a download.
  useEffect(() => {
    loadCashfreeSdk().catch(() => {
      // Offline or blocked — /payment loads it again and handles the failure.
    });
  }, []);

  useEffect(() => {
    if (success && couponData) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [success, couponData]);

  // Product details ride along with the cart response — no catalogue fetch.
  const mergedCartItems = useMemo(
    () => cartItems.map((item) => ({ ...item, product: item.product_detail })),
    [cartItems],
  );

  const subtotal = mergedCartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const mrpSubtotal = mergedCartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return (
      sum + Number(item.product.max_price || item.product.price) * item.quantity
    );
  }, 0);

  const productDiscount = mrpSubtotal - subtotal;
  const couponDiscount = couponData?.discount_amount || 0;
  // Mirrors Order.calculate_shipping() on the backend — keep the two in sync
  const shipping =
    subtotal <= 0 || subtotal > 599 || couponData?.free_shipping ? 0 : 50;
  const codHandlingFee = paymentMethod === "cod" ? 20 : 0;
  const total = subtotal + shipping + codHandlingFee - couponDiscount;

  // 📊 Meta Pixel — InitiateCheckout (fires when cart data is available)
  const hasCartData = mergedCartItems.length > 0 && subtotal > 0;
  useEffect(() => {
    if (hasCartData) {
      trackInitiateCheckout(mergedCartItems, subtotal);
    }
  }, [hasCartData]);

  // 📊 Meta Pixel — AddPaymentInfo is fired from handleCreateOrder, not here.
  // As a [paymentMethod] effect it also fired on mount with the untouched "upi"
  // default, so every checkout visit reported an AddPaymentInfo the shopper
  // never performed and the funnel showed a 100% checkout➜payment rate.

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }
    try {
      setCouponError("");
      await dispatch(
        applyCoupon({ order_total: subtotal, coupon_code: couponCode }),
      ).unwrap();
    } catch (err) {
      const message =
        err?.error ||
        Object.values(err || {})?.[0]?.[0] ||
        "Invalid coupon code";
      setCouponError(message);
    }
  };

  useEffect(() => {
    if (success) {
      dispatch({ type: "coupon/resetCouponState" });
    }
  }, [couponCode]);

  const handleCreateOrder = async () => {
    // Guard against a second tap while the first order is still in flight —
    // without this a double-click creates two orders and two payment sessions.
    if (placingOrder) return;

    if (isGuest) {
      const errors = validateGuest(guestDetails);
      setGuestErrors(errors);
      if (Object.keys(errors).length > 0) {
        return toast.error("Please complete your details to continue");
      }
    } else if (!selectedAddressId) {
      return toast.error("Select address");
    }

    setPlacingOrder(true);

    // Guests get an account + address created behind the scenes first, so the
    // order call below is identical for both paths.
    let addressId = selectedAddressId;
    // cartItems from the closure is the pre-sync (local) list, so track the
    // rows the order should actually be built from.
    let orderRows = cartItems;

    if (isGuest) {
      try {
        const guest = await guestCheckoutAPI(guestDetails);
        setAuthToken(guest.access);
        addressId = guest.address_id;

        const localItems = guestCartSyncPayload();
        if (localItems.length > 0) {
          orderRows = await syncCartAPI(localItems);
          clearGuestCart();
        }
        dispatch(getCart());
        setIsGuest(false);
      } catch (err) {
        setPlacingOrder(false);
        const data = err?.response?.data;
        if (data?.code === "account_exists") {
          toast.error(data.error);
          return router.push("/signin?next=/checkout");
        }
        return toast.error(
          data?.error || "Could not start checkout. Please check your details.",
        );
      }
    }

    const payload = {
      products: orderRows.map((item) => ({
        product_id: item.product,
        quantity: item.quantity,
      })),
      address_id: addressId,
      coupon_code: couponCode || undefined,
      payment_method: paymentMethod,
    };

    // 📊 Meta Pixel — AddPaymentInfo at the moment the method is committed to,
    // with the amount actually payable.
    trackAddPaymentInfo(paymentMethod, total);

    // Everything the Purchase event needs, while we still have it. Fields are
    // listed out rather than spread because an address object also carries an
    // `id`, which would otherwise overwrite the customer id Meta matches on.
    // `isGuest` is already false by now for a guest who just got an account,
    // so fall back to the form state instead of branching on the flag.
    const selectedAddress =
      address.find((addr) => addr.id === addressId) || {};
    const buyer = {
      id: profile?.id,
      email: profile?.email || guestDetails.email,
      phone_number: profile?.phone_number || guestDetails.phone_number,
      first_name: profile?.first_name || guestDetails.first_name,
      last_name: profile?.last_name || guestDetails.last_name,
      city: selectedAddress.city || guestDetails.city,
      state: selectedAddress.state || guestDetails.state,
      postal_code: selectedAddress.postal_code || guestDetails.postal_code,
      country: selectedAddress.country || guestDetails.country,
    };

    try {
      dispatch(showLoader());
      const orderData = await dispatch(createOrder(payload)).unwrap();

      // 📊 Meta Pixel — hand the Purchase event off to the success screen.
      // COD used to report value: 0 with no products and no customer, because
      // /cod-success only ever knew the order id.
      savePendingPurchase({
        orderId: orderData.order_id,
        transactionId: orderData.transaction_id,
        value: total,
        currency: "INR",
        contents: buildContents(orderRows),
        user: buyer,
      });

      if (paymentMethod === "cod") {
        // Store in sessionStorage as fallback if Redux is lost on refresh
        sessionStorage.setItem("cod_order_id", orderData.order_id);
        sessionStorage.setItem("cod_transaction_id", orderData.transaction_id);
        dispatch({ type: "ui/hideLoader" });
        router.push("/cod-success");
      } else {
        router.push("/payment");
      }
    } catch (err) {
      dispatch({ type: "ui/hideLoader" });
      // Only re-enable on failure — on success we are navigating away, and
      // re-enabling would briefly expose the button again mid-redirect.
      setPlacingOrder(false);
      toast.error(err?.error || err?.message || "Order creation failed. Please try again.");
    }
  };

  const handleOnsubmitAddress = async () => {
    try {
      await sendAddress(formData);
      dispatch(fetchAddresses());
      toast.success("Address added");
      setShowAddressModal(false);
    } catch {
      toast.error("Failed to add address");
    }
  };

  useEffect(() => {
    if (address && address.length > 0 && !selectedAddressId) {
      const defaultAddress = address.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(address[0].id);
      }
    }
  }, [address, selectedAddressId]);

  useEffect(() => {
    if (editAddressData) {
      setFormData(editAddressData);
    }
  }, [editAddressData]);

  const handleUpdateAddress = async () => {
    try {
      await dispatch(
        editAddress({
          id: editAddressData.id,
          data: {
            address_line1: formData.address_line1,
            address_line2: formData.address_line2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            is_default: formData.is_default,
          },
        }),
      ).unwrap();
      toast.success("Address updated");
    } catch (err) {
      toast.error("Failed to update address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const isPlacing = placingOrder || createLoading;

  const paymentOptions = [
    { id: "upi", label: "UPI", icon: Wallet, color: "bg-violet-50", iconColor: "text-violet-500" },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, color: "bg-blue-50", iconColor: "text-blue-500" },
    { id: "cod", label: "Cash on Delivery", icon: Banknote, color: "bg-green-50", iconColor: "text-green-600", note: "+₹20 handling fee" },
  ];

  return (
      <div className="min-h-screen bg-background pt-28 pb-20 px-4">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-5 rounded"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["#22c55e", "#eab308", "#3b82f6", "#ec4899", "#f97316"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
                initial={{ bottom: -10, opacity: 1 }}
                animate={{ bottom: "110vh", opacity: 0, rotate: Math.random() * 720 }}
                transition={{ duration: Math.random() * 2 + 1.5 }}
              />
            ))}
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Back */}
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-foreground bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition mb-5">
            <ArrowLeft size={16} /> Back to Cart
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-5">
              {/* Guests type their details inline; signed-in users pick a
                  saved address. Nothing is gated behind a login page. */}
              {isGuest && guestChecked && (
                <GuestDetailsForm
                  values={guestDetails}
                  onChange={setGuestDetails}
                  errors={guestErrors}
                />
              )}

              {/* Address Section */}
              <div
                className={`bg-white rounded-2xl border border-gray-100 p-5 ${
                  isGuest ? "hidden" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold">Delivery Address</h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary border border-dashed border-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add New
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {address.map((addr, index) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative rounded-xl border p-4 cursor-pointer transition-all group
                        ${selectedAddressId === addr.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                        }
                        ${index === 0 && address.length > 2 ? "sm:col-span-2" : ""}
                      `}
                    >
                      {/* Actions */}
                      <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          className="p-1 rounded-md text-muted-foreground hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditAddressData(addr);
                            setShowAddressModal(true);
                          }}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="p-1 rounded-md text-red-400 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {addr.is_default && (
                        <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                          Default
                        </span>
                      )}

                      <div className="flex gap-2.5 mt-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Home size={14} className="text-primary" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <p className="font-medium text-foreground">{addr.address_line1}</p>
                          {addr.address_line2 && (
                            <p className="text-muted-foreground">{addr.address_line2}</p>
                          )}
                          <p className="text-muted-foreground">
                            {addr.city}, {addr.state} – {addr.postal_code}
                          </p>
                        </div>
                      </div>

                      {selectedAddressId === addr.id && (
                        <span className="absolute bottom-2.5 right-2.5 text-[10px] text-primary font-medium">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold mb-3">Payment Method</h2>
                <div className="space-y-2">
                  {paymentOptions.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${paymentMethod === p.id && !p.disabled
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                        } ${p.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        className="accent-primary"
                        disabled={p.disabled}
                        checked={paymentMethod === p.id}
                        onChange={() => setPaymentMethod(p.id)}
                      />
                      <div className={`w-8 h-8 ${p.color} rounded-lg flex items-center justify-center`}>
                        <p.icon size={15} className={p.iconColor} />
                      </div>
                      <div>
                        <span className="text-sm font-medium">{p.label}</span>
                        {p.note && (
                          <span className="ml-2 text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                            {p.note}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 h-fit">
              <h2 className="text-base font-semibold mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-48 overflow-auto">
                {mergedCartItems.map((item) => {
                  if (!item.product) return null;
                  const mrp = Number(item.product.max_price || item.product.price);
                  const price = Number(item.product.price);
                  const hasDiscount = mrp > price;

                  return (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <Image
                          src={item.product.images?.[0]?.image || "/placeholder.png"}
                          fill
                          className="object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.product.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-semibold">₹{price}</span>
                          {hasDiscount && (
                            <>
                              <span className="text-[10px] text-muted-foreground line-through">₹{mrp}</span>
                              <span className="text-[10px] font-semibold text-green-600">
                                {parseInt(item.product.discount_precent)}% off
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold shrink-0 self-center">₹{price * item.quantity}</p>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag size={13} className="text-primary" />
                  <span className="text-xs font-medium">Apply Coupon</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    disabled={success}
                    className={`border border-gray-200 px-3 py-2 rounded-lg uppercase w-full text-xs transition focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none ${success ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    placeholder="Enter coupon"
                  />
                  {!success ? (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-50 transition shrink-0"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(resetCouponState());
                        setCouponCode("");
                      }}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-red-500 text-[11px] mt-1.5">{couponError}</p>
                )}
                {success && couponData && (
                  <p className="text-green-600 text-[11px] mt-1.5 font-medium">
                    🎉 Coupon <b>{couponData.coupon_code || couponData.code}</b> applied!
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-100 mt-4 pt-3 text-sm space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">MRP Total</span>
                  <span className="line-through text-muted-foreground">₹{mrpSubtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-green-600 font-medium">
                  <span>Product Discount</span>
                  <span>-₹{productDiscount}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-green-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {codHandlingFee > 0 && (
                  <div className="flex justify-between text-xs text-orange-600 font-medium">
                    <span>COD Handling Fee</span>
                    <span>+₹{codHandlingFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                  <span>Total Payable</span>
                  <span className="text-foreground">₹{total}</span>
                </div>
                <p className="text-[11px] text-green-700 font-semibold bg-green-50 rounded-lg px-2.5 py-1.5 mt-1">
                  🎉 You saved ₹{productDiscount + couponDiscount}
                </p>
              </div>

              {/* Place Order */}
              <button
                onClick={handleCreateOrder}
                disabled={isPlacing || mergedCartItems.length === 0}
                className="mt-4 w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPlacing ? "Placing Order..." : `Place Order • ₹${total}`}
              </button>

              <div className="flex justify-center gap-4 mt-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield size={12} /> Secure
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={12} /> Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <AddressModal
            isOpen={showAddressModal}
            isEdit={!!editAddressData}
            formData={formData}
            setFormData={setFormData}
            onClose={() => {
              setShowAddressModal(false);
              setEditAddressData(null);
            }}
            onSubmit={editAddressData ? handleUpdateAddress : handleOnsubmitAddress}
          />
        )}
      </div>
  );
};

export default Page;
