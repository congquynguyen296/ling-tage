"use client";

import Link from "next/link";
import { CartItem } from "@/types";
import { money, getSafeProductImage } from "@/config/utils";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (delta: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQty, onRemove }: CartItemRowProps) {
  return (
    <div className="page flex gap-5 py-6 border-b line">
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
              onClick={() => onUpdateQty(-1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-7 text-center">{item.qty}</span>
            <button
              type="button"
              className="px-3 py-1.5"
              onClick={() => onUpdateQty(1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="text-xs mute underline hover:text-[color:var(--fg)]"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

