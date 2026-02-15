"use client";

import { motion } from "framer-motion";
import { Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";

/**
 * Supported status values:
 * "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Failed"
 */
const OrderProgress = ({ status }) => {

  const steps = [
    { key: "Accepted", label: "Accepted", icon: Package },
    { key: "Processing", label: "Processing", icon: Clock },
    { key: "Shipped", label: "Shipped", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const isCancelled = status === "Cancelled";
  const isFailed = status === "Failed";

  const currentIndex = steps.findIndex((s) => s.key === status);

  // 🔒 Fallback for safety
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="relative w-full mt-8">
      {/* BACKGROUND LINE */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded" />

      {/* ACTIVE LINE (only if not cancelled / failed) */}
      {!isCancelled && !isFailed && (
        <motion.div
          className="absolute top-5 left-0 h-1 bg-green-600 rounded"
          initial={{ width: 0 }}
          animate={{
            width: `${(safeIndex / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {/* STEPS */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = !isCancelled && !isFailed && index <= safeIndex;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center border-2
                  ${isCompleted
                    ? "bg-green-600 border-green-600 text-white shadow-md"
                    : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                <step.icon size={18} />
              </motion.div>

              <span
                className={`text-xs mt-2 font-medium ${isCompleted ? "text-green-700" : "text-gray-400"
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* CANCELLED / FAILED STATE */}
      {(isCancelled || isFailed) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 flex items-center justify-center gap-2 text-red-600 font-medium"
        >
          <XCircle size={20} />
          {isCancelled ? "Order Cancelled" : "Payment Failed"}
        </motion.div>
      )}
    </div>
  );
};

export default OrderProgress;
