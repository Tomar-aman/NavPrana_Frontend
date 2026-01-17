"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MapPin,
  CreditCard,
  X,
  Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { orderDetail } from "@/redux/features/orderSlice";

const OrderDetailsModal = ({ orderId, onClose }) => {
  const dispatch = useDispatch();

  const { orderDetail: orderData, detailLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (orderId) {
      dispatch(orderDetail(orderId));
    }
  }, [orderId, dispatch]);

  if (!orderId) return null;

  if (detailLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <p className="bg-white px-6 py-3 rounded-lg">Loading order details…</p>
      </div>
    );
  }

  if (!orderData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-[#FBFBF7] w-full max-w-3xl rounded-2xl p-6 relative max-h-[100vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-lg font-semibold">
            Order {orderData.transaction_id}
          </h2>

          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
            <CheckCircle2 size={14} />
            {orderData.payment_status_display}
          </span>
        </div>

        <p className="text-sm text-green-700 flex items-center gap-2 mb-6">
          <Calendar size={14} />
          Ordered on{" "}
          {new Date(orderData.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* ITEMS */}
        <h3 className="font-semibold mb-3">Order Items</h3>

        <div className="space-y-4">
          {orderData.items.map((item) => (
            <div
              key={item.id}
              className="bg-[#F4F6EF] rounded-xl p-4 flex items-center gap-4"
            >
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={56}
                height={56}
                className="rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-green-700">
                  Size: {item.product.size}
                </p>
                <p className="text-sm text-green-700">Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold text-lg">₹{item.item_total}</p>
            </div>
          ))}
        </div>

        {/* ADDRESS & PAYMENT */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {/* Address */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-green-700" />
              Delivery Address
            </h4>
            <p className="text-sm text-green-700">
              {orderData.address.address_line1}
            </p>
            {orderData.address.address_line2 && (
              <p className="text-sm text-green-700">
                {orderData.address.address_line2}
              </p>
            )}
            <p className="text-sm text-green-700">
              {orderData.address.city}, {orderData.address.state} –{" "}
              {orderData.address.postal_code}
            </p>
            <p className="text-sm text-green-700">
              {orderData.address.country}
            </p>
          </div>

          {/* Payment */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-green-700" />
              Payment Method
            </h4>
            <p className="text-sm font-medium">
              {orderData.latest_transaction?.payment_method || "—"}
            </p>
            <p className="text-sm text-green-700">
              Ref: {orderData.latest_transaction?.bank_reference}
            </p>
          </div>
        </div>

        {/* TOTAL */}
        <div className="border-t mt-8 pt-4 flex justify-between items-center">
          <span className="font-semibold text-lg">Total Paid</span>
          <span className="text-2xl font-bold text-green-700">
            ₹{orderData.final_amount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
