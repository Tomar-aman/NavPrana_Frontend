"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";
import { hideLoader } from "@/redux/features/uiSlice";

const PaymentPage = () => {
  const { orderData } = useSelector((state) => state.order);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // If no payment session exists (user pressed back / refreshed), redirect away
    const timeout = setTimeout(() => {
      if (!orderData?.payment_session_id) {
        dispatch(hideLoader());
        router.replace("/checkout");
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [orderData, router, dispatch]);

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

      // Hide global loader right before Cashfree UI opens
      dispatch(hideLoader());

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
  }, [orderData, router, dispatch]);

  return (
    <PrivateRoute>
      <div className="min-h-screen" />
    </PrivateRoute>
  );
};

export default PaymentPage;
