"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/service/auth/store";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, toastMessage } = useCart();
  const user = useAuthStore((s) => s.user);

  const announcement =
    "TAGE FW26 DELIVERY 5: LIVE NOW — USE CODE TAGE10 FOR 10% OFF YOUR FIRST PURCHASE";

  // Scroll parallax CSS variable (--sy) + IntersectionObserver for .rv elements
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        const style = document.documentElement.style;
        style.setProperty("--sy", String(Math.min(y, 900)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );

    const scan = () => {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => {
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <>
      {/* Announcement marquee */}
      <div className="card border-b line text-[11px] tracking-[0.25em] py-2 overflow-hidden">
        <div className="marquee">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="px-10 whitespace-nowrap">
              {announcement}
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Header */}
      <header
        className="sticky top-0 z-30 border-b line"
        style={{
          background: "var(--bg)",
          paddingTop: "env(safe-area-inset-top,0px)",
        }}
      >
        <div className="max-w-[1500px] mx-auto px-5 h-16 md:h-20 grid grid-cols-[1fr_auto_1fr] items-center">
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-[0.15em] uppercase">
            <Link className="ul" href="/shop">
              Shop
            </Link>
            <Link className="ul" href="/#collections">
              Collections
            </Link>
            <Link className="ul" href="/#about">
              About
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                className="ul text-[11px] px-2 py-0.5 bg-[color:var(--accent)] text-white"
                href="/admin"
              >
                Admin
              </Link>
            )}
          </nav>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
            className="md:hidden hic -ml-2.5"
          >
            {Icons.menu}
          </button>

          <Link
            href="/"
            className="flex items-center justify-center text-center"
            aria-label="TAGE Home"
          >
            <img
              src="/logo/tage_logo.png"
              alt="TAGE"
              className="h-12 md:h-16 w-auto object-contain py-1"
            />
          </Link>

          <div className="flex justify-end items-center gap-0.5 -mr-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hic"
            >
              {Icons.search}
            </button>
            <Link
              href="/account"
              aria-label={user ? `Account: ${user.name}` : "Account"}
              className="hic"
            >
              {Icons.user}
              {user && <span className="dot" />}
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${count} items`}
              className="hic"
            >
              {Icons.bag}
              {count > 0 && (
                <span key={count} className="badge">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />


      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[color:var(--accent)] text-white text-xs tracking-widest uppercase px-5 py-3 max-w-[90vw] text-center shadow-lg">
          {toastMessage}
        </div>
      )}
    </>
  );
}

