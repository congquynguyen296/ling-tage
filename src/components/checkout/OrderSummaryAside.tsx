"use client";

import { money, getSafeProductImage } from "@/config/utils";
import { CartItem } from "@/types";

interface OrderSummaryAsideProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}

export function OrderSummaryAside({
  items,
  subtotal,
  discountAmount,
  shippingFee,
  total,
}: OrderSummaryAsideProps) {
  return (
    <aside className="card p-6 self-start text-sm">
      <h2 className="text-xs tracking-[0.25em] uppercase mb-5">Your order</h2>
      {items.map((i) => (
        <div key={i.key} className="flex gap-4 mb-4">
          <div
            className="w-14 shrink-0 relative overflow-hidden card"
            style={{ aspectRatio: "3/4" }}
          >
            <img
              src={getSafeProductImage(i.product)}
              alt={i.product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/products/p1-01.jpg";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="uppercase text-xs">{i.product.name}</div>
            <div className="mute text-xs">
              {i.size} · Qty {i.qty}
            </div>
          </div>
          <div>{money(i.product.price * i.qty)}</div>
        </div>
      ))}
      <div className="flex justify-between py-1 border-t line pt-4">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="flex justify-between py-1 text-emerald-700">
          <span>Discount</span>
          <span>−{money(discountAmount)}</span>
        </div>
      )}
      <div className="flex justify-between py-1">
        <span>Shipping</span>
        <span>{shippingFee ? money(shippingFee) : "Free"}</span>
      </div>
      <div className="flex justify-between py-3 mt-2 border-t line text-base">
        <span>Total</span>
        <span>{money(total)}</span>
      </div>
    </aside>
  );
}

