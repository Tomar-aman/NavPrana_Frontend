"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import PaymentSuccess from "../../../components/PaymentSuccess";
import PrivateRoute from "../../../components/PrivateRoute";

const CodSuccessPage = () => {
  const router = useRouter();
  const { orderData } = useSelector((state) => state.order);
  const hasRedirected = useRef(false);

  // If Redux state is lost (refresh), fall back to sessionStorage
  const orderId = orderData?.order_id ?? (typeof window !== "undefined" ? sessionStorage.getItem("cod_order_id") : null);
  const transactionId = orderData?.transaction_id ?? (typeof window !== "undefined" ? sessionStorage.getItem("cod_transaction_id") : null);

  // Save to sessionStorage on mount so refresh still works
  useEffect(() => {
    if (orderData?.order_id) {
      sessionStorage.setItem("cod_order_id", orderData.order_id);
    }
    if (orderData?.transaction_id) {
      sessionStorage.setItem("cod_transaction_id", orderData.transaction_id);
    }
  }, [orderData]);

  // If no order data at all, redirect back to checkout
  useEffect(() => {
    if (!orderId) {
      const t = setTimeout(() => router.replace("/checkout"), 1500);
      return () => clearTimeout(t);
    }
  }, [orderId, router]);

  const handleRedirect = () => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    // Clear COD session keys
    sessionStorage.removeItem("cod_order_id");
    sessionStorage.removeItem("cod_transaction_id");
    router.replace(`/order-details/${orderId}`);
  };

  return (
    <PrivateRoute>
      <PaymentSuccess
        title="Order Placed! 🎉"
        subtitle="Your Cash on Delivery order has been confirmed"
        transactionId={transactionId}
        onRedirect={handleRedirect}
      />
    </PrivateRoute>
  );
};

export default CodSuccessPage;
