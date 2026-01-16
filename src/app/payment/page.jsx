"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const { orderData } = useSelector((state) => state.order);

  useEffect(() => {
    if (!orderData?.payment_session_id) return;

    // Load Cashfree SDK
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;

    script.onload = () => {
      if (!window.Cashfree) return;

      const cashfree = new window.Cashfree({
        mode: "sandbox", // 🔴 production later
      });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [orderData]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium text-gray-700">
        Opening secure payment gateway…
      </p>
    </div>
  );
};

export default PaymentPage;
