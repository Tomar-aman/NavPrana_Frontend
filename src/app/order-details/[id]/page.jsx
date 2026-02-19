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
  ShoppingBag,
  Truck,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderDetail } from "@/redux/features/orderSlice";
import OrderProgress from "../../../../components/OrderProgress";
import { getInvoice } from "@/redux/features/invoiceSlice";
import PrivateRoute from "../../../../components/PrivateRoute";
import AddReviewModal from "../../../../components/AddReviewModal";
import NavPranaLoader from "../../../../components/NavPranaLoader";

/* ---------------- STATUS CONFIG ---------------- */
const STATUS_CONFIG = {
  Accepted: {
    icon: CheckCircle,
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    message: "Your order has been accepted and will be processed shortly.",
  },
  Paid: {
    icon: IndianRupee,
    color: "bg-green-50",
    iconColor: "text-green-600",
    message: "Your payment was successful.",
  },
  Delivered: {
    icon: CheckCircle2,
    color: "bg-green-50",
    iconColor: "text-green-600",
    message: "Your order has been delivered.",
  },
  Processing: {
    icon: Clock,
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
    message: "Your order is being processed.",
  },
  Pending: {
    icon: Clock,
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
    message: "Your payment is pending.",
  },
  Shipped: {
    icon: Truck,
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    message: "Your order has been shipped.",
  },
  Failed: {
    icon: AlertTriangle,
    color: "bg-red-50",
    iconColor: "text-red-500",
    message: "Payment failed. Please try again.",
  },
  Cancelled: {
    icon: XCircle,
    color: "bg-red-50",
    iconColor: "text-red-500",
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
    return <NavPranaLoader />;
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
      <div className="min-h-screen bg-background mt-20">
        <main className="px-4 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back */}
            <Link
              href="/order"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-5"
            >
              <ArrowLeft size={15} /> Back to Orders
            </Link>

            {/* Status Header */}
            <div className="text-center mb-6">
              <div
                className={`mx-auto w-14 h-14 ${statusUI.color} rounded-2xl flex items-center justify-center mb-3`}
              >
                <StatusIcon className={`w-7 h-7 ${statusUI.iconColor}`} />
              </div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {statusUI.message}
              </p>
            </div>

            {/* Order Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-4 flex flex-col sm:flex-row gap-3 justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Order ID
                </p>
                <p className="text-sm font-bold text-primary break-all mt-0.5">
                  {orderData.transaction_id}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Order Date
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {formatDate(orderData.created_at)}
                </p>
              </div>
            </div>

            {/* Order Progress */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-4 overflow-x-auto">
              <h2 className="text-sm font-semibold mb-3">Order Status</h2>
              <OrderProgress status={orderData.status_display} />
            </div>

            {/* Address + Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Address */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <MapPin size={15} className="text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold">Delivery Address</h3>
                </div>
                <div className="text-xs space-y-0.5 ml-10">
                  <p className="font-medium text-foreground">
                    {orderData.address.address_line1}
                  </p>
                  {orderData.address.address_line2 && (
                    <p className="text-muted-foreground">
                      {orderData.address.address_line2}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    {orderData.address.city}, {orderData.address.state} –{" "}
                    {orderData.address.postal_code}
                  </p>
                  <p className="text-muted-foreground">
                    {orderData.address.country}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CreditCard size={15} className="text-blue-500" />
                  </div>
                  <h3 className="text-sm font-semibold">Payment Details</h3>
                </div>
                <div className="text-xs space-y-0.5 ml-10">
                  <p className="font-medium text-foreground">
                    {orderData.latest_transaction?.payment_method}
                  </p>
                  <p className="text-muted-foreground">
                    Ref: {orderData.latest_transaction?.bank_reference}
                  </p>
                </div>

                <div
                  className={`mt-3 ml-10 inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border ${orderData.payment_status_display === "Paid"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-600"
                    }`}
                >
                  {orderData.payment_status_display === "Paid" ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  Payment {orderData.payment_status_display}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-4">
              <h2 className="text-sm font-semibold mb-3">Order Items</h2>

              <div className="space-y-3">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">
                        {item.product.name}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[11px] text-muted-foreground bg-white px-1.5 py-0.5 rounded">
                          Size: {item.product.size}
                        </span>
                        <span className="text-[11px] text-muted-foreground bg-white px-1.5 py-0.5 rounded">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right self-center shrink-0">
                      {item.product.max_price && (
                        <p className="text-[10px] text-muted-foreground line-through">
                          ₹{item.product.max_price * item.quantity}
                        </p>
                      )}
                      <p className="text-xs font-bold text-foreground">
                        ₹{item.item_total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-100 mt-4 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MRP</span>
                  <span>₹{orderData.total_amount}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{orderData.discount_amount}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="text-foreground">₹{orderData.final_amount}</span>
                </div>
              </div>
            </div>

            {/* Delivered + Review */}
            {orderData.status_display === "Delivered" && (
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-green-700 text-xs font-medium">
                  <CheckCircle2 size={14} />
                  Order delivered successfully
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                  onClick={() => setShowReviewModal(true)}
                >
                  ✍️ Write Review
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDownload}
                disabled={
                  loading ||
                  orderData?.status_display === "Cancelled" ||
                  orderData?.status_display === "Failed"
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download size={15} />
                {loading ? "Generating..." : "Download Invoice"}
              </button>

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 transition"
              >
                <ShoppingBag size={15} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>

        {/* Review Modal */}
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
