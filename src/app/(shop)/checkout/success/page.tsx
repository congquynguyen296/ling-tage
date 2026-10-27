"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { money } from "@/config/utils";
import { useOrderStore } from "@/service/orders/service";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("order");
  const lastPlacedOrder = useOrderStore((s) => s.lastPlacedOrder);
  const orders = useOrderStore((s) => s.orders);

  const matchedOrder =
    orders.find((o) => o.orderNumber === orderNumberParam) || lastPlacedOrder;

  return (
    <section className="max-w-xl mx-auto px-5 py-28 text-center">
      <div className="text-[11px] tracking-[0.3em] uppercase mute mb-3">
        Order confirmed
      </div>
      <h1 className="serif text-4xl mb-4">Thank you</h1>
      {matchedOrder ? (
        <>
          <p className="text-sm mute mb-2">
            Order {matchedOrder.orderNumber} · {money(matchedOrder.total)}
          </p>
          <p className="text-sm mute mb-8">
            A confirmation email has been queued for {matchedOrder.customerEmail}.
          </p>
        </>
      ) : (
        <p className="text-sm mute mb-8">
          Order {orderNumberParam || "TG-CONFIRMED"} has been received.
        </p>
      )}
      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/shop" className="btn">
          Keep shopping
        </Link>
        <Link
          href="/account/orders"
          className="border border-current text-xs tracking-[0.25em] uppercase px-7 py-3.5"
        >
          View order history
        </Link>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-28 text-center text-xs tracking-[0.2em] uppercase mute">
          Loading confirmation...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

