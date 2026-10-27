import { springBootFetch } from "@/config/db";
import { CartItem } from "@/types";

/**
 * Syncs guest cart with Spring Boot user cart after login (2s mock debounce)
 */
export async function syncCartWithBackend(items: CartItem[]) {
  return springBootFetch<CartItem[]>("/cart/sync", {
    method: "POST",
    body: JSON.stringify({ items }),
    debounceKey: "cart-sync",
    mockResolver: () => items,
  });
}

