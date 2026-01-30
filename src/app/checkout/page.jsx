// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Truck,
//   Shield,
//   Tag,
//   CreditCard,
//   Wallet,
//   Pencil,
//   Trash2,
//   Home,
//   Plus,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAddresses } from "@/redux/features/addressSlice";
// import { fetchProducts } from "@/redux/features/product";
// import { getCart } from "@/redux/features/cartSlice";
// import { applyCoupon } from "@/redux/features/couponSlice";
// import { createOrder } from "@/redux/features/orderSlice";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import AddressModal from "../../../components/AddressModal";
// import { sendAddress } from "@/services/profile/post-profile";

// const Page = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { list: address } = useSelector((state) => state.address);
//   const { list: products } = useSelector((state) => state.product);
//   const { items: cartItems } = useSelector((state) => state.cart);
//   const { couponData, success } = useSelector((state) => state.coupon);

//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [couponCode, setCouponCode] = useState("");
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [editAddressData, setEditAddressData] = useState(null);
//   const [formData, setFormData] = useState({
//     address_line1: "",
//     address_line2: "",
//     city: "",
//     state: "",
//     postal_code: "",
//     country: "India",
//     is_default: false,
//   });

//   useEffect(() => {
//     dispatch(fetchAddresses());
//     dispatch(fetchProducts());
//     dispatch(getCart());
//   }, [dispatch]);

//   /* 🔥 CONFETTI WHEN COUPON APPLIED */
//   useEffect(() => {
//     if (success && couponData) {
//       setShowConfetti(true);
//       const timer = setTimeout(() => setShowConfetti(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, couponData]);

//   /* Merge Cart + Products */
//   const mergedCartItems = useMemo(() => {
//     return cartItems.map((item) => ({
//       ...item,
//       product: products.find((p) => p.id === item.product),
//     }));
//   }, [cartItems, products]);

//   /* Price Calculation */
//   const subtotal = mergedCartItems.reduce((sum, item) => {
//     if (!item.product) return sum;
//     return sum + Number(item.product.price) * item.quantity;
//   }, 0);

//   const shipping = subtotal > 999 ? 0 : 50;
//   const discount = couponData?.discount_amount || 0;
//   const total = subtotal + shipping - discount;

//   const handleApplyCoupon = () => {
//     dispatch(applyCoupon({ order_total: subtotal, coupon_code: couponCode }));
//   };

//   const handleCreateOrder = () => {
//     if (!selectedAddressId) return alert("Select address");

//     const payload = {
//       products: cartItems.map((item) => ({
//         product_id: item.product,
//         quantity: item.quantity,
//       })),
//       address_id: selectedAddressId,
//       coupon_code: couponCode || undefined,
//     };

//     dispatch(createOrder(payload));
//     router.push("/payment");
//   };

//   const handleOnsubmitAddress = async () => {
//     try {
//       await sendAddress(formData);

//       // 🔥 IMPORTANT
//       dispatch(fetchAddresses());

//       toast.success("Address added successfully");
//       setShowAddressModal(false);

//       // reset form
//       setFormData({
//         address_line1: "",
//         address_line2: "",
//         city: "",
//         state: "",
//         postal_code: "",
//         country: "India",
//         is_default: false,
//       });
//     } catch (err) {
//       toast.error("Failed to add address");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       {showConfetti && (
//         <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
//           {[...Array(60)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute w-3 h-5 "
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 backgroundColor: [
//                   "#22c55e",
//                   "#eab308",
//                   "#3b82f6",
//                   "#ec4899",
//                   "#f97316",
//                 ][Math.floor(Math.random() * 5)],
//               }}
//               initial={{
//                 bottom: -10,
//                 opacity: 1,
//                 scale: Math.random() * 0.7 + 0.3,
//                 rotate: 0,
//               }}
//               animate={{
//                 bottom: "110vh", // 🚀 fly up
//                 opacity: 0,
//                 rotate: Math.random() * 720,
//                 x: Math.random() * 200 - 100, // sideways spread
//               }}
//               transition={{
//                 duration: Math.random() * 2 + 1.5,
//                 delay: Math.random() * 0.3,
//                 ease: "easeOut",
//               }}
//             />
//           ))}
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto">
//         {/* Back */}
//         <Link
//           href="/cart"
//           className="flex items-center gap-2 text-gray-500 mb-6"
//         >
//           <ArrowLeft size={16} /> Back to Cart
//         </Link>

//         <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* LEFT SIDE */}
//           <div className="lg:col-span-2 space-y-6">
//     {/* ADDRESS */}
//     <div className="bg-white rounded-2xl border p-6 space-y-5">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Delivery Address
//         </h2>

//         <button
//           onClick={() => setShowAddressModal(true)}
//           className="flex items-center gap-2 border border-dashed border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition cursor-pointer"
//         >
//           <Plus size={16} />
//           Add Address
//         </button>
//       </div>

//       {/* Address List */}
//       <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
//         {address.map((addr, index) => (
//           <div
//             key={addr.id}
//             onClick={() => setSelectedAddressId(addr.id)}
//             className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-200 group
//   ${
//     selectedAddressId === addr.id
//       ? "border-primary bg-primary/5 ring-2 ring-primary/20"
//       : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//   }
//   ${index === 0 ? "md:col-span-2" : ""}
// `}
//           >
//             {/* Actions (Edit / Delete) */}
//             <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
//               <button
//                 className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
//                 title="Edit address"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   // setEditAddressData(addr);
//                   // setShowAddressModal(true);
//                 }}
//               >
//                 <Pencil size={14} />
//               </button>

//               <button
//                 className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
//                 title="Delete address"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   // handleDeleteAddress(addr.id);
//                 }}
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>

//             {/* Default Badge */}
//             {addr.is_default && (
//               <span className="absolute top-3 left-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
//                 Default
//               </span>
//             )}

//             {/* Address Content */}
//             <div className="flex gap-3 mt-6">
//               <div className="text-primary mt-1">
//                 <Home size={20} />
//               </div>

//               <div className="space-y-1">
//                 <p className="font-medium text-gray-800">
//                   {addr.address_line1}
//                 </p>

//                 {addr.address_line2 && (
//                   <p className="text-sm text-gray-500">
//                     {addr.address_line2}
//                   </p>
//                 )}

//                 <p className="text-sm text-gray-500">
//                   {addr.city}, {addr.state} – {addr.postal_code}
//                 </p>

//                 <p className="text-sm text-gray-500">{addr.country}</p>
//               </div>
//             </div>

//             {/* Selected Indicator */}
//             {selectedAddressId === addr.id && (
//               <span className="absolute bottom-3 right-3 text-xs text-primary font-medium">
//                 ✓ Selected
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//             {/* PAYMENT */}
//             <div className="bg-white rounded-xl border p-6">
//               <h2 className="font-semibold mb-4">Payment Method</h2>

//               {[
//                 { id: "card", label: "Card", icon: CreditCard },
//                 { id: "upi", label: "UPI", icon: Wallet },
//                 {
//                   id: "cod",
//                   label: "Cash on Delivery",
//                   icon: Truck,
//                   disabled: true,
//                 },
//               ].map((p) => (
//                 <label
//                   key={p.id}
//                   className={`flex gap-3 p-3 border rounded mb-2 cursor-pointer ${
//                     p.disabled ? "bg-gray-100 text-gray-400" : ""
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     disabled={p.disabled}
//                     checked={paymentMethod === p.id}
//                     onChange={() => setPaymentMethod(p.id)}
//                   />
//                   <p.icon size={18} /> {p.label}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT SIDE SUMMARY */}
//           <div className="bg-white rounded-xl border p-6 sticky top-4 h-fit">
//             <h2 className="font-semibold mb-4">Order Summary</h2>

//             {/* CART ITEMS */}
//             <div className="space-y-3 max-h-40 overflow-auto">
//               {mergedCartItems.map((item) => {
//                 if (!item.product) return null;
//                 return (
//                   <div key={item.id} className="flex gap-3">
//                     <Image
//                       src={
//                         item.product.images?.[0]?.image || "/placeholder.png"
//                       }
//                       width={60}
//                       height={60}
//                       className="rounded"
//                       alt=""
//                     />
//                     <div className="flex-1">
//                       <p className="font-medium">{item.product.name}</p>
//                       <p className="text-sm text-gray-500">
//                         {item.quantity} × ₹{item.product.price}
//                       </p>
//                     </div>
//                     <p className="font-medium">
//                       ₹{item.product.price * item.quantity}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* COUPON */}
//             <div className="mt-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Tag size={16} /> Apply Coupon
//               </div>

//               <div className="flex gap-2">
//                 <input
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value)}
//                   placeholder="Enter coupon"
//                   className="border px-3 py-2 rounded w-full"
//                 />
//                 <button
//                   onClick={handleApplyCoupon}
//                   className="border px-4 rounded hover:bg-gray-100"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>

//             {/* PRICE */}
//             <div className="border-t mt-4 pt-4 text-sm space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{subtotal}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
//               </div>
//               {discount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Coupon Discount</span>
//                   <span>-₹{discount}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-lg border-t pt-2">
//                 <span>Total</span>
//                 <span>₹{total}</span>
//               </div>
//             </div>

//             {/* PLACE ORDER */}
//             <button
//               onClick={handleCreateOrder}
//               className="mt-5 w-full bg-primary text-white py-3 rounded-lg font-medium"
//             >
//               Place Order • ₹{total}
//             </button>

//             <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
//               <div className="flex items-center gap-1">
//                 <Shield size={14} /> Secure
//               </div>
//               <div className="flex items-center gap-1">
//                 <Truck size={14} /> Fast Delivery
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {showAddressModal && (
//         <AddressModal
//           isOpen={showAddressModal}
//           isEdit={!!editAddressData}
//           formData={formData}
//           setFormData={setFormData}
//           onClose={() => {
//             setShowAddressModal(false);
//             setEditAddressData(null);
//           }}
//           onSubmit={
//             editAddressData ? handleUpdateAddress : handleOnsubmitAddress
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default Page;

"use client";

import { useEffect, useMemo, useState } from "react";
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
import { fetchAddresses } from "@/redux/features/addressSlice";
import { fetchProducts } from "@/redux/features/product";
import { getCart } from "@/redux/features/cartSlice";
import { applyCoupon } from "@/redux/features/couponSlice";
import { createOrder } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AddressModal from "../../../components/AddressModal";
import { sendAddress } from "@/services/profile/post-profile";
import { toast } from "react-toastify";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

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

  /* Fetch Data */
  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchProducts());
    dispatch(getCart());
  }, [dispatch]);

  /* 🎉 Confetti when coupon applied */
  useEffect(() => {
    if (success && couponData) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [success, couponData]);

  /* Merge Cart + Products */
  const mergedCartItems = useMemo(() => {
    return cartItems.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.product),
    }));
  }, [cartItems, products]);

  /* PRICE CALCULATION */
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

  /* Apply Coupon */
  const handleApplyCoupon = () => {
    if (!couponCode) return toast.error("Enter coupon code");
    dispatch(applyCoupon({ order_total: subtotal, coupon_code: couponCode }));
  };

  /* Create Order */
  const handleCreateOrder = () => {
    if (!selectedAddressId) return alert("Select address");

    const payload = {
      products: cartItems.map((item) => ({
        product_id: item.product,
        quantity: item.quantity,
      })),
      address_id: selectedAddressId,
      coupon_code: couponCode || undefined,
      // return_url: "http://localhost:3000/payment-status",
    };

    dispatch(createOrder(payload));
    router.push("/payment");
  };

  /* Add Address */
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

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      {/* CONFETTI */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-5 rounded"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: [
                  "#22c55e",
                  "#eab308",
                  "#3b82f6",
                  "#ec4899",
                  "#f97316",
                ][Math.floor(Math.random() * 5)],
              }}
              initial={{ bottom: -10, opacity: 1 }}
              animate={{
                bottom: "110vh",
                opacity: 0,
                rotate: Math.random() * 720,
              }}
              transition={{ duration: Math.random() * 2 + 1.5 }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* BACK */}
        <Link
          href="/cart"
          className="flex items-center gap-2 text-gray-500 mb-6"
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* ADDRESS */}
            {/* <div className="bg-white border rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">Delivery Address</h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex gap-2 border border-dashed border-primary px-3 py-2 rounded text-primary"
                >
                  <Plus size={16} /> Add Address
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {address.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      selectedAddressId === addr.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-medium">{addr.address_line1}</p>
                    <p className="text-sm text-gray-500">
                      {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                  </div>
                ))}
              </div>
            </div> */}
            {/* ADDRESS */}
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

                        <p className="text-sm text-gray-500">{addr.country}</p>
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

            {/* PAYMENT */}
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-semibold mb-3">Payment Method</h2>

              {[
                { id: "upi", label: "UPI", icon: Wallet },
                { id: "card", label: "Card", icon: CreditCard },
                {
                  id: "cod",
                  label: "COD (Disabled)",
                  icon: Truck,
                  disabled: true,
                },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`flex gap-2 border p-3 rounded mb-2 cursor-pointer ${
                    p.disabled ? "bg-gray-100 text-gray-400" : ""
                  }`}
                >
                  <input
                    type="radio"
                    disabled={p.disabled}
                    checked={paymentMethod === p.id}
                    onChange={() => setPaymentMethod(p.id)}
                  />
                  <p.icon size={18} /> {p.label}
                </label>
              ))}
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white border rounded-xl p-6 sticky top-4 h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {/* CART ITEMS */}
            <div className="space-y-3 max-h-40 overflow-auto">
              {mergedCartItems.map((item) => {
                if (!item.product) return null;
                const mrp = Number(
                  item.product.max_price || item.product.price,
                );
                const price = Number(item.product.price);
                const save = (mrp - price) * item.quantity;

                return (
                  <div key={item.id} className="flex gap-3 border-b pb-2">
                    <Image
                      src={
                        item.product.images?.[0]?.image || "/placeholder.png"
                      }
                      width={60}
                      height={60}
                      className="rounded object-cover"
                      alt=""
                    />

                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ₹{price}
                      </p>

                      <div className="text-xs flex gap-2">
                        <span className="line-through text-gray-400">
                          ₹{mrp * item.quantity}
                        </span>
                        <span className="text-green-600">Save ₹{save}</span>
                      </div>
                    </div>

                    <p className="font-medium">₹{price * item.quantity}</p>
                  </div>
                );
              })}
            </div>

            {/* COUPON */}
            <div className="mt-4">
              <div className="flex gap-2 mb-2">
                <Tag size={16} /> Apply Coupon
              </div>

              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border px-3 py-2 rounded uppercase w-full"
                  placeholder="Enter coupon"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="border px-4 rounded hover:bg-gray-100"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div className="border-t mt-4 pt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span className="line-through">₹{mrpSubtotal}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Product Discount</span>
                <span>-₹{productDiscount}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Payable</span>
                <span className="text-primary">₹{total}</span>
              </div>

              <p className="text-xs text-green-700 font-medium">
                🎉 You saved ₹{productDiscount + couponDiscount}
              </p>
            </div>

            {/* PLACE ORDER */}
            <button
              onClick={handleCreateOrder}
              className="mt-5 w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90"
            >
              Place Order • ₹{total}
            </button>

            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield size={14} /> Secure
              </div>
              <div className="flex items-center gap-1">
                <Truck size={14} /> Fast Delivery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <AddressModal
          isOpen={showAddressModal}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleOnsubmitAddress}
        />
      )}
    </div>
  );
};

export default Page;
