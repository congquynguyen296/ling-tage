"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, removeItem } = useCart();

  if (!items.length) {
    return (
      <section className="max-w-xl mx-auto px-5 py-32 text-center">
        <h1 className="serif text-4xl mb-4">Your cart is empty</h1>
        <p className="mute text-sm mb-8">
          Discover the new TAGE arrivals and find something you’ll wear for years.
        </p>
        <Link href="/shop" className="btn">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-[1200px] mx-auto px-5 py-12">
      <h1 className="serif text-4xl mb-8">Cart</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        <div className="border-t line">
          {items.map((item) => (
            <CartItemRow
              key={item.key}
              item={item}
              onRemove={() => removeItem(item.key)}
            />
          ))}
        </div>

        <CartSummary />
      </div>
    </section>
  );
}
