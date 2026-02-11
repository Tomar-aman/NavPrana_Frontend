"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";

const PaymentPage = () => {
  const { orderData } = useSelector((state) => state.order);
  const router = useRouter();
  console.log("Order Data in PaymentPage:", orderData);
  useEffect(() => {
    if (!orderData?.payment_session_id) return;

    // Save transaction_id for status page
    if (orderData.order_id) {
      sessionStorage.setItem("order_id", orderData.order_id);
    }
    if (orderData.transaction_id) {
      sessionStorage.setItem("transaction_id", orderData.transaction_id);
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;

    script.onload = () => {
      if (!window.Cashfree) return;

      const cashfree = new window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox", // production later
      });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,

        // ✅ THIS CALLBACK ALWAYS FIRES
        onPayment: (data) => {

          // 🔁 Navigate AFTER payment completes
          router.replace("/payment-status");
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [orderData, router]);

  return (
    <PrivateRoute>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-700">
          Opening secure payment gateway…
        </p>
      </div>
    </PrivateRoute>
  );
};

export default PaymentPage;
