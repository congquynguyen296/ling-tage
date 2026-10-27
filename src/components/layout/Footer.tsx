"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_COLUMNS: Array<[string, Array<[string, string]>]> = [
  [
    "Shop",
    [
      ["New Arrivals", "/shop?category=New+Arrivals"],
      ["Denim", "/shop?category=Denim"],
      ["Outerwear", "/shop?category=Outerwear"],
      ["Leather", "/shop?category=Leather"],
      ["Footwear", "/shop?category=Footwear"],
    ],
  ],
  [
    "Support",
    [
      ["Shipping & Returns", "/shop"],
      ["Size Guide", "/shop"],
      ["Order Tracking", "/account/orders"],
      ["Address Book", "/account/addresses"],
    ],
  ],
  [
    "Connect",
    [
      ["Instagram", "https://instagram.com"],
      ["Facebook", "https://facebook.com"],
      ["Zalo", "https://zalo.me"],
      ["TikTok", "https://tiktok.com"],
    ],
  ],
];

export function Footer() {
  const pathname = usePathname();
  const [mail, setMail] = useState("");
  const [done, setDone] = useState(false);

  // Hide footer completely on Cart and Checkout pages as requested
  if (
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname?.startsWith("/checkout")
  ) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <>
      {/* Newsletter Section (shown on subpages; Home page has its own dedicated Stay Connected split section) */}
      {!isHome && (
        <section className="border-t line">
          <div className="max-w-xl mx-auto px-5 py-14 md:py-20 text-center rv in">
            <div className="text-[11px] tracking-[0.3em] uppercase mute mb-3">
              Stay Connected
            </div>
            <h2 className="serif text-3xl md:text-4xl mb-3">Stay in the TAGE Edit</h2>
            <p className="mute text-sm mb-8">
              New deliveries, seasonal editorials and 10% off your first purchase.
            </p>
            {done ? (
              <p className="text-sm">Thank you — you’re on the TAGE list.</p>
            ) : (
              <div className="flex border-b border-current">
                <input
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="Email address"
                  type="email"
                  className="flex-1 min-w-0 bg-transparent py-3 outline-none text-sm placeholder:text-[color:var(--mute)]"
                />
                <button
                  onClick={() => mail.includes("@") && setDone(true)}
                  className="text-xs tracking-[0.25em] uppercase px-2"
                >
                  Subscribe →
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Footer (Full width with comfortable padding) */}
      <footer className="border-t line bg-[color:var(--bg)]">
        <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="TAGE Home">
              <img
                src="/logo/tage_logo.png"
                alt="TAGE"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </Link>
            <p className="mute max-w-[260px] leading-relaxed">
              Considered clothing for the modern wardrobe. Designed to last across seasons.
            </p>
          </div>
          {FOOTER_COLUMNS.map(([heading, links]) => (
            <div key={heading}>
              <div className="text-[11px] tracking-[0.3em] uppercase font-semibold mb-4 text-[color:var(--fg)]">
                {heading}
              </div>
              <ul className="space-y-2.5 mute">
                {links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("http") ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[color:var(--fg)] transition-colors"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="hover:text-[color:var(--fg)] transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t line">
          <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 py-5 flex flex-wrap justify-between gap-3 text-xs mute">
            <span>© 2026 TAGE. All rights reserved.</span>
            <span>Privacy · Terms · International (USD $)</span>
          </div>
        </div>
      </footer>
    </>
  );
}
