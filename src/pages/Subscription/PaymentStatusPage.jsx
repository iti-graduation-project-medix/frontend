import React from "react";
import { useLocation } from "react-router-dom";

const SuccessPayment = React.lazy(() => import("../SuccessPayment/SuccessPayment"));
const FailedPayment = React.lazy(() => import("../FailedPayment/FailedPayment"));

export default function PaymentStatusPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const isSuccess = params.get("success") === "true";

  return isSuccess ? <SuccessPayment /> : <FailedPayment />;
} 