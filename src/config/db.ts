import { ApiResponse } from "@/types";
import { delay } from "./utils";

/**
 * Spring Boot Backend API Client Configuration
 * In mock mode (default), simulates a 2-second debounce/latency before returning mock data.
 * When Spring Boot backend is ready, set NEXT_PUBLIC_USE_MOCK_API=false in .env.local.
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  useMock: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false",
  mockDelayMs: Number(process.env.NEXT_PUBLIC_MOCK_DELAY_MS ?? 2000),
};

// Track pending debounced calls per key on the server/service layer
const debounceTimers = new Map<string, NodeJS.Timeout>();

/**
 * Debounced Mock API execution (2s debounce by default)
 */
export async function mockApiCall<T>(
  key: string,
  resolver: () => T | Promise<T>,
  waitMs: number = API_CONFIG.mockDelayMs
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    const existing = debounceTimers.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(async () => {
      debounceTimers.delete(key);
      try {
        const data = await resolver();
        resolve({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        reject(err);
      }
    }, waitMs);

    debounceTimers.set(key, timer);
  });
}

/**
 * Unified HTTP client that calls Spring Boot REST endpoints or falls back to mock resolver
 */
export async function springBootFetch<T>(
  endpoint: string,
  options: RequestInit & { mockResolver?: () => T | Promise<T>; debounceKey?: string } = {}
): Promise<ApiResponse<T>> {
  const { mockResolver, debounceKey, ...fetchOptions } = options;

  if (API_CONFIG.useMock && mockResolver) {
    if (debounceKey) {
      return mockApiCall(debounceKey, mockResolver, API_CONFIG.mockDelayMs);
    }
    await delay(API_CONFIG.mockDelayMs);
    const data = await mockResolver();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  const res = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Backend API Error [${res.status}]: ${res.statusText}`);
  }

  return res.json();
}
