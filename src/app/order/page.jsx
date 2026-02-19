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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const statusStyle = {
    Processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Delivered: "bg-green-50 text-green-700 border-green-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-gray-50 text-gray-700 border-gray-200",
    Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
  };

  const statusIcon = {
    Processing: Clock,
    Delivered: CheckCircle2,
    Shipped: Truck,
    Cancelled: XCircle,
    Pending: RefreshCw,
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toString().includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || order.status_display === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPagination = (current, total) => {
    const pages = [];
    if (total <= 6) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 2, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 3) pages.push("...");
    pages.push(total - 1);
    pages.push(total);
    return [...new Set(pages)];
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <Package size={14} />
                My Orders
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Order History
              </h1>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition"
            >
              <ShoppingBag size={15} />
              Continue Shopping
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-5 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <input
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                placeholder="Search by order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative w-44">
              <button
                onClick={() => setOpen((p) => !p)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white flex items-center justify-between text-sm cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <currentStatus.icon size={14} />
                  {currentStatus.label}
                </span>
                <ChevronDown size={14} />
              </button>

              {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setOpen(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-primary hover:text-white cursor-pointer text-left transition"
                    >
                      <option.icon size={14} />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          {fetchLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-sm text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <div className="mx-auto w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No orders found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const Icon = statusIcon[order.status_display];

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition"
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-primary">
                          ORD - {order.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${statusStyle[order.status_display] || "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                        >
                          {Icon && <Icon size={10} />}
                          {order.status_display}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        ₹{order.final_amount}
                      </p>
                    </div>

                    {/* Date */}
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-3">
                      <Calendar size={11} />
                      Ordered on {formatDate(order.created_at)}
                    </p>

                    {/* Product + View */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.first_product_image}
                          alt="Product"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {order.first_product_name ||
                              order.items?.[0]?.product?.name ||
                              "Product"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {order.items_count} item(s)
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/order-details/${order.id}`}
                        className="flex items-center gap-1 text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Eye size={12} />
                        View
                        <ArrowRight size={12} />
                      </Link>
                    </div>

                    {/* Delivered + Review */}
                    {order.status_display === "Delivered" && (
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-green-700 text-xs font-medium">
                          <CheckCircle2 size={14} />
                          Order delivered successfully
                        </div>
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
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
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-8 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
              >
                ←
              </button>

              {getPagination(currentPage, totalPages).map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 py-1.5 text-xs text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${currentPage === page
                        ? "bg-primary text-white border-primary"
                        : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
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
      </div>
    </PrivateRoute>
  );
};

export default Page;
