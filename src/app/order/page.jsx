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

const Page = () => {
  const dispatch = useDispatch();
  const { fetchLoading, orderList } = useSelector((state) => state.order);

  console.log("Order List:", orderList.count);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);

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
          <div className="bg-white p-4 rounded-lg border mb-6 flex gap-4">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />
              <input
                className="w-full pl-10 border rounded px-3 py-2"
                placeholder="Search by order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* STATUS FILTER */}
            <div className="relative w-48">
              <button
                onClick={() => setOpen((p) => !p)}
                className="w-full border rounded px-3 py-2 bg-white flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <currentStatus.icon size={16} />
                  {currentStatus.label}
                </span>
                <ChevronDown size={16} />
              </button>

              {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow cursor-pointer">
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
                  className="bg-white border rounded-xl p-5 mb-4"
                >
                  {/* TOP ROW */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">
                        ORD - {order.id}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                          statusStyle[order.status_display]
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
                      className="flex items-center gap-1 text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      <Eye size={14} />
                      View Details
                      <ArrowRight size={14} />
                    </Link>
                  </div>
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
              className="px-3 py-2 border rounded-lg disabled:opacity-40"
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ←
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition
          ${
            currentPage === page
              ? "bg-primary text-white border-primary"
              : "hover:bg-gray-100"
          }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-40"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default Page;
