"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUiStore } from "@/service/ui/store";

function TopProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const progressKey = useUiStore((s) => s.progressKey);

  const [animating, setAnimating] = useState(false);
  const [animId, setAnimId] = useState(0);

  const isAnimatingRef = useRef(false);
  const isFirstMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopProgress = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isAnimatingRef.current = false;
    setAnimating(false);
  };

  const startProgress = () => {
    // If an animation cycle is already in progress, ignore rapid duplicate triggers
    // to prevent restarting mid-animation and causing visual flickering.
    if (isAnimatingRef.current) {
      return;
    }
    isAnimatingRef.current = true;
    setAnimId((prev) => prev + 1);
    setAnimating(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      stopProgress();
    }, 2050);
  };

  // Trigger from store (e.g. 2s mock debounce in shop, filtering, searching)
  useEffect(() => {
    if (progressKey > 0) {
      startProgress();
    }
  }, [progressKey]);

  // Trigger on route change / screen switch (pathname or searchParams)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    startProgress();
  }, [pathname, searchParams]);

  // Intercept click on internal links so the 2s bar starts immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !href.startsWith("#") &&
        anchor.getAttribute("target") !== "_blank"
      ) {
        startProgress();
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!animating) return null;

  return (
    <div
      key={animId}
      aria-hidden="true"
      onAnimationEnd={stopProgress}
      className="top-progress-bar active"
    />
  );
}

export function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <TopProgressBarInner />
    </Suspense>
  );
}
