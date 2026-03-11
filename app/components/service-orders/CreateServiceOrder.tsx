"use client";

import { useSearchParams } from "next/navigation";

export default function CreateServiceOrder() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  return (
    <div>
      <h1>Create Service Order from Request: {requestId}</h1>
      {/* Your form */}
    </div>
  );
}
