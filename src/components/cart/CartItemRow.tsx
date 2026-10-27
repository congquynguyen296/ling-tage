"use client";

import Link from "next/link";
import { CartItem } from "@/types";
import { money, getSafeProductImage } from "@/config/utils";

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
}

export function CartItemRow({ item, onRemove }: CartItemRowProps) {
  const descriptionText =
    item.product.description ||
    "Unique archive piece. Relaxed, considered fit with clean architectural finishing.";

  return (
    <div className="page flex gap-5 py-6 border-b line">
      {/* Product Image */}
      <Link
        href={`/product/${item.product.slug}`}
        className="w-24 sm:w-28 shrink-0 block relative overflow-hidden card"
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

      {/* Product Details & Description */}
      <div className="flex-1 flex flex-col justify-between text-sm">
        <div>
          {/* Title and Price */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <Link
                href={`/product/${item.product.slug}`}
                className="uppercase tracking-wide font-medium hover:underline block"
              >
                {item.product.name}
              </Link>
              <div className="mute text-xs mt-1">
                {item.color} · Size {item.size}
              </div>
            </div>
            <div className="font-medium whitespace-nowrap">{money(item.product.price)}</div>
          </div>

          {/* Product Description (replaces the quantity selector) */}
          <p className="mute text-xs leading-relaxed mt-2.5 line-clamp-2 sm:line-clamp-3 max-w-xl">
            {descriptionText}
          </p>
        </div>

        {/* Footer actions: Qty indicator & Remove */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t line/50">
          <span className="text-[11px] tracking-wider uppercase text-neutral-500 font-mono">
            Qty: 1
          </span>
          <button
            type="button"
            className="text-xs mute underline hover:text-[color:var(--fg)] transition-colors"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
