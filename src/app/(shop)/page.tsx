"use client";

import { useState } from "react";
import Link from "next/link";
import { EDITORIAL_BANNER } from "@/service/products/mock";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setSubscribed(true);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* SECTION 1: Fullscreen Split (TOP & BOTTOM) */}
      <section className="relative w-full min-h-[90vh] md:h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left: TOP Collection */}
        <Link
          href="/shop?category=Top"
          className="group relative w-full h-[50vh] md:h-full overflow-hidden block"
        >
          <img
            src="/images/home/home-top.jpg"
            alt="TOP Collection"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/80 font-light mb-2">
              Collection · Tops
            </span>
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-[0.25em] uppercase font-light drop-shadow-sm">
              The Top Edit
            </h2>
            <p className="text-xs sm:text-sm text-white/85 font-light tracking-[0.15em] mt-2.5 max-w-sm">
              Archival Shirts, Tees & Relaxed Knitwear
            </p>
            <span className="mt-5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
              Explore Tops →
            </span>
          </div>
        </Link>

        {/* Right: BOTTOM Collection */}
        <Link
          href="/shop?category=Bottom"
          className="group relative w-full h-[50vh] md:h-full overflow-hidden block border-t md:border-t-0 md:border-l line"
        >
          <img
            src="/images/home/home-bottom.jpg"
            alt="BOTTOM Collection"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/80 font-light mb-2">
              Collection · Bottoms
            </span>
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-[0.25em] uppercase font-light drop-shadow-sm">
              The Bottom Edit
            </h2>
            <p className="text-xs sm:text-sm text-white/85 font-light tracking-[0.15em] mt-2.5 max-w-sm">
              Washed Denim, Relaxed Pants & Cargo Trousers
            </p>
            <span className="mt-5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
              Explore Bottoms →
            </span>
          </div>
        </Link>
      </section>

      {/* SECTION 2: Split 2 (OUTERWEAR & NEW ARRIVALS) */}
      <section className="relative w-full min-h-[75vh] md:h-[85vh] grid grid-cols-1 md:grid-cols-2 border-t line">
        {/* Left: OUTERWEAR */}
        <Link
          href="/shop?category=Outerwear"
          className="group relative w-full h-[50vh] md:h-full overflow-hidden block"
        >
          <img
            src="/images/home/home-outerwear.jpg"
            alt="OUTERWEAR Collection"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/80 font-light mb-2">
              Structured Layering
            </span>
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-[0.25em] uppercase font-light drop-shadow-sm">
              Outerwear
            </h2>
            <p className="text-xs sm:text-sm text-white/85 font-light tracking-[0.15em] mt-2.5 max-w-sm">
              Tailored Jackets, Work Blazers & Heavy Outer Layers
            </p>
            <span className="mt-5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
              Explore Outerwear →
            </span>
          </div>
        </Link>

        {/* Right: NEW ARRIVALS */}
        <Link
          href="/shop?category=New%20Arrivals"
          className="group relative w-full h-[50vh] md:h-full overflow-hidden block border-t md:border-t-0 md:border-l line"
        >
          <img
            src="/images/home/home-newarrival.jpg"
            alt="NEW ARRIVALS"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/80 font-light mb-2">
              Just Added
            </span>
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-[0.25em] uppercase font-light drop-shadow-sm">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-white/85 font-light tracking-[0.15em] mt-2.5 max-w-sm">
              Fresh From The Archive · One of One Condition
            </p>
            <span className="mt-5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
              Shop Latest Drops →
            </span>
          </div>
        </Link>
      </section>

      {/* SECTION 3: Editorial Banner / Video Area (Image only, no text) */}
      <section className="relative w-full h-[60vh] min-h-[420px] md:h-[75vh] overflow-hidden border-t line">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${EDITORIAL_BANNER.image})` }}
        />
      </section>

      {/* SECTION 4: Split Section (Stay Connected & Store Information) */}
      <section className="w-full border-t line bg-[color:var(--bg)]">
        <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left Column: Stay Connected */}
          <div className="flex flex-col max-w-lg">
            <span className="text-[11px] tracking-[0.3em] uppercase mute mb-3 font-medium">
              Stay Connected
            </span>
            <h2 className="serif text-3xl md:text-4xl lg:text-5xl mb-4 text-[color:var(--fg)]">
              Stay in the TAGE Edit
            </h2>
            <p className="mute text-sm mb-8 leading-relaxed">
              New deliveries, seasonal editorials and 10% off your first
              purchase.
            </p>

            {subscribed ? (
              <p className="text-sm py-3 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4">
                Thank you — you’re on the TAGE list.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex border-b border-current"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 min-w-0 bg-transparent py-3 outline-none text-sm placeholder:text-[color:var(--mute)]"
                />
                <button
                  type="submit"
                  className="text-xs tracking-[0.25em] uppercase px-3 hover:opacity-75 transition-opacity"
                >
                  Subscribe →
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Store Addresses & Hours */}
          <div className="flex flex-col md:border-l line md:pl-12 lg:pl-16 space-y-8 text-sm">
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase font-semibold text-[color:var(--fg)] mb-5">
                ADDRESS
              </h3>
              <div className="space-y-5 mute leading-relaxed">
                <div>
                  <span className="text-[color:var(--fg)] font-medium block text-xs tracking-wider uppercase mb-1">
                    Store 01
                  </span>
                  <p>
                    107 Ton That Dam, Sai Gon Ward, Ho Chi Minh City, Vietnam
                  </p>
                </div>
                <div>
                  <span className="text-[color:var(--fg)] font-medium block text-xs tracking-wider uppercase mb-1">
                    Store 02
                  </span>
                  <p>
                    41 Phan Diet Duat, Tan Dinh Ward, Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t line">
              <h3 className="text-xs tracking-[0.3em] uppercase font-semibold text-[color:var(--fg)] mb-3">
                STORE HOURS
              </h3>
              <p className="mute leading-relaxed">
                9:00 AM – 9:00 PM · Open Daily (Monday – Sunday)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
