"use client";

import { useState } from "react";
import Link from "next/link";
import { money } from "@/config/utils";
import { useCart } from "@/hooks/useCart";

export function CartSummary() {
  const {
    subtotal,
    discountAmount,
    discountedSubtotal,
    standardShipping,
    amountLeftForFreeShipping,
    couponCode,
    applyCoupon,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState("");

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    setPromoMsg(res.message);
  };

  return (
    <aside className="card p-6 self-start text-sm">
      <h2 className="text-xs tracking-[0.25em] uppercase mb-5">Order summary</h2>
      {amountLeftForFreeShipping > 0 ? (
        <p className="mute text-xs mb-4">
          Add {money(amountLeftForFreeShipping)} more for free shipping.
        </p>
      ) : (
        <p className="text-xs mb-4">You’ve unlocked free shipping.</p>
      )}

      {/* Promo Code Input */}
      <div className="mb-5 pb-4 border-b line">
        <div className="flex gap-2">
          <input
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Promo code (e.g. TAGE10)"
            className="flex-1 bg-transparent border line px-3 py-2 text-xs outline-none uppercase"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="px-3 py-2 border line text-[11px] tracking-[0.15em] uppercase hover:bg-[color:var(--accent)] hover:text-white transition-colors"
          >
            Apply
          </button>
        </div>
        {promoMsg && <p className="text-xs mute mt-1.5">{promoMsg}</p>}
      </div>

      <div className="flex justify-between py-1">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="flex justify-between py-1 text-emerald-700">
          <span>Discount ({couponCode})</span>
          <span>−{money(discountAmount)}</span>
        </div>
      )}
      <div className="flex justify-between py-1">
        <span>Shipping</span>
        <span>{standardShipping ? money(standardShipping) : "Free"}</span>
      </div>
      <div className="flex justify-between py-3 mt-2 border-t line text-base">
        <span>Total</span>
        <span>{money(discountedSubtotal + standardShipping)}</span>
      </div>
      <Link href="/checkout" className="btn w-full block mt-3">
        Checkout
      </Link>
      <Link href="/shop" className="block text-center text-xs mute underline mt-4">
        Continue shopping
      </Link>
    </aside>
  );
}

