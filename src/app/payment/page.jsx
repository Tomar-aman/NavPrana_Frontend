"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";
import NavPranaLoader from "../../../components/NavPranaLoader";

const PaymentPage = () => {
  const { orderData } = useSelector((state) => state.order);
  const router = useRouter();
  useEffect(() => {
    // If no payment session exists (user pressed back / refreshed), redirect away
    const timeout = setTimeout(() => {
      if (!orderData?.payment_session_id) {
        router.replace("/checkout");
      }
    }, 1500); // small delay to let Redux state hydrate

    return () => clearTimeout(timeout);
  }, [orderData, router]);

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
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox",
      });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,

        onPayment: (data) => {
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
      <NavPranaLoader />
    </PrivateRoute>
  );
};

export default PaymentPage;
