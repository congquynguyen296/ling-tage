"use client";

import { Product } from "@/types";
import { money, getSafeProductImage } from "@/config/utils";
import { useProductStore } from "@/service/products/store";
import { useCartStore } from "@/service/cart/store";
import { flyToCart } from "@/components/cart/FlyToCart";
import { Icons } from "@/components/ui/Icons";
import { Accordion } from "@/components/ui/Accordion";

interface ProductInfoProps {
  product: Product;
  activeImageIndex: number;
}

export function ProductInfo({ product, activeImageIndex }: ProductInfoProps) {
  const wishlistIds = useProductStore((s) => s.wishlistIds);
  const toggleWishlist = useProductStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);

  const isWishlisted = wishlistIds.includes(product.id);

  // Second hand nature: each product only has 1 unique piece and 1 size
  const productSize =
    product.sizes?.[0] || product.variants?.[0]?.size || "One Size";
  const activeVariant =
    product.variants?.find((v) => v.size === productSize) ||
    product.variants?.[0];
  const isOutOfStock = activeVariant ? activeVariant.stock <= 0 : false;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOutOfStock) return;
    const success = addItem(product, productSize, 1);
    if (success) {
      flyToCart(
        getSafeProductImage(product, activeImageIndex),
        e.currentTarget
      );
    }
  };

  const accordionItems: Array<[string, string]> = [
    [
      "Details & Condition",
      product.description ||
        "Unique archive piece. Relaxed, considered fit with clean architectural finishing. Thoroughly inspected and conditioned.",
    ],
    [
      "Materials & Care",
      product.materialsAndCare ||
        "Premium natural fibres. Cold gentle wash or dry clean only. Store folded or on a contoured hanger.",
    ],
    [
      "Shipping & Returns",
      product.shippingAndReturns ||
        "Free standard shipping on orders over $300. Returns and exchanges accepted within 30 days in unworn original condition.",
    ],
  ];

  return (
    <div className="md:sticky md:top-24 self-start">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="serif text-3xl md:text-4xl">{product.name}</h1>
          <div className="mute text-sm mt-1">
            {product.color} · {product.category}
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
          className="w-10 h-10 border line flex items-center justify-center hover:border-[color:var(--fg)]"
        >
          {Icons.heart(isWishlisted)}
        </button>
      </div>

      <div className="mt-4 text-lg">
        {product.originalPrice && (
          <span className="mute line-through mr-3">
            {money(product.originalPrice)}
          </span>
        )}
        <span>{money(product.price)}</span>
      </div>

      {/* Color Swatch */}
      <div className="mt-6">
        <div className="text-[11px] tracking-[0.2em] uppercase mute mb-2">
          Colour — <span className="text-[color:var(--fg)]">{product.color}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full border border-black/30 ring-2 ring-offset-2 ring-black"
            style={{ backgroundColor: product.colorHex }}
          />
        </div>
      </div>

      {/* Size Info as Text */}
      <div className="mt-8 pt-4 border-t line flex items-center justify-between text-xs tracking-[0.2em] uppercase">
        <div className="flex items-center gap-1.5">
          <span className="mute">Size:</span>
          <span className="font-semibold text-[color:var(--fg)] text-sm">
            {productSize}
          </span>
        </div>
        {isOutOfStock && (
          <span className="text-red-500 font-medium">Out of stock</span>
        )}
      </div>

      {/* Add to Cart button */}
      <div className="mt-6">
        <button
          type="button"
          className="btn w-full py-4 tracking-[0.25em]"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Sold out" : "Add to cart"}
        </button>
      </div>

      {/* Details Accordion */}
      <Accordion items={accordionItems} />
    </div>
  );
}

