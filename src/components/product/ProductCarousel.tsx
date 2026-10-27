"use client";

import { useRef, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  title: string;
  items: Product[];
}

export function ProductCarousel({ title, items }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const scrollByDir = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * (el.clientWidth + 20),
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  const arrowBtn =
    "w-11 h-11 rounded-full flex items-center justify-center bg-[color:var(--card)] hover:bg-[color:var(--accent)] hover:text-white transition-colors";

  return (
    <div className="mt-24">
      <div className="flex items-end justify-between mb-8">
        <h2 className="serif text-2xl md:text-3xl">{title}</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label="Previous"
            className={arrowBtn}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label="Next"
            className={arrowBtn}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="no-sb flex gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start cw">
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      <div className="h-[2px] mt-3" style={{ background: "var(--line)" }}>
        <div
          className="h-full bg-[color:var(--accent)]"
          style={{
            width: "25%",
            transform: `translateX(${progress * 300}%)`,
            transition: "transform .2s linear",
          }}
        />
      </div>
    </div>
  );
}

