"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Crumbs } from "@/components/ui/Crumbs";
import { Accordion } from "@/components/ui/Accordion";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { money, getSafeProductImage } from "@/config/utils";
import { findProductSync } from "@/service/products/queries";
import { useProductStore } from "@/service/products/store";
import { useCartStore } from "@/service/cart/store";
import { Icons } from "@/components/ui/Icons";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const products = useProductStore((s) => s.products);
  const recentlyViewedIds = useProductStore((s) => s.recentlyViewedIds);
  const addRecentlyViewed = useProductStore((s) => s.addRecentlyViewed);
  const wishlistIds = useProductStore((s) => s.wishlistIds);
  const toggleWishlist = useProductStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);

  const product = findProductSync(slug, products);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="py-32 text-center">
        <p className="mute text-sm mb-6">Product not found.</p>
        <Link href="/shop" className="btn">
          Back to shop
        </Link>
      </div>
    );
  }

  const activeVariant = selectedSize
    ? product.variants.find((v) => v.size === selectedSize)
    : null;

  const isWishlisted = wishlistIds.includes(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(product, selectedSize, qty);
  };

  const relatedProducts = products
    .filter((x) => x.id !== product.id)
    .slice(0, 10);

  const recentlyViewedProducts = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const accordionItems: Array<[string, string]> = [
    [
      "Details",
      product.description ||
        "Relaxed, considered fit with clean finishing. Model is 183 cm and wears size M.",
    ],
    [
      "Materials & Care",
      product.materialsAndCare ||
        "Premium natural fibres. Cold wash or dry clean. Store folded or on a wide hanger.",
    ],
    [
      "Shipping & Returns",
      product.shippingAndReturns ||
        "Free shipping over $300. Returns accepted within 30 days in original condition.",
    ],
  ];

  // Structured Data JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "TAGE",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <section className="max-w-[1500px] mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Crumbs items={[["Home", "/"], ["Shop", "/shop"], [product.name]]} />

      <div className="grid md:grid-cols-[1fr_460px] gap-8 md:gap-12 mt-6">
        {/* Image Gallery */}
        <div className="grid md:grid-cols-[80px_1fr] gap-4">
          <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto no-sb">
            {product.images.map((imgUrl, i) => {
              const safeThumb = getSafeProductImage(product, i);
              return (
                <button
                  key={`${imgUrl}-${i}`}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  onMouseEnter={() => setImgIdx(i)}
                  style={{ aspectRatio: "3/4" }}
                  className={`w-16 md:w-full shrink-0 border card p-1 flex items-center justify-center overflow-hidden transition-all bg-[#ebebeb] ${
                    imgIdx === i
                      ? "border-[color:var(--fg)] ring-1 ring-black bg-white"
                      : "line opacity-75 hover:opacity-100 hover:border-neutral-400"
                  }`}
                >
                  <img
                    src={safeThumb}
                    alt={`${product.name} angle ${i + 1}`}
                    className="w-full h-full object-contain object-center"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/products/p1-01.jpg";
                    }}
                  />
                </button>
              );
            })}
          </div>
          <div
            className="w-full order-1 md:order-2 card border line flex items-center justify-center overflow-hidden bg-[#ededed] p-4 relative"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              key={imgIdx}
              src={getSafeProductImage(product, imgIdx)}
              alt={product.name}
              className="w-full h-full object-contain object-center page"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/products/p1-01.jpg";
              }}
            />
          </div>
        </div>

        {/* Product Info */}
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

          {/* Size Selector */}
          <div className="mt-8 flex justify-between text-[11px] tracking-[0.2em] uppercase">
            <span>Size</span>
            <span className={sizeError ? "text-red-500" : "mute"}>
              {sizeError
                ? "Please select a size"
                : activeVariant
                ? activeVariant.stock > 0
                  ? `In stock (${activeVariant.stock} available)`
                  : "Out of stock"
                : "Size guide"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {product.sizes.map((size) => {
              const variant = product.variants?.find((v) => v.size === size);
              const outOfStock = variant ? variant.stock <= 0 : false;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`min-w-12 px-3 py-2.5 text-sm border line transition-colors ${
                    selectedSize === size
                      ? "bg-[color:var(--accent)] text-white"
                      : outOfStock
                      ? "opacity-40 line-through cursor-not-allowed"
                      : "hover:border-[color:var(--fg)]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex gap-3 mt-6">
            <div className="flex items-center border line">
              <button
                type="button"
                className="px-4 py-3"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                className="px-4 py-3"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
            <button type="button" className="btn flex-1" onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>

          {/* Details Accordion */}
          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* Related Products Carousel */}
      <ProductCarousel title="You may also like" items={relatedProducts} />

      {/* Recently Viewed Carousel */}
      {recentlyViewedProducts.length > 0 && (
        <ProductCarousel title="Recently viewed" items={recentlyViewedProducts} />
      )}
    </section>
  );
}

