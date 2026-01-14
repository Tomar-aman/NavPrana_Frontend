"use client";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, Home, Phone, AlertTriangle } from "lucide-react";
import Link from "next/link";

const PaymentFailed = () => {
  const failureReasons = [
    "Insufficient funds in your account",
    "Card declined by issuing bank",
    "Network timeout during transaction",
    "Invalid card details entered",
  ];

  const randomReason =
    failureReasons[Math.floor(Math.random() * failureReasons.length)];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-500/5 to-background px-4 py-12">
      <div className="text-center max-w-md mx-auto">
        {/* ❌ Failed Icon */}
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mx-auto w-32 h-32 mb-8"
        >
          <motion.div
            className="absolute inset-0 bg-red-500/20 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: 2 }}
          />
          <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
            <XCircle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* ❌ Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We couldn't process your payment
          </p>
          <p className="text-sm text-gray-500">
            Don't worry, no amount has been deducted
          </p>
        </motion.div>

        {/* ⚠️ Custom Card (Tailwind) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 border border-red-500/20 bg-red-500/5 rounded-xl p-4"
        >
          <div className="flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-red-600">
                Reason for failure:
              </p>
              <p className="text-sm text-gray-600 mt-1">{randomReason}</p>
            </div>
          </div>
        </motion.div>

        {/* 🧾 Reference */}
        <motion.div
          className="mt-6 p-4 bg-gray-100 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-600">
            Reference ID:{" "}
            <span className="font-mono font-medium text-black">
              REF{Date.now().toString().slice(-8)}
            </span>
          </p>
        </motion.div>

        {/* 🔘 Buttons (Tailwind Only) */}
        <motion.div
          className="mt-8 flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 border rounded-lg py-3 hover:bg-gray-100 transition"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>

            <Link
              href="/contact"
              className="flex-1 inline-flex items-center justify-center gap-2 border rounded-lg py-3 hover:bg-gray-100 transition"
            >
              <Phone className="w-4 h-4" />
              Contact Support
            </Link>
          </div>
        </motion.div>

        {/* 💡 Suggestions */}
        <motion.div
          className="mt-8 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm font-medium mb-3">You can try:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "Using a different payment method",
              "Checking your card details",
              "Contacting your bank for authorization",
              "Trying again after a few minutes",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ☎️ Help */}
        <motion.p
          className="mt-8 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          If the amount was deducted, it will be refunded within 5–7 business
          days.
          <br />
          For immediate assistance, call{" "}
          <span className="text-red-600 font-medium">1800-XXX-XXXX</span>
        </motion.p>
      </div>
    </div>
  );
};

export default PaymentFailed;
