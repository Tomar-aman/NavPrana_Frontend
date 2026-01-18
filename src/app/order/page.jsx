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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "@/redux/features/orderSlice";
import OrderDetails from "../../../components/OrderDetailsModal";

const Page = () => {
  const dispatch = useDispatch();
  const { fetchLoading, orderList } = useSelector((state) => state.order);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const orders = orderList?.results || [];

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

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
  };

  const statusIcon = {
    Processing: Clock,
    Delivered: CheckCircle2,
    Shipped: Truck,
    Cancelled: XCircle,
    Pending: RefreshCw,
  };

  const statusOptions = [
    { value: "all", label: "All Orders", icon: Filter },
    { value: "Processing", label: "Processing", icon: Clock },
    { value: "Delivered", label: "Delivered", icon: CheckCircle2 },
    { value: "Shipped", label: "Shipped", icon: Truck },
    { value: "Cancelled", label: "Cancelled", icon: XCircle },
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="text-primary" />
            My Orders
          </h1>

          <Link
            href="/products"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border mb-6 flex gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              className="w-full pl-10 border rounded px-3 py-2"
              placeholder="Search by order ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
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
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-left"
                  >
                    <option.icon size={16} />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders */}
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
                className="bg-white border rounded-lg p-5 mb-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold">ORD{order.id}</span>

                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        statusStyle[order.status_display]
                      }`}
                    >
                      {Icon && <Icon size={12} />}
                      {order.status_display}
                    </span>
                  </div>

                  <Link
                    href={`/order-details/${order.id}`}
                    // onClick={() => setSelectedOrderId(order.id)}
                    className="flex items-center gap-1 text-sm border px-3 py-1 rounded cursor-pointer"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                </div>

                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  Ordered on {formatDate(order.created_at)}
                </p>

                <div className="flex justify-between mt-3 items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.first_product_image}
                      alt="Product"
                      className="w-12 h-12 rounded object-cover"
                    />
                    <p className="text-sm text-gray-600">
                      {order.items_count} item(s)
                    </p>
                  </div>

                  <p className="font-bold text-lg">₹{order.final_amount}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* {selectedOrderId && (
        <OrderDetails
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )} */}
    </div>
  );
};

export default Page;
