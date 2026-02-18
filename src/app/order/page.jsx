"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Eye,
  Calendar,
  ShoppingBag,
  ChevronDown,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "@/redux/features/orderSlice";
import PrivateRoute from "../../../components/PrivateRoute";
import { useSearchParams, useRouter } from "next/navigation";
import AddReviewModal from "../../../components/AddReviewModal";

const Page = () => {
  const dispatch = useDispatch();
  const { fetchLoading, orderList } = useSelector((state) => state.order);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const orders = orderList?.results || [];

  useEffect(() => {
    dispatch(getOrder(currentPage));
  }, [dispatch, currentPage]);

  const totalPages = Math.ceil((orderList?.count || 0) / 10);

  /* ---------------- HELPERS ---------------- */

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const statusStyle = {
    Processing: "bg-yellow-100 text-yellow-700",
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
    Pending: "bg-gray-100 text-gray-700",
    // ✅ NEW
    Accepted: "bg-emerald-100 text-emerald-700",
    Failed: "bg-red-100 text-red-700",
  };

  const statusIcon = {
    Processing: Clock,
    Delivered: CheckCircle2,
    Shipped: Truck,
    Cancelled: XCircle,
    Pending: RefreshCw,
    // ✅ NEW
    Accepted: ShieldCheck,
    Failed: AlertTriangle,
  };

  const statusOptions = [
    { value: "all", label: "All Orders", icon: Filter },
    { value: "Processing", label: "Processing", icon: Clock },
    { value: "Delivered", label: "Delivered", icon: CheckCircle2 },
    { value: "Shipped", label: "Shipped", icon: Truck },
    { value: "Cancelled", label: "Cancelled", icon: XCircle },
    { value: "Failed", label: "Failed", icon: AlertTriangle },
    { value: "Accepted", label: "Accepted", icon: ShieldCheck },
  ];

  const currentStatus =
    statusOptions.find((s) => s.value === statusFilter) || statusOptions[0];

  /* ---------------- FILTER ---------------- */

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toString().includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || order.status_display === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPagination = (current, total) => {
    const pages = [];

    // If pages are small, show all
    if (total <= 6) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Left dots
    if (current > 3) pages.push("...");

    // Middle pages (current -1, current, current +1)
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 2, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right dots
    if (current < total - 3) pages.push("...");

    // Always show second last & last
    pages.push(total - 1);
    pages.push(total);

    return [...new Set(pages)];
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 px-4 py-30">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="text-primary" />
              My Orders
            </h1>

            <Link
              href="/products"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
            >
              <ShoppingBag size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* FILTERS */}
          <div className="bg-white p-4 rounded-lg border border-primary-border mb-6 flex gap-4">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />
              <input
                className="w-full pl-10 border border-primary-border rounded px-3 py-2"
                placeholder="Search by order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* STATUS FILTER */}
            <div className="relative w-48">
              <button
                onClick={() => setOpen((p) => !p)}
                className="w-full border border-primary-border rounded px-3 py-2 bg-white flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <currentStatus.icon size={16} />
                  {currentStatus.label}
                </span>
                <ChevronDown size={16} />
              </button>

              {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-primary-border rounded shadow cursor-pointer">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setOpen(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-primary hover:text-white cursor-pointer text-left"
                    >
                      <option.icon size={16} />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ORDERS */}
          {fetchLoading ? (
            <p className="text-center text-gray-500">Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found</p>
          ) : (
            filteredOrders.map((order) => {
              const Icon = statusIcon[order.status_display];

              return (
                <div
                  key={order.id}
                  className="bg-white border border-primary-border rounded-xl p-5 mb-4"
                >
                  {/* TOP ROW */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">
                        ORD - {order.id}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${statusStyle[order.status_display]
                          }`}
                      >
                        {Icon && <Icon size={12} />}
                        {order.status_display}
                      </span>
                    </div>

                    {/* TOTAL PRICE */}
                    <p className="font-bold text-lg text-primary">
                      ₹{order.final_amount}
                    </p>
                  </div>

                  {/* DATE */}
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <Calendar size={14} />
                    Ordered on {formatDate(order.created_at)}
                  </p>

                  {/* PRODUCT INFO + VIEW */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.first_product_image}
                        alt="Product"
                        className="w-12 h-12 rounded object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {order.first_product_name ||
                            order.items?.[0]?.product?.name ||
                            "Product"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items_count} item(s)
                        </p>
                      </div>
                    </div>

                    {/* VIEW DETAILS */}
                    <Link
                      href={`/order-details/${order.id}`}
                      className="flex items-center gap-1 text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-50 border-primary-border"
                    >
                      <Eye size={14} />
                      View Details
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* DELIVERED SUCCESS + REVIEW */}
                  {order.status_display === "Delivered" && (
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                        <CheckCircle2 size={18} />
                        Order delivered successfully
                      </div>

                      <button
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                        onClick={() => {
                          setReviewData({
                            orderId: order.id,
                            productId: order.items?.[0]?.product?.id || order.items?.[0]?.product_id || order.id,
                            productName: order.first_product_name || order.items?.[0]?.product?.name || "Product",
                            productImage: order.first_product_image,
                          });
                          setShowReviewModal(true);
                        }}
                      >
                        ✍️ Write Review
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            {/* Previous */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-2 border border-primary-border rounded-lg disabled:opacity-40"
            >
              ←
            </button>

            {/* Page Numbers */}
            {getPagination(currentPage, totalPages).map((page, index) =>
              page === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="px-3 py-2 text-gray-500 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border border-primary-border text-sm font-medium transition
            ${currentPage === page
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-2 border border-primary-border rounded-lg disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}

        {reviewData && (
          <AddReviewModal
            isOpen={showReviewModal}
            onClose={() => {
              setShowReviewModal(false);
              setReviewData(null);
            }}
            orderId={reviewData.orderId}
            productId={reviewData.productId}
            productName={reviewData.productName}
            productImage={reviewData.productImage}
          />
        )}
      </div>
    </PrivateRoute>
  );
};

export default Page;
