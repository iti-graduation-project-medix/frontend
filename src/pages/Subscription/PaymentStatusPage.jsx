import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const SuccessPayment = React.lazy(() => import("../SuccessPayment/SuccessPayment"));
const FailedPayment = React.lazy(() => import("../FailedPayment/FailedPayment"));

export default function PaymentStatusPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const isSuccess = params.get("success") === "true";
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (params.has("success") && !toastShownRef.current) {
      if (isSuccess) {
        toast.success("Payment successful! Thank you for subscribing.");
      } else {
        toast.error("Payment failed. Please try again.");
      }
      toastShownRef.current = true;
    }
  }, [isSuccess, params]);

  return isSuccess ? <SuccessPayment /> : <FailedPayment />;
} 