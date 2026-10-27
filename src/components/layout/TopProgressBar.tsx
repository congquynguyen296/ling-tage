"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUiStore } from "@/service/ui/store";

const NAV_TRANSITION_MS = 900;

function TopProgressBarInner() {
  const router = useRouter();
  const pathname = usePathname();
  const progressState = useUiStore((s) => s.progressState);

  const [mode, setMode] = useState<"idle" | "navigating" | "api_loading" | "api_completing">("idle");
  const [fading, setFading] = useState(false);
  const [apiPercent, setApiPercent] = useState(0);

  const routerRef = useRef(router);
  routerRef.current = router;

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const navTimerRef = useRef<NodeJS.Timeout | null>(null);
  const apiTrickleRef = useRef<NodeJS.Timeout | null>(null);

  // When pathname changes (route transition arrived), end navigation mode cleanly
  useEffect(() => {
    if (mode === "navigating") {
      setFading(true);
      const timer = setTimeout(() => {
        setMode("idle");
        setFading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Handle in-page API loading (from useUiStore for catalog filter / pagination)
  useEffect(() => {
    if (mode === "navigating") return;

    if (progressState === "loading") {
      if (apiTrickleRef.current) clearInterval(apiTrickleRef.current);
      setFading(false);
      setApiPercent(25);
      setMode("api_loading");

      apiTrickleRef.current = setInterval(() => {
        setApiPercent((prev) => {
          if (prev >= 85) return prev;
          const diff = 85 - prev;
          const step = Math.max(1, diff * 0.15);
          return Math.min(85, prev + step);
        });
      }, 100);
    } else if (progressState === "completing") {
      if (apiTrickleRef.current) clearInterval(apiTrickleRef.current);
      setApiPercent(100);
      setMode("api_completing");

      const timer = setTimeout(() => {
        setFading(true);
        const timer2 = setTimeout(() => {
          setMode("idle");
          setApiPercent(0);
          setFading(false);
          useUiStore.setState({ progressState: "idle" });
        }, 180);
        return () => clearTimeout(timer2);
      }, 180);

      return () => clearTimeout(timer);
    } else if (progressState === "idle") {
      if (apiTrickleRef.current) clearInterval(apiTrickleRef.current);
      setMode("idle");
      setApiPercent(0);
      setFading(false);
    }

    return () => {
      if (apiTrickleRef.current) clearInterval(apiTrickleRef.current);
    };
  }, [progressState]);

  // Global anchor click listener:
  // Starts the top progress bar immediately, holds user on current page,
  // and ONLY redirects after the bar finishes!
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Ignore click if modified (Ctrl/Cmd/Shift/Alt) or already prevented
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) {
        return;
      }

      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore external or non-HTTP links
      if (
        rawHref.startsWith("http") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("#") ||
        anchor.target === "_blank"
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);

        // Ignore external origin
        if (targetUrl.origin !== window.location.origin) {
          return;
        }

        // If clicking the same page (same pathname and search), do not intercept
        const isSamePage =
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search;

        if (isSamePage) {
          return;
        }

        // Intercept navigation
        e.preventDefault();

        const destination = targetUrl.pathname + targetUrl.search + targetUrl.hash;

        // Prefetch destination in the background
        routerRef.current.prefetch(destination);

        // Clear any prior transition timer
        if (navTimerRef.current) {
          clearTimeout(navTimerRef.current);
        }

        // Start CSS keyframe progress bar on current page
        setFading(false);
        setMode("navigating");

        // Wait exactly NAV_TRANSITION_MS for the progress bar to complete (100%),
        // THEN execute the redirect!
        navTimerRef.current = setTimeout(() => {
          routerRef.current.push(destination);

          // Fallback reset if route doesn't change
          navTimerRef.current = setTimeout(() => {
            setFading(true);
            navTimerRef.current = setTimeout(() => {
              setMode("idle");
              setFading(false);
            }, 180);
          }, 350);
        }, NAV_TRANSITION_MS);
      } catch {
        // Fallback: let default browser navigation proceed
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  if (mode === "idle") return null;

  if (mode === "navigating") {
    return (
      <div
        aria-hidden="true"
        className={`top-progress-bar navigating ${fading ? "fade-out" : ""}`}
      />
    );
  }

  // API mode
  return (
    <div
      aria-hidden="true"
      className="top-progress-bar"
      style={{
        transform: `scaleX(${apiPercent / 100})`,
        opacity: fading ? 0 : 1,
        transition:
          apiPercent === 100
            ? "transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease"
            : "transform 100ms ease-out, opacity 180ms ease",
      }}
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
