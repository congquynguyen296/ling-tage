"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Crumbs } from "@/components/ui/Crumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductImageZoomModal } from "@/components/product/ProductImageZoomModal";
import { findProductSync } from "@/service/products/queries";
import { useProductStore } from "@/service/products/store";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const products = useProductStore((s) => s.products);
  const recentlyViewedIds = useProductStore((s) => s.recentlyViewedIds);
  const addRecentlyViewed = useProductStore((s) => s.addRecentlyViewed);

  const product = findProductSync(slug, products);

  const [imgIdx, setImgIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

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

  const relatedProducts = products
    .filter((x) => x.id !== product.id)
    .slice(0, 10);

  const recentlyViewedProducts = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

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
        <ProductGallery
          product={product}
          activeIndex={imgIdx}
          onSelectIndex={setImgIdx}
          onOpenZoom={() => setIsZoomOpen(true)}
        />
        <ProductInfo product={product} activeImageIndex={imgIdx} />
      </div>

      {/* Minimalist Image Zoom Modal */}
      <ProductImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        product={product}
        activeIndex={imgIdx}
      />

      {/* Related Products Carousel */}
      <ProductCarousel title="You may also like" items={relatedProducts} />

      {/* Recently Viewed Carousel */}
      {recentlyViewedProducts.length > 0 && (
        <ProductCarousel title="Recently viewed" items={recentlyViewedProducts} />
      )}
    </section>
  );
}
