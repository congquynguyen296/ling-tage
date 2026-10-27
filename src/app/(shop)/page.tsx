"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroCarousel } from "@/components/product/HeroCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHead } from "@/components/ui/SectionHead";
import {
  BRAND_VALUES,
  COLLECTIONS_MOCK,
  EDITORIAL_BANNER,
} from "@/service/products/mock";
import { useProductStore } from "@/service/products/store";

export default function HomePage() {
  const products = useProductStore((s) => s.products);
  const [visibleCount, setVisibleCount] = useState(6);

  const newArrivals = products.filter((p) => !p.isSale);
  const saleProducts = products.filter((p) => p.isSale);

  return (
    <>
      <HeroCarousel />

      {/* New Arrivals */}
      <section id="new" className="max-w-[1500px] mx-auto px-5 py-14 md:py-20">
        <SectionHead
          kicker="Just In"
          title="New Arrivals"
          linkText="View all"
          linkHref="/shop"
        />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
          {newArrivals.slice(0, visibleCount).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {visibleCount < newArrivals.length && (
          <div className="text-center mt-14">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 6)}
              className="border border-current text-xs tracking-[0.25em] uppercase px-10 py-3.5 hover:bg-[color:var(--accent)] hover:text-white transition-colors"
            >
              Load more products
            </button>
          </div>
        )}
      </section>

      {/* Values */}
      <section id="about" className="border-y line">
        <div className="max-w-[1500px] mx-auto px-5 py-14 md:py-20 grid md:grid-cols-3 gap-12">
          {BRAND_VALUES.map(([num, title, desc]) => (
            <div key={num} className="rv in">
              <div className="text-xs tracking-[0.3em] mute mb-5">{num}</div>
              <h3 className="serif text-2xl mb-3">{title}</h3>
              <p className="mute text-sm leading-relaxed max-w-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="max-w-[1500px] mx-auto px-5 py-14 md:py-20">
        <SectionHead
          kicker="Explore"
          title="Collections"
          linkText="View all"
          linkHref="/shop"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLLECTIONS_MOCK.map((c) => (
            <Link
              key={c.id}
              href={
                c.categoryFilter
                  ? `/shop?category=${encodeURIComponent(c.categoryFilter)}`
                  : "/shop"
              }
              className="group relative block overflow-hidden rv in card"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="pimg absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${c.image})` }}
              />
              <div
                className="absolute inset-x-0 bottom-0 p-4 text-[color:var(--fg)]"
                style={{
                  background: "linear-gradient(to top, rgba(247,247,247,0.75) 0%, transparent 100%)",
                }}
              >
                <div className="serif text-xl">{c.name}</div>
                <div className="text-[11px] tracking-[0.2em] uppercase opacity-80 mt-1">
                  {c.pieceCount} pieces
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden text-[color:var(--fg)] border-y line">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${EDITORIAL_BANNER.image})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,247,247,0.6) 0%, rgba(247,247,247,0.2) 40%, transparent 75%)",
          }}
        />
        <div className="relative h-full flex flex-col justify-center px-5 md:px-14 max-w-2xl rv in">
          <div className="text-[11px] tracking-[0.35em] uppercase mb-4 opacity-80">
            {EDITORIAL_BANNER.season}
          </div>
          <h2 className="serif text-4xl md:text-6xl leading-tight">
            {EDITORIAL_BANNER.title}
          </h2>
          <p className="mt-4 text-sm opacity-80 max-w-md">
            {EDITORIAL_BANNER.subtitle}
          </p>
          <Link
            href="/shop"
            className="mt-7 self-start border-b border-current pb-0.5 text-xs tracking-[0.25em] uppercase"
          >
            Explore the lookbook
          </Link>
        </div>
      </section>

      {/* Trending / Archival Sale */}
      <section className="max-w-[1500px] mx-auto px-5 py-14 md:py-20">
        <SectionHead
          kicker="Top Picks"
          title="Trending & Archive"
          linkText="Shop all"
          linkHref="/shop"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
          {saleProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

