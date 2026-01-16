"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Loader2,
  RefreshCw,
  CheckCircle2,
  HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const PaymentPending = () => {
  // Simulate background status check
  useEffect(() => {
    const timeout = setTimeout(() => {
      const random = Math.random();
      if (random > 0.5) {
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const steps = [
    "Initiating payment",
    "Verifying transaction",
    "Waiting for bank confirmation",
    "Finalizing status",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-500/5 to-background px-4 py-12">
      <div className="text-center max-w-md mx-auto">
        {/* ⏳ Pending Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mx-auto w-32 h-32 mb-8"
        >
          <motion.div
            className="absolute inset-0 bg-yellow-500/20 rounded-full"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-16 h-16 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* 📝 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Payment Pending
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your payment is being processed
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we confirm the transaction
          </p>
        </motion.div>

        {/* 🔄 Processing Status (NEW) */}
        <motion.div
          className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
            <span className="text-sm font-medium text-yellow-700">
              Checking payment status
            </span>
          </div>

          <ul className="space-y-3 text-sm">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-2 text-gray-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.2 }}
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                {step}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 🧾 Transaction Info */}
        <motion.div
          className="mt-6 p-4 bg-gray-100 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-600">
            Transaction ID:{" "}
            <span className="font-mono font-medium text-black">
              TXN{Date.now().toString().slice(-8)}
            </span>
          </p>
        </motion.div>

        {/* 🔘 Buttons */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => navigate("/payment-pending")}
            className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </button>

          <Link
            href="/"
            className="inline-flex text-black items-center justify-center gap-2 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-100 transition"
          >
            <HomeIcon className="w-4 h-4" />
            Go to Home
          </Link>
        </motion.div>

        {/* ℹ️ Help */}
        <motion.p
          className="mt-6 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Payment confirmation may take a few moments.
          <br />
          If it fails, you will be redirected automatically.
        </motion.p>
      </div>
    </div>
  );
};

export default PaymentPending;
