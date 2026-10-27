"use client";

import { useCallback, useEffect, useRef } from "react";

export interface ScrollTopOptions {
  top?: number;
  behavior?: ScrollBehavior;
  isLoading?: boolean;
}

/**
 * Shared hook to scroll window or view back to the top.
 * - Call `scrollToTop()` imperatively on any user action.
 * - Or pass a `trigger` (e.g. current page number) to automatically scroll to top when it changes.
 * - When `isLoading` is provided: Waits until data loading completes (`isLoading` transitions to false)
 *   and paints into the DOM before executing `scrollToTop()`, preventing premature scrolling.
 */
export function useScrollTop(
  trigger?: unknown,
  options: ScrollTopOptions = {}
) {
  const { top = 0, behavior = "smooth", isLoading = false } = options;

  const isInitialMount = useRef(true);
  const pendingScrollRef = useRef(false);

  const scrollToTop = useCallback(
    (customOptions?: ScrollTopOptions) => {
      if (typeof window === "undefined") return;
      window.scrollTo({
        top: customOptions?.top ?? top,
        behavior: customOptions?.behavior ?? behavior,
      });
    },
    [top, behavior]
  );

  // Detect when trigger changes (e.g. page changes)
  useEffect(() => {
    if (trigger === undefined) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Trigger changed, flag that a scroll is pending
    pendingScrollRef.current = true;
  }, [trigger]);

  // Execute scroll ONLY after loading completes and DOM is ready
  useEffect(() => {
    if (pendingScrollRef.current && !isLoading) {
      const raf = requestAnimationFrame(() => {
        scrollToTop();
        pendingScrollRef.current = false;
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isLoading, scrollToTop]);

  return { scrollToTop };
}
