"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HERO_SLIDES } from "@/service/products/mock";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(id);
  }, [hovered, index, total]);

  const go = (next: number) => setIndex((next + total) % total);

  return (
    <section
      className="relative h-[78svh] min-h-[520px] md:h-[82vh] overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="px-bg absolute left-0 right-0 bottom-0" style={{ height: "125%" }}>
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 1.1s cubic-bezier(.77,0,.18,1)",
          }}
        >
          {HERO_SLIDES.map((slide, k) => (
            <div key={slide.id} className="relative w-full shrink-0 h-full overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: `scale(${index === k ? 1.08 : 1})`,
                  transition: "transform 7s ease-out",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(247,247,247,0.45) 0%, rgba(247,247,247,0.1) 35%, transparent 70%), linear-gradient(90deg, rgba(247,247,247,0.35) 0%, transparent 60%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg,transparent 0 119px,rgba(0,0,0,.03) 119px 120px)",
                }}
              />
              <div className="px-fg absolute inset-0 flex flex-col justify-end p-5 md:p-14 pb-24 text-[color:var(--fg)]">
                <div
                  className={`${
                    index === k ? "hero-a " : ""
                  }text-[11px] tracking-[0.35em] uppercase mb-4 opacity-80`}
                >
                  {slide.kicker}
                </div>
                <h1
                  style={{ "--d": "150ms" } as React.CSSProperties}
                  className={`${
                    index === k ? "hero-a " : ""
                  }serif text-3xl md:text-5xl leading-[0.95] max-w-3xl`}
                >
                  {slide.titleLine1}
                  <br />
                  {slide.titleLine2}
                </h1>
                <div
                  style={{ "--d": "320ms" } as React.CSSProperties}
                  className={`${index === k ? "hero-a " : ""}mt-8 flex gap-3 flex-wrap`}
                >
                  <Link href="/shop" className="btn">
                    Shop New Arrivals
                  </Link>
                  <Link
                    href="/#collections"
                    className="border border-current text-xs tracking-[0.25em] uppercase px-5 sm:px-7 py-3.5 bg-white/40 backdrop-blur-sm"
                  >
                    Collections
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-5 md:right-14 bottom-6 md:bottom-10 flex items-center gap-4 text-[color:var(--fg)] text-xs tracking-[0.2em]">
        <div className="flex gap-2">
          {HERO_SLIDES.map((s, k) => (
            <button
              key={s.id}
              onClick={() => go(k)}
              aria-label={`Slide ${k + 1}`}
              className="relative h-[18px] w-10 flex items-center"
            >
              <span
                className="block w-full h-[2px] relative overflow-hidden"
                style={{ background: "rgba(0,0,0,.18)" }}
              >
                {k === index && (
                  <span
                    key={`${index}-${hovered}`}
                    className="absolute inset-y-0 left-0 bg-[color:var(--fg)]"
                    style={
                      hovered
                        ? { width: "100%" }
                        : { animation: "fill 5.5s linear forwards" }
                    }
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        {/* <button onClick={() => go(index - 1)} aria-label="Previous">
          ←
        </button>
        <button onClick={() => go(index + 1)} aria-label="Next">
          →
        </button> */}
      </div>
    </section>
  );
}

