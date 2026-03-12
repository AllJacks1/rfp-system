"use client";
import { useSearchParams } from "next/navigation";

export default function CreateRequestForPayment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  return <div>Creating RFP for order: {orderId}</div>;
}
