// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { paymentStatus } from "@/redux/features/paymentSlice";

// import PaymentPending from "../../../components/PaymentPending";
// import PaymentFailed from "../../../components/PaymentFailed";
// import PaymentSuccess from "../../../components/PaymentSuccess";

// const PaymentStatusPage = () => {
//   const dispatch = useDispatch();
//   const { paymentData, loading } = useSelector((state) => state.payment);
//   console.log("PaymentStatusPage paymentData:", paymentData);
//   useEffect(() => {
//     // ✅ sessionStorage only exists in browser
//     if (typeof window === "undefined") return;

//     const transactionId = sessionStorage.getItem("transaction_id");
//     if (transactionId) {
//       dispatch(paymentStatus(transactionId));
//     }
//   }, [dispatch]);

//   // 🔒 VERY IMPORTANT GUARD (FIXES BUILD ERROR)
//   if (loading || !paymentData) {
//     return <PaymentPending />;
//   }

//   // ✅ SUCCESS
//   if (
//     paymentData.transaction_status === "success" ||
//     paymentData.order_status === "PAID"
//   ) {
//     return <PaymentSuccess paymentData={paymentData} />;
//   }

//   // ⏳ PENDING
//   if (
//     paymentData.transaction_status === "pending" ||
//     paymentData.order_status === "PENDING"
//   ) {
//     return <PaymentPending />;
//   }

//   // ❌ FAILED
//   return <PaymentFailed paymentData={paymentData} />;
// };

// export default PaymentStatusPage;

// "use client";

// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { paymentStatus } from "@/redux/features/paymentSlice";

// import PaymentPending from "../../../components/PaymentPending";
// import PaymentFailed from "../../../components/PaymentFailed";
// import PaymentSuccess from "../../../components/PaymentSuccess";

// const PaymentStatusPage = () => {
//   const dispatch = useDispatch();
//   const { paymentData, loading, error } = useSelector((state) => state.payment);
//   console.log("PaymentStatusPage paymentData:", paymentData);
//   // 🔒 Prevent double API call (StrictMode fix)
//   const hasFetched = useRef(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (hasFetched.current) return;

//     const transactionId = sessionStorage.getItem("transaction_id");
//     console.log("transactionId:", transactionId);
//     const orderId = sessionStorage.getItem("order_id");
//     console.log("orderId:", orderId);

//     if (!transactionId) {
//       console.error("❌ transaction_id missing");
//       return;
//     }

//     hasFetched.current = true;
//     dispatch(paymentStatus(transactionId));
//   }, []);

//   // Debug payment data update
//   useEffect(() => {
//     if (paymentData) {
//       console.log("✅ paymentData updated:", paymentData);
//     }
//   }, [paymentData]);

//   // ⏳ Loading
//   if (loading) {
//     return <PaymentPending />;
//   }

//   // ❌ API Error
//   if (error) {
//     return <PaymentFailed paymentData={{ error }} />;
//   }

//   // 🔴 No data (edge case)
//   if (!paymentData) {
//     return <PaymentPending />;
//   }

//   // ✅ SUCCESS
//   if (
//     paymentData.transaction_status === "success" ||
//     paymentData.order_status === "PAID"
//   ) {
//     return <PaymentSuccess paymentData={paymentData} />;
//   }

//   // ⏳ PENDING
//   if (
//     paymentData.transaction_status === "pending" ||
//     paymentData.order_status === "PENDING"
//   ) {
//     return <PaymentPending />;
//   }

//   // ❌ FAILED
//   return <PaymentFailed paymentData={paymentData} />;
// };

// export default PaymentStatusPage;

"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { paymentStatus } from "@/redux/features/paymentSlice";
import PaymentPending from "../../../components/PaymentPending";
import PaymentFailed from "../../../components/PaymentFailed";
import PaymentSuccess from "../../../components/PaymentSuccess";

const PaymentStatusPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { paymentData, loading, error } = useSelector((state) => state.payment);

  const pollingRef = useRef(null);
  const hasRedirected = useRef(false);

  /* ---------------- FETCH + POLL PAYMENT STATUS ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const transactionId = sessionStorage.getItem("transaction_id");

    if (!transactionId) {
      console.error("âŒ transaction_id missing");
      return;
    }

    // First call
    dispatch(paymentStatus(transactionId));

    // Poll every 5 sec if pending
    pollingRef.current = setInterval(() => {
      dispatch(paymentStatus(transactionId));
    }, 5000);

    return () => clearInterval(pollingRef.current);
  }, [dispatch]);

  /* ---------------- STOP POLLING + REDIRECT ---------------- */
  useEffect(() => {
    if (!paymentData) return;

    const isSuccess =
      paymentData.transaction_status === "success" ||
      paymentData.order_status === "PAID";

    const isFailed =
      paymentData.transaction_status === "failed" ||
      paymentData.order_status === "FAILED";

    if ((isSuccess || isFailed) && pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    if (isSuccess && !hasRedirected.current) {
      hasRedirected.current = true;

      const orderId = sessionStorage.getItem("order_id");
      if (!orderId) return;

      setTimeout(() => {
        router.replace(`/order-details/${orderId}`);
      }, 5000);
    }
  }, [paymentData, router]);

  /* ---------------- UI STATES ---------------- */

  if (loading && !paymentData) return <PaymentPending />;

  if (error) {
    return <PaymentFailed paymentData={{ error }} />;
  }

  if (!paymentData) {
    return <PaymentPending />;
  }

  if (
    paymentData.transaction_status === "success" ||
    paymentData.order_status === "PAID"
  ) {
    return <PaymentSuccess paymentData={paymentData} />;
  }

  if (
    paymentData.transaction_status === "pending" ||
    paymentData.order_status === "PENDING"
  ) {
    return <PaymentPending />;
  }

  return <PaymentFailed paymentData={paymentData} />;
};

export default PaymentStatusPage;
