"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";
import { AddToCartSchema } from "./schema";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountRate: number; // e.g. 0.1 for 10%
  toastMessage: string;
  flashToast: (msg: string) => void;
  addItem: (product: Product, size: string | null, qty?: number) => boolean;
  updateQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  mergeWithServerCart: (serverItems: CartItem[]) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountRate: 0,
      toastMessage: "",

      flashToast: (msg: string) => {
        if (toastTimer) clearTimeout(toastTimer);
        set({ toastMessage: msg });
        toastTimer = setTimeout(() => {
          set({ toastMessage: "" });
        }, 2200);
      },

      addItem: (product, size, qty = 1) => {
        if (!size) {
          get().flashToast("Select a size first");
          return false;
        }

        const parsed = AddToCartSchema.safeParse({
          productId: product.id,
          size,
          color: product.color,
          qty,
        });

        if (!parsed.success) {
          get().flashToast(parsed.error.issues[0]?.message || "Invalid item");
          return false;
        }

        // Check variant stock if variants exist
        const variant = product.variants?.find((v) => v.size === size);
        if (variant && variant.stock <= 0) {
          get().flashToast(`Size ${size} is currently out of stock`);
          return false;
        }

        const key = `${product.id}-${size}`;
        set((state) => {
          const exists = state.items.some((i) => i.key === key);
          const nextItems = exists
            ? state.items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
            : [...state.items, { key, product, size, color: product.color, qty }];
          return { items: nextItems };
        });

        get().flashToast(`${product.name} (${size}) added to cart`);
        return true;
      },

      updateQty: (key, delta) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, qty: Math.max(1, item.qty + delta) } : item
          ),
        }));
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }));
        get().flashToast("Item removed from cart");
      },

      clearCart: () => set({ items: [], couponCode: null, discountRate: 0 }),

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === "TAGE10" || clean === "FW26") {
          set({ couponCode: clean, discountRate: 0.1 });
          get().flashToast(`Coupon ${clean} applied (10% off)`);
          return { ok: true, message: "10% discount applied" };
        }
        return { ok: false, message: "Invalid promo code (Try TAGE10)" };
      },

      mergeWithServerCart: (serverItems) => {
        set((state) => {
          const map = new Map<string, CartItem>();
          for (const item of serverItems) {
            map.set(item.key, { ...item });
          }
          for (const local of state.items) {
            const existing = map.get(local.key);
            if (existing) {
              map.set(local.key, { ...existing, qty: existing.qty + local.qty });
            } else {
              map.set(local.key, local);
            }
          }
          return { items: Array.from(map.values()) };
        });
      },
    }),
    {
      name: "tage-cart-storage",
      version: 2,
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountRate: state.discountRate,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          state.items = state.items.map((item) => {
            if (!item.product) return item;
            const validImages =
              Array.isArray(item.product.images) && item.product.images.length > 0
                ? item.product.images.map((img) =>
                    typeof img === "string"
                      ? img.replace(/^\/?asset\/images\//, "/images/")
                      : "/images/products/p1-01.jpg"
                  )
                : ["/images/products/p1-01.jpg"];
            return {
              ...item,
              product: {
                ...item.product,
                images: validImages,
              },
            };
          });
        }
      },
    }
  )
);

