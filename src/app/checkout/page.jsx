"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Shield,
  Tag,
  Check,
  CreditCard,
  Wallet,
  Pencil,
  Trash2,
  Home,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "@/redux/features/addressSlice";
import AddressModal from "../../../components/AddressModal";
import { fetchProducts } from "@/redux/features/product";
import { getCart } from "@/redux/features/cartSlice";
import { applyCoupon } from "@/redux/features/couponSlice";
import Image from "next/image";
import { createOrder } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";

const Page = () => {
  const { list: address } = useSelector((state) => state.address);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { list: products } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { orderData } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchProducts());
    dispatch(getCart());
  }, [dispatch]);

  /* 🔹 Get featured image safely */
  const getFeaturedImage = (images = []) => {
    return (
      images.find((img) => img.is_feature)?.image ||
      images[0]?.image ||
      "/placeholder.png"
    );
  };

  /* 🔹 Merge cart items with product data */
  const mergedCartItems = useMemo(() => {
    return cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product);

      return {
        ...cartItem,
        product,
      };
    });
  }, [cartItems, products]);

  /* ---------------- PAYMENT ---------------- */
  const [paymentMethod, setPaymentMethod] = useState("cod");

  /* ---------------- COUPON ---------------- */
  const [couponCode, setCouponCode] = useState("");
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
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const baseURL = "http://localhost:3000";
  const { couponData, success } = useSelector((state) => state.coupon);
  console.log(couponData);
  useEffect(() => {
    if (success && couponData) {
      console.log("Coupon Applied:", couponData);
    }
  }, [success, couponData]);
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  /* ---------------- PRICE CALC ---------------- */
  /* 🔹 Price calculations */
  const subtotal = mergedCartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const shipping = subtotal > 999 ? 0 : 50;

  const discount = couponData?.discount_amount
    ? couponData.discount_amount <= 100
      ? Math.round((subtotal * couponData.discount_amount) / 100)
      : couponData.discount_amount
    : 0;

  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    dispatch(applyCoupon({ order_total: subtotal, coupon_code: couponCode }));
  };

  // const handleCreateOrder = () => {
  //   if (!selectedAddressId) {
  //     alert("Please select address");
  //     return;
  //   }

  //   if (!cartItems.length) {
  //     alert("Cart is empty");
  //     return;
  //   }

  //   const payload = {
  //     products: cartItems.map((item) => ({
  //       product_id: item.product,
  //       quantity: item.quantity,
  //     })),
  //     coupon_code: couponCode || null,
  //     address_id: selectedAddressId,
  //     return_url: `${baseURL}/payment-status`,
  //   };

  //   console.log("CREATE ORDER PAYLOAD 👉", payload);

  //   dispatch(createOrder(payload)); // ✅ FIXED
  //   router.push("/payment");
  // };

  const handleCreateOrder = () => {
    if (!selectedAddressId) {
      alert("Please select address");
      return;
    }

    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    // ✅ Base payload (ALWAYS REQUIRED)
    const payload = {
      products: cartItems.map((item) => ({
        product_id: item.product,
        quantity: item.quantity,
      })),
      address_id: selectedAddressId,
      return_url: `${baseURL}/payment-status`,
    };

    // ✅ ONLY add coupon_code if user applied coupon
    if (couponData?.coupon_code || couponCode) {
      payload.coupon_code = couponCode;
    }

    console.log("CREATE ORDER PAYLOAD 👉", payload);

    dispatch(createOrder(payload));
    router.push("/payment");
  };

  const handleOnsubmitAddress = async () => {
    try {
      await sendAddress(formData);

      // 🔥 IMPORTANT
      dispatch(fetchAddresses());

      toast.success("Address added successfully");
      setShowAddressModal(false);

      // reset form
      setFormData({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false,
      });
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50 py-10 px-4 my-20">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-500 hover:text-black mb-6"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <div className="bg-white rounded-2xl border p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Delivery Address
                  </h2>

                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-2 border border-dashed border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition cursor-pointer"
                  >
                    <Plus size={16} />
                    Add Address
                  </button>
                </div>

                {/* Address List */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {address.map((addr, index) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-200 group
          ${
            selectedAddressId === addr.id
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }
          ${index === 0 ? "md:col-span-2" : ""}
        `}
                    >
                      {/* Actions (Edit / Delete) */}
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                          title="Edit address"
                          onClick={(e) => {
                            e.stopPropagation();
                            // setEditAddressData(addr);
                            // setShowAddressModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                          title="Delete address"
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleDeleteAddress(addr.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Default Badge */}
                      {addr.is_default && (
                        <span className="absolute top-3 left-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}

                      {/* Address Content */}
                      <div className="flex gap-3 mt-6">
                        <div className="text-primary mt-1">
                          <Home size={20} />
                        </div>

                        <div className="space-y-1">
                          <p className="font-medium text-gray-800">
                            {addr.address_line1}
                          </p>

                          {addr.address_line2 && (
                            <p className="text-sm text-gray-500">
                              {addr.address_line2}
                            </p>
                          )}

                          <p className="text-sm text-gray-500">
                            {addr.city}, {addr.state} – {addr.postal_code}
                          </p>

                          <p className="text-sm text-gray-500">
                            {addr.country}
                          </p>
                        </div>
                      </div>

                      {/* Selected Indicator */}
                      {selectedAddressId === addr.id && (
                        <span className="absolute bottom-3 right-3 text-xs text-primary font-medium">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl border p-5">
                <h2 className="font-semibold mb-4">Payment Method</h2>

                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "upi", label: "UPI", icon: Wallet },
                  {
                    id: "cod",
                    label: "Cash on Delivery (Not Available)",
                    icon: Truck,
                    disabled: true,
                  },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border mb-3
      ${
        p.disabled
          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          : paymentMethod === p.id
            ? "border-primary bg-green-50 cursor-pointer"
            : "border-gray-200 cursor-pointer"
      }`}
                  >
                    <input
                      type="radio"
                      disabled={p.disabled}
                      checked={paymentMethod === p.id}
                      onChange={() => !p.disabled && setPaymentMethod(p.id)}
                    />
                    <p.icon size={18} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-xl border p-6 sticky top-4 h-fit">
              <h2 className="font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {mergedCartItems.map((item) => {
                  if (!item.product) return null;
                  const imageUrl = getFeaturedImage(item.product.images);
                  return (
                    <div key={item.id} className="flex gap-3">
                      <Image
                        src={imageUrl}
                        alt=""
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.product.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} />
                  <span className="font-medium text-sm">Apply Coupon</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex justify-between items-center bg-green-50 border border-green-600/30 p-3 rounded-lg">
                    <span className="font-mono text-green-600">
                      {appliedCoupon.code}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon"
                        className="border rounded px-3 py-2 w-full text-sm"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="border px-4 rounded hover:bg-gray-100"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-500 mt-1">{couponError}</p>
                    )}
                  </>
                )}
              </div>

              {/* Price */}
              <div className="border-t mt-5 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {couponData && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{couponData.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Place Order */}
              <button
                onClick={() => handleCreateOrder()}
                className="mt-5 w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 cursor-pointer"
              >
                Place Order • ₹{total}
              </button>

              {/* Trust */}
              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield size={14} /> Secure
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={14} /> Fast Delivery
                </div>
              </div>
            </div>
          </div>
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
              onSubmit={
                editAddressData ? handleUpdateAddress : handleOnsubmitAddress
              }
            />
          )}
        </div>
      </main>
    </PrivateRoute>
  );
};

export default Page;
