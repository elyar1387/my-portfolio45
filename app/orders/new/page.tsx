"use client";

import { Suspense } from "react";
import OrdersForm from "./OrdersForm";

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <OrdersForm />
    </Suspense>
  );
}
