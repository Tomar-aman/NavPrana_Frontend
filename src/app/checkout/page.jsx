"use client";

import { useEffect, useMemo, useState } from "react";
import PrivateRoute from "../../../components/PrivateRoute";
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddress,
  editAddress,
  fetchAddresses,
} from "@/redux/features/addressSlice";
import { fetchProducts } from "@/redux/features/product";
import { getCart } from "@/redux/features/cartSlice";
import { applyCoupon, resetCouponState } from "@/redux/features/couponSlice";
import { createOrder } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AddressModal from "../../../components/AddressModal";
import { sendAddress } from "@/services/profile/post-profile";
import { toast } from "react-toastify";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [couponError, setCouponError] = useState("");

  const { list: address } = useSelector((state) => state.address);
  const { list: products } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { couponData, success } = useSelector((state) => state.coupon);

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
    dispatch(fetchAddresses());
    dispatch(fetchProducts());
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (success && couponData) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [success, couponData]);

  const mergedCartItems = useMemo(() => {
    return cartItems.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.product),
    }));
  }, [cartItems, products]);

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
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + shipping - couponDiscount;

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
    if (!selectedAddressId) return toast.error("Select address");

    const payload = {
      products: cartItems.map((item) => ({
        product_id: item.product,
        quantity: item.quantity,
      })),
      address_id: selectedAddressId,
      coupon_code: couponCode || undefined,
    };

    try {
      dispatch(showLoader());
      await dispatch(createOrder(payload)).unwrap();
      router.push("/payment");
    } catch (err) {
      dispatch({ type: "ui/hideLoader" });
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

  const paymentOptions = [
    { id: "upi", label: "UPI", icon: Wallet, color: "bg-violet-50", iconColor: "text-violet-500" },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, color: "bg-blue-50", iconColor: "text-blue-500" },
    { id: "cod", label: "Cash on Delivery", icon: Truck, disabled: true, color: "bg-gray-50", iconColor: "text-gray-400", note: "Unavailable" },
  ];

  return (
    <PrivateRoute>

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
              {/* Address Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
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
                    🎉 Coupon <b>{couponData.code}</b> applied!
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
                className="mt-4 w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
              >
                Place Order • ₹{total}
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
    </PrivateRoute>
  );
};

export default Page;
