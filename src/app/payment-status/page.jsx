"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentStatus } from "@/redux/features/paymentSlice";

import PaymentPending from "../../../components/PaymentPending";
import PaymentFailed from "../../../components/PaymentFailed";
import PaymentSuccess from "../../../components/PaymentSuccess";

const PaymentStatusPage = () => {
  const dispatch = useDispatch();
  const { paymentData, loading } = useSelector((state) => state.payment);

  useEffect(() => {
    // ✅ sessionStorage only exists in browser
    if (typeof window === "undefined") return;

    const transactionId = sessionStorage.getItem("transaction_id");
    if (transactionId) {
      dispatch(paymentStatus(transactionId));
    }
  }, [dispatch]);

  // 🔒 VERY IMPORTANT GUARD (FIXES BUILD ERROR)
  if (loading || !paymentData) {
    return <PaymentPending />;
  }

  // ✅ SUCCESS
  if (
    paymentData.transaction_status === "success" ||
    paymentData.order_status === "PAID"
  ) {
    return <PaymentSuccess paymentData={paymentData} />;
  }

  // ⏳ PENDING
  if (
    paymentData.transaction_status === "pending" ||
    paymentData.order_status === "PENDING"
  ) {
    return <PaymentPending />;
  }

  // ❌ FAILED
  return <PaymentFailed paymentData={paymentData} />;
};

export default PaymentStatusPage;
