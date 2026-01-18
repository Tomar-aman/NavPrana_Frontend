// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
//   CheckCircle2,
//   Package,
//   Truck,
//   MapPin,
//   Calendar,
//   Clock,
//   CreditCard,
//   Download,
//   Share2,
//   ShoppingBag,
// } from "lucide-react";
// import gheeProduct from "@/assets/ghee-product.jpg";
// import OrderProgress from "../../../../components/OrderProgress";
// import { orderDetail } from "@/redux/features/orderSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { useParams } from "next/navigation";

// const Page = () => {
//   // 🔹 MOCK DATA (replace with API / Redux later)
//   const { id } = useParams();

//   const dispatch = useDispatch();

//   const { orderDetail: orderData, detailLoading } = useSelector(
//     (state) => state.order
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(orderDetail(id));
//     }
//   }, [id, dispatch]);

//   if (!id) return null;

//   console.log(orderData);
//   const order = {
//     id: "ORD7A8B9C2D",
//     date: "15 January 2025",
//     estimatedDelivery: "20 January 2025",
//     items: [
//       {
//         id: 1,
//         name: "Pure Desi Ghee",
//         price: 1798,
//         quantity: 2,
//         image: gheeProduct,
//         size: "500ml",
//       },
//       {
//         id: 2,
//         name: "A2 Cow Ghee",
//         price: 1299,
//         quantity: 1,
//         image: gheeProduct,
//         size: "1L",
//       },
//     ],
//     address: {
//       name: "John Doe",
//       phone: "+91 98765 43210",
//       street: "123, Green Valley Apartments",
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//     },
//     payment: {
//       method: "Credit Card",
//       last4: "4242",
//     },
//     subtotal: 3097,
//     discount: 100,
//     shipping: 0,
//     total: 3097,
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-[#FBFBF7]">
//       <main className="flex-1 px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* SUCCESS */}
//           <div className="text-center mb-8">
//             <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
//               <CheckCircle2 className="w-10 h-10 text-green-600" />
//             </div>
//             <h1 className="text-3xl font-bold">Order Details</h1>
//             <p className="text-gray-600 mt-2">
//               Thank you for your order. Your payment was successful.
//             </p>
//           </div>

//           {/* ORDER META */}
//           <div className="bg-white rounded-xl border p-6 mb-6 flex justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Order ID</p>
//               <p className="text-xl font-bold text-green-700">
//                 {orderData.transaction_id}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Order Date</p>
//               <p className="font-medium">{order.date}</p>
//             </div>
//           </div>

//           {/* STATUS */}
//           <div className="bg-white rounded-xl border p-6 mb-6">
//             <h2 className="font-semibold mb-4">Order Status</h2>
//             <div className="flex justify-between items-center">
//               <OrderProgress status={order.status} />
//             </div>

//             <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
//               <Calendar className="text-green-700" />
//               <div>
//                 <p className="font-medium">Estimated Delivery</p>
//                 <p className="text-sm text-gray-600">
//                   {order.estimatedDelivery}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ADDRESS + PAYMENT */}
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             {/* ADDRESS */}
//             <div className="bg-white rounded-xl border p-6">
//               <h3 className="font-semibold flex items-center gap-2 mb-3">
//                 <MapPin className="text-green-700" /> Delivery Address
//               </h3>
//               <p className="font-medium">{order.address.name}</p>
//               <p className="text-sm text-gray-600">{order.address.street}</p>
//               <p className="text-sm text-gray-600">
//                 {order.address.city}, {order.address.state} –{" "}
//                 {order.address.pincode}
//               </p>
//               <p className="text-sm text-gray-600">{order.address.phone}</p>
//             </div>

//             {/* PAYMENT */}
//             <div className="bg-white rounded-xl border p-6">
//               <h3 className="font-semibold flex items-center gap-2 mb-3">
//                 <CreditCard className="text-green-700" /> Payment Method
//               </h3>
//               <p className="font-medium">{order.payment.method}</p>
//               <p className="text-sm text-gray-600">
//                 **** **** **** {order.payment.last4}
//               </p>
//               <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
//                 <CheckCircle2 size={16} />
//                 Payment Successful
//               </div>
//             </div>
//           </div>

//           {/* ITEMS */}
//           <div className="bg-white rounded-xl border p-6 mb-6">
//             <h2 className="font-semibold mb-4">Order Items</h2>
//             <div className="space-y-4">
//               {order.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex gap-4 bg-gray-50 rounded-lg p-3"
//                 >
//                   <Image
//                     src={item.image}
//                     alt={item.name}
//                     width={80}
//                     height={80}
//                     className="rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-sm text-gray-600">Size: {item.size}</p>
//                     <p className="text-sm text-gray-600">
//                       Qty: {item.quantity}
//                     </p>
//                   </div>
//                   <p className="font-semibold">₹{item.price * item.quantity}</p>
//                 </div>
//               ))}
//             </div>

//             {/* PRICE */}
//             <div className="border-t mt-4 pt-4 space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{order.subtotal}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Discount</span>
//                 <span>-₹{order.discount}</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total Paid</span>
//                 <span className="text-green-700">₹{order.total}</span>
//               </div>
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
//               <Download size={16} /> Download Invoice
//             </button>
//             <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
//               <Share2 size={16} /> Share Order
//             </button>
//             <Link
//               href="/products"
//               className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 justify-center"
//             >
//               <ShoppingBag size={16} />
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Page;

"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  Share2,
  ShoppingBag,
} from "lucide-react";
import OrderProgress from "../../../../components/OrderProgress";
import { orderDetail } from "@/redux/features/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { orderDetail: orderData, detailLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (id) {
      dispatch(orderDetail(id));
    }
  }, [id, dispatch]);

  if (detailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order details...
      </div>
    );
  }

  if (!orderData) return null;

  /* ---------------- HELPERS ---------------- */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF7]">
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* SUCCESS */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-gray-600 mt-2">
              Thank you for your order. Your payment was successful.
            </p>
          </div>

          {/* ORDER META */}
          <div className="bg-white rounded-xl border p-6 mb-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-xl font-bold text-green-700">
                {orderData.transaction_id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(orderData.created_at)}</p>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h2 className="font-semibold mb-4">Order Status</h2>
            <OrderProgress status={orderData.status_display} />
          </div>

          {/* ADDRESS + PAYMENT */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* ADDRESS */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin className="text-green-700" /> Delivery Address
              </h3>
              <p className="font-medium">{orderData.address.address_line1}</p>
              {orderData.address.address_line2 && (
                <p className="text-sm text-gray-600">
                  {orderData.address.address_line2}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {orderData.address.city}, {orderData.address.state} –{" "}
                {orderData.address.postal_code}
              </p>
              <p className="text-sm text-gray-600">
                {orderData.address.country}
              </p>
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <CreditCard className="text-green-700" /> Payment Details
              </h3>
              <p className="font-medium">
                {orderData.latest_transaction?.payment_method}
              </p>
              <p className="text-sm text-gray-600">
                Ref: {orderData.latest_transaction?.bank_reference}
              </p>
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                <CheckCircle2 size={16} />
                Payment {orderData.payment_status_display}
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-50 rounded-lg p-3"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.product.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.item_total}</p>
                </div>
              ))}
            </div>

            {/* PRICE */}
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total</span>
                <span>₹{orderData.total_amount}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{orderData.discount_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span> Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Final Paid</span>
                <span className="text-green-700">
                  ₹{orderData.final_amount}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              disabled
              className="border px-4 py-2 rounded-lg flex items-center gap-2
             cursor-not-allowed opacity-50"
            >
              <Download size={16} />
              Download Invoice
            </button>

            <button
              disabled
              className="border px-4 py-2 rounded-lg flex items-center gap-2
             cursor-not-allowed opacity-50"
            >
              <Share2 size={16} /> Share Order
            </button>
            <Link
              href="/products"
              className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 justify-center"
            >
              <ShoppingBag size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
