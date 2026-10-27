"use client";

import { useEffect, useState } from "react";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  width: number;
  height: number;
  isMounted: boolean;
}

/**
 * Shared hook to detect device type, screen breakpoints and touch capability.
 * - `isMobile`: screen width < 640px (phones)
 * - `isTablet`: 640px <= screen width < 1024px (tablets)
 * - `isDesktop`: screen width >= 1024px
 * - `isTouch`: device supports touch input (coarse pointer)
 * - `isMounted`: true after client hydration has completed
 */
export function useDevice(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    width: 0,
    height: 0,
    isMounted: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const isDesktop = width >= 1024;

      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        width,
        height,
        isMounted: true,
      });
    };

    checkDevice();
    window.addEventListener("resize", checkDevice, { passive: true });
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return device;
}

