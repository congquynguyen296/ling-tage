"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { money, getSafeProductImage } from "@/config/utils";
import { useCartStore } from "@/service/cart/store";
import { useProductStore } from "@/service/products/store";
import { Icons } from "@/components/ui/Icons";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const wishlistIds = useProductStore((s) => s.wishlistIds);
  const toggleWishlist = useProductStore((s) => s.toggleWishlist);

  const isWishlisted = wishlistIds.includes(product.id);
  const primaryImg = getSafeProductImage(product);

  const handleQuickAdd = () => {
    const targetSize =
      selectedSize || (product.sizes.length === 1 ? product.sizes[0] : null);
    addItem(product, targetSize, 1);
  };

  return (
    <div className="group rv in">
      <div className="relative overflow-hidden card" style={{ aspectRatio: "3/4" }}>
        <img
          src={primaryImg}
          alt={product.name}
          loading="lazy"
          className="pimg absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/images/products/p1-01.jpg";
          }}
        />
        <Link
          href={`/product/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0"
        />

        {product.originalPrice && (
          <span className="absolute left-3 top-3 bg-white text-black text-[10px] tracking-widest px-2 py-1 uppercase z-10">
            Sale
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle Wishlist"
          className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          {Icons.heart(isWishlisted)}
        </button>

        <div className="qa absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[color:var(--bg)]/95 backdrop-blur-sm p-3 z-10">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.sizes.map((size) => {
              const variant = product.variants?.find((v) => v.size === size);
              const outOfStock = variant ? variant.stock <= 0 : false;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[11px] min-w-8 px-2 py-1 border line transition-colors ${
                    selectedSize === size
                      ? "bg-[color:var(--accent)] text-white"
                      : outOfStock
                      ? "opacity-35 line-through cursor-not-allowed"
                      : "hover:border-[color:var(--fg)]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full text-[11px] tracking-[0.2em] uppercase py-2.5 bg-[color:var(--accent)] text-white hover:opacity-90"
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-3 pt-3 text-[13px]">
        <div>
          <Link href={`/product/${product.slug}`} className="uppercase tracking-wide block">
            {product.name}
          </Link>
          <div className="mute text-xs mt-0.5">{product.color}</div>
        </div>
        <div className="sm:text-right whitespace-nowrap">
          {product.originalPrice && (
            <span className="mute line-through mr-2">{money(product.originalPrice)}</span>
          )}
          <span>{money(product.price)}</span>
        </div>
      </div>
    </div>
  );
}

