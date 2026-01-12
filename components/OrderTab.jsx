import { Package } from "lucide-react";
import React from "react";

const OrderTab = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold flex items-center gap-2 mb-4">
        <Package size={18} /> Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="flex justify-between items-center border-b py-4 last:border-none"
        >
          <div>
            <p className="font-medium">{order.id}</p>
            <p className="text-sm text-gray-500">
              {order.date} • {order.items} items
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              {order.status}
            </span>
            <span className="font-semibold">{order.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTab;
