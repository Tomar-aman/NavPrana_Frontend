"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";
import { hideLoader } from "@/redux/features/uiSlice";
import { getCashfree } from "@/lib/cashfree";
import { toast } from "sonner";

const PaymentPage = () => {
  const { orderData } = useSelector((state) => state.order);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // COD orders skip Cashfree entirely — redirect straight to order details
    if (orderData?.payment_method === "cod" && orderData?.order_id) {
      dispatch(hideLoader());
      router.replace(`/order-details/${orderData.order_id}`);
      return;
    }

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

    // Resolves instantly when checkout already warmed the SDK up.
    let cancelled = false;

    getCashfree()
      .then((cashfree) => {
        if (cancelled) return;

        // Hide global loader right before Cashfree UI opens
        dispatch(hideLoader());

        cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          onPayment: () => {
            router.replace("/payment-status");
          },
        });
      })
      .catch(() => {
        if (cancelled) return;
        dispatch(hideLoader());
        toast.error("Could not open the payment window. Please try again.");
        router.replace("/checkout");
      });

    return () => {
      cancelled = true;
    };
  }, [orderData, router, dispatch]);

  return (
    <PrivateRoute>
      <div className="min-h-screen" />
    </PrivateRoute>
  );
};

export default PaymentPage;
