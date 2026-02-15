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
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderDetail } from "@/redux/features/orderSlice";
import OrderProgress from "../../../../components/OrderProgress";
import { getInvoice } from "@/redux/features/invoiceSlice";
import PrivateRoute from "../../../../components/PrivateRoute";
import AddReviewModal from "../../../../components/AddReviewModal";

/* ---------------- STATUS CONFIG ---------------- */
const STATUS_CONFIG = {
  Accepted: {
    icon: CheckCircle,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    message: "Your order has been accepted and will be processed shortly.",
  },
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
  const [showReviewModal, setShowReviewModal] = useState(false);

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
    <PrivateRoute>
      <div className="min-h-screen bg-primary/2 mt-20">
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
            <div className="bg-white rounded-xl border border-primary-border p-4 sm:p-6 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-lg sm:text-xl font-bold text-green-700 break-all">
                  {orderData.transaction_id}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {formatDate(orderData.created_at)}
                </p>
              </div>
            </div>

            {/* ORDER STATUS */}
            <div className="bg-white rounded-xl border border-primary-border p-4 sm:p-6 mb-6 overflow-x-auto">
              <h2 className="font-semibold mb-4">Order Status</h2>
              <OrderProgress status={orderData.status_display} />
            </div>

            {/* ADDRESS + PAYMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* ADDRESS */}
              <div className="bg-white rounded-xl border border-primary-border p-4 sm:p-6">
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
              <div className="bg-white rounded-xl border border-primary-border p-4 sm:p-6">
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
                ${orderData.payment_status_display === "Paid"
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
            <div className="bg-white rounded-xl border border-primary-border p-4 sm:p-6 mb-6">
              <h2 className="font-semibold mb-4">Order Items</h2>

              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.product.size}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right self-end sm:self-center">
                      {/* MRP */}
                      {item.product.max_price && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{item.product.max_price * item.quantity}
                        </p>
                      )}

                      {/* FINAL PRICE */}
                      <p className="font-semibold text-green-700">
                        ₹{item.item_total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRICE */}
              <div className="border-t border-primary-border mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>MRP</span>
                  <span>₹{orderData.total_amount}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{orderData.discount_amount}</span>
                </div>
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span className="text-green-700">
                    ₹{orderData.final_amount}
                  </span>
                </div>
              </div>
            </div>
            {/* DELIVERED SUCCESS + REVIEW */}
            {orderData.status_display === "Delivered" && (
              <div className="my-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                  <CheckCircle2 size={18} />
                  Order delivered successfully
                </div>

                <button
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                  onClick={() => setShowReviewModal(true)}
                >
                  ✍️ Write Review
                </button>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownload}
                disabled={
                  loading ||
                  orderData?.status_display === "Cancelled" ||
                  orderData?.status_display === "Failed"
                }
                className="px-4 py-2 rounded-lg flex items-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-primary text-white justify-center"
              >
                <Download size={16} />
                {loading ? "Generating..." : "Download Invoice"}
              </button>

              {/* <button
                disabled
                className="border px-4 py-2 rounded-lg flex items-center gap-2
              cursor-not-allowed opacity-50 justify-center"
              >
                <Share2 size={16} /> Share Order
              </button> */}

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
        {/* REVIEW MODAL */}
        <AddReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          orderId={orderData.transaction_id}
          productName={orderData.items?.[0]?.product?.name || "Product"}
          productImage={orderData.items?.[0]?.product?.image}
          productId={orderData.items?.[0]?.product?.id}
        />
      </div>
    </PrivateRoute>
  );
}
