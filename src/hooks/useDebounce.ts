"use client";

import { useEffect, useState } from "react";

/**
 * Custom debounce hook for search inputs, filters, and API triggers
 * Default delay is 2000ms (2s) as requested for mock API calls
 */
export function useDebounce<T>(value: T, delayMs: number = 2000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

