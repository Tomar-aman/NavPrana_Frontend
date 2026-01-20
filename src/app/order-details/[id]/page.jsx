// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
//   CheckCircle2,
//   XCircle,
//   Clock,
//   MapPin,
//   CreditCard,
//   Download,
//   Share2,
//   ShoppingBag,
//   Truck,
//   IndianRupee,
//   FileWarning,
//   AlertTriangle,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { orderDetail } from "@/redux/features/orderSlice";
// import OrderProgress from "../../../../components/OrderProgress";
// import { getInvoice } from "@/redux/features/invoiceSlice";

// /* ---------------- STATUS CONFIG ---------------- */
// const STATUS_CONFIG = {
//   Paid: {
//     icon: IndianRupee,
//     iconBg: "bg-green-100",
//     iconColor: "text-green-600",
//     message: "Your payment was successful.",
//   },
//   Delivered: {
//     icon: CheckCircle2,
//     iconBg: "bg-green-100",
//     iconColor: "text-green-600",
//     message: "Your payment was successful.",
//   },
//   Processing: {
//     icon: Clock,
//     iconBg: "bg-yellow-100",
//     iconColor: "text-yellow-600",
//     message: "Your order is being processed.",
//   },
//   Pending: {
//     icon: Clock,
//     iconBg: "bg-yellow-100",
//     iconColor: "text-yellow-600",
//     message: "Your payment is pending.",
//   },
//   Shipped: {
//     icon: Truck,
//     iconBg: "bg-blue-100",
//     iconColor: "text-blue-600",
//     message: "Your order has been shipped.",
//   },
//   Failed: {
//     icon: AlertTriangle,
//     iconBg: "bg-red-100",
//     iconColor: "text-red-600",
//     message: "Payment failed. Please try again.",
//   },
//   Cancelled: {
//     icon: XCircle,
//     iconBg: "bg-red-100",
//     iconColor: "text-red-600",
//     message: "This order was cancelled.",
//   },
// };

// export default function Page() {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const { orderDetail: orderData, detailLoading } = useSelector(
//     (state) => state.order,
//   );
//   const { loading, invoiceData } = useSelector((state) => state.invoice);

//   const handleDownload = async () => {
//     const res = await dispatch(getInvoice(id)).unwrap();

//     // 🔥 If API returns invoice URL
//     if (res?.invoice_url) {
//       window.open(res.invoice_url, "_blank");
//     }
//   };

//   console.log(orderData);
//   useEffect(() => {
//     if (id) {
//       dispatch(orderDetail(id));
//     }
//   }, [id, dispatch]);

//   if (detailLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading order details...
//       </div>
//     );
//   }

//   if (!orderData) return null;

//   /* ---------------- STATUS HANDLING ---------------- */
//   const currentStatus = orderData.status_display;

//   const statusUI = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Processing;

//   const StatusIcon = statusUI.icon;

//   /* ---------------- DATE FORMAT ---------------- */
//   const formatDate = (date) =>
//     new Date(date).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//   return (
//     <div className="min-h-screen flex flex-col bg-[#FBFBF7]">
//       <main className="flex-1 px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* STATUS HEADER */}
//           <div className="text-center mb-8">
//             <div
//               className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${statusUI.iconBg}`}
//             >
//               <StatusIcon className={`w-10 h-10 ${statusUI.iconColor}`} />
//             </div>

//             <h1 className="text-3xl font-bold">Order Details</h1>
//             <p className="text-gray-600 mt-2">{statusUI.message}</p>
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
//               <p className="font-medium">{formatDate(orderData.created_at)}</p>
//             </div>
//           </div>

//           {/* ORDER STATUS */}
//           <div className="bg-white rounded-xl border p-6 mb-6">
//             <h2 className="font-semibold mb-4">Order Status</h2>
//             <OrderProgress status={orderData.status_display} />
//           </div>

//           {/* ADDRESS + PAYMENT */}
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             {/* ADDRESS */}
//             <div className="bg-white rounded-xl border p-6">
//               <h3 className="font-semibold flex items-center gap-2 mb-3">
//                 <MapPin className="text-green-700" /> Delivery Address
//               </h3>
//               <p className="font-medium">{orderData.address.address_line1}</p>
//               {orderData.address.address_line2 && (
//                 <p className="text-sm text-gray-600">
//                   {orderData.address.address_line2}
//                 </p>
//               )}
//               <p className="text-sm text-gray-600">
//                 {orderData.address.city}, {orderData.address.state} –{" "}
//                 {orderData.address.postal_code}
//               </p>
//               <p className="text-sm text-gray-600">
//                 {orderData.address.country}
//               </p>
//             </div>

//             {/* PAYMENT */}
//             <div className="bg-white rounded-xl border p-6">
//               <h3 className="font-semibold flex items-center gap-2 mb-3">
//                 <CreditCard className="text-green-700" /> Payment Details
//               </h3>
//               <p className="font-medium">
//                 {orderData.latest_transaction?.payment_method}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Ref: {orderData.latest_transaction?.bank_reference}
//               </p>

//               <div
//                 className={`mt-4 rounded-lg p-3 flex items-center gap-2
//                   ${
//                     orderData.payment_status_display === "Paid"
//                       ? "bg-green-50 border border-green-200 text-green-700"
//                       : "bg-red-50 border border-red-200 text-red-700"
//                   }
//                 `}
//               >
//                 {orderData.payment_status_display === "Paid" ? (
//                   <CheckCircle2 size={16} />
//                 ) : (
//                   <XCircle size={16} />
//                 )}
//                 Payment {orderData.payment_status_display}
//               </div>
//             </div>
//           </div>

//           {/* ITEMS */}
//           <div className="bg-white rounded-xl border p-6 mb-6">
//             <h2 className="font-semibold mb-4">Order Items</h2>
//             <div className="space-y-4">
//               {orderData.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex gap-4 bg-gray-50 rounded-lg p-3"
//                 >
//                   <Image
//                     src={item.product.image}
//                     alt={item.product.name}
//                     width={80}
//                     height={80}
//                     className="rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium">{item.product.name}</p>
//                     <p className="text-sm text-gray-600">
//                       Size: {item.product.size}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Qty: {item.quantity}
//                     </p>
//                   </div>
//                   <p className="font-semibold">₹{item.item_total}</p>
//                 </div>
//               ))}
//             </div>

//             {/* PRICE */}
//             <div className="border-t mt-4 pt-4 space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Total</span>
//                 <span>₹{orderData.total_amount}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Discount</span>
//                 <span>-₹{orderData.discount_amount}</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Final Paid</span>
//                 <span className="text-green-700">
//                   ₹{orderData.final_amount}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={handleDownload}
//               disabled={loading}
//               className="border px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-primary bg-primary text-white"
//             >
//               <Download size={16} />
//               {loading ? "Generating..." : "Download Invoice"}
//             </button>

//             <button
//               disabled
//               className="border px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-50"
//             >
//               <Share2 size={16} /> Share Order
//             </button>

//             <Link
//               href="/products"
//               className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 justify-center"
//             >
//               <ShoppingBag size={16} />
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  CreditCard,
  Download,
  Share2,
  ShoppingBag,
  Truck,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { orderDetail } from "@/redux/features/orderSlice";
import OrderProgress from "../../../../components/OrderProgress";
import { getInvoice } from "@/redux/features/invoiceSlice";

/* ---------------- STATUS CONFIG ---------------- */
const STATUS_CONFIG = {
  Paid: {
    icon: IndianRupee,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    message: "Your payment was successful.",
  },
  Delivered: {
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    message: "Your order has been delivered.",
  },
  Processing: {
    icon: Clock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    message: "Your order is being processed.",
  },
  Pending: {
    icon: Clock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    message: "Your payment is pending.",
  },
  Shipped: {
    icon: Truck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    message: "Your order has been shipped.",
  },
  Failed: {
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    message: "Payment failed. Please try again.",
  },
  Cancelled: {
    icon: XCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    message: "This order was cancelled.",
  },
};

export default function Page() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { orderDetail: orderData, detailLoading } = useSelector(
    (state) => state.order,
  );
  const { loading } = useSelector((state) => state.invoice);

  useEffect(() => {
    if (id) dispatch(orderDetail(id));
  }, [id, dispatch]);

  const handleDownload = async () => {
    const res = await dispatch(getInvoice(id)).unwrap();
    if (res?.invoice_url) window.open(res.invoice_url, "_blank");
  };

  if (detailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading order details...
      </div>
    );
  }

  if (!orderData) return null;

  const statusUI =
    STATUS_CONFIG[orderData.status_display] || STATUS_CONFIG.Processing;
  const StatusIcon = statusUI.icon;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#FBFBF7]">
      <main className="px-4 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto">
          {/* STATUS HEADER */}
          <div className="text-center mb-8 px-2">
            <div
              className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 ${statusUI.iconBg}`}
            >
              <StatusIcon
                className={`w-8 h-8 sm:w-10 sm:h-10 ${statusUI.iconColor}`}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              {statusUI.message}
            </p>
          </div>

          {/* ORDER META */}
          <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg sm:text-xl font-bold text-green-700 break-all">
                {orderData.transaction_id}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(orderData.created_at)}</p>
            </div>
          </div>

          {/* ORDER STATUS */}
          <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6 overflow-x-auto">
            <h2 className="font-semibold mb-4">Order Status</h2>
            <OrderProgress status={orderData.status_display} />
          </div>

          {/* ADDRESS + PAYMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* ADDRESS */}
            <div className="bg-white rounded-xl border p-4 sm:p-6">
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
            <div className="bg-white rounded-xl border p-4 sm:p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <CreditCard className="text-green-700" /> Payment Details
              </h3>
              <p className="font-medium">
                {orderData.latest_transaction?.payment_method}
              </p>
              <p className="text-sm text-gray-600">
                Ref: {orderData.latest_transaction?.bank_reference}
              </p>

              <div
                className={`mt-4 rounded-lg p-3 flex items-center gap-2 text-sm
                ${
                  orderData.payment_status_display === "Paid"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {orderData.payment_status_display === "Paid" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                Payment {orderData.payment_status_display}
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white rounded-xl border p-4 sm:p-6 mb-6">
            <h2 className="font-semibold mb-4">Order Items</h2>

            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 bg-gray-50 rounded-lg p-3"
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
                  <p className="font-semibold self-end sm:self-center">
                    ₹{item.item_total}
                  </p>
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
              <div className="flex justify-between font-bold text-base sm:text-lg">
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
              onClick={handleDownload}
              disabled={loading}
              className="px-4 py-2 rounded-lg flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-primary text-white justify-center"
            >
              <Download size={16} />
              {loading ? "Generating..." : "Download Invoice"}
            </button>

            <button
              disabled
              className="border px-4 py-2 rounded-lg flex items-center gap-2
              cursor-not-allowed opacity-50 justify-center"
            >
              <Share2 size={16} /> Share Order
            </button>

            <Link
              href="/products"
              className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 justify-center"
            >
              <ShoppingBag size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
