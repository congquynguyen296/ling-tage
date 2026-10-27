"use client";

import Link from "next/link";
import { NAV_CATEGORIES } from "@/service/products/mock";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const mainLinks: Array<[string, string]> = [
    ["Shop", "/shop"],
    ["Collections", "/#collections"],
    ["About", "/#about"],
    ["Account", "/account"],
    ["Admin Studio", "/admin"],
  ];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/30"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .35s",
        }}
      />
      <aside
        className="fixed top-0 left-0 bottom-0 z-[91] w-[320px] max-w-[85vw] flex flex-col"
        style={{
          background: "var(--bg)",
          paddingTop: "env(safe-area-inset-top,0px)",
          transform: open ? "none" : "translateX(-100%)",
          transition: `transform .5s cubic-bezier(.7,0,.2,1), visibility 0s linear ${
            open ? "0s" : ".5s"
          }`,
          visibility: open ? "visible" : "hidden",
        }}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b line">
          <Link href="/" onClick={onClose} aria-label="TAGE Home">
            <img src="/logo/tage_logo.png" alt="TAGE" className="h-11 w-auto object-contain" />
          </Link>
          <button onClick={onClose} aria-label="Close" className="text-lg">
            ✕
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-8">
          {mainLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="block serif text-3xl py-2"
            >
              {label}
            </Link>
          ))}
          <div className="text-[11px] tracking-[0.25em] uppercase mute mt-10 mb-4">
            Categories
          </div>
          <div className="space-y-3 text-sm">
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/shop?category=${encodeURIComponent(c)}`}
                onClick={onClose}
                className="block hover:opacity-70"
              >
                {c}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}

