"use client";

import { useEffect } from "react";

const CashfreePayment = ({ paymentSessionId }) => {
  useEffect(() => {
    // Load Cashfree SDK dynamically
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePay = () => {
    if (!window.Cashfree) {
      alert("Cashfree SDK not loaded");
      return;
    }

    const cashfree = new window.Cashfree({
      mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox", // 🔴 change to "production" in live
    });

    cashfree.checkout({
      paymentSessionId: paymentSessionId,
    });
  };

  return (
    <button
      onClick={handlePay}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
    >
      Pay Now
    </button>
  );
};

export default CashfreePayment;
