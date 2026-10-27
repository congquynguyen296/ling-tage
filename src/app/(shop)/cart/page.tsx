"use client";

import Link from "next/link";
import { money, getSafeProductImage } from "@/config/utils";
import { useCart } from "@/hooks/useCart";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, updateQty, removeItem } = useCart();

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
            <div key={item.key} className="page flex gap-5 py-6 border-b line">
              <Link
                href={`/product/${item.product.slug}`}
                className="w-24 shrink-0 block relative overflow-hidden card"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={getSafeProductImage(item.product)}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/images/products/p1-01.jpg";
                  }}
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between text-sm">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="uppercase tracking-wide hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <div className="mute text-xs mt-1">
                      {item.color} · {item.size}
                    </div>
                  </div>
                  <div>{money(item.product.price * item.qty)}</div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border line">
                    <button
                      type="button"
                      className="px-3 py-1.5"
                      onClick={() => updateQty(item.key, -1)}
                    >
                      −
                    </button>
                    <span className="w-7 text-center">{item.qty}</span>
                    <button
                      type="button"
                      className="px-3 py-1.5"
                      onClick={() => updateQty(item.key, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-xs mute underline"
                    onClick={() => removeItem(item.key)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CartSummary />
      </div>
    </section>
  );
}

