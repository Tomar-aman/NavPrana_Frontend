"use client";

import { motion } from "framer-motion";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";

/**
 * status values supported:
 * "placed" | "processing" | "shipped" | "delivered"
 */
const OrderProgress = ({ status }) => {
  console.log(status);
  const steps = [
    { key: "Placed", label: "Order Placed", icon: Package },
    { key: "Processing", label: "Processing", icon: Clock },
    { key: "Shipped", label: "Shipped", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="relative w-full mt-8">
      {/* Background Line */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded" />

      {/* Active Line */}
      <motion.div
        className="absolute top-5 left-0 h-1 bg-green-600 rounded"
        initial={{ width: 0 }}
        animate={{
          width: `${(currentIndex / (steps.length - 1)) * 100}%`,
        }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isCompleted ? 1.1 : 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.12,
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center border-2
                  ${
                    isCompleted
                      ? "bg-green-600 border-green-600 text-white shadow-lg"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                <step.icon size={18} />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`text-xs mt-2 font-medium ${
                  isCompleted ? "text-green-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgress;
