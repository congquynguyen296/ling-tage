"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { INITIAL_PRODUCTS } from "./mock";
import { slugify } from "@/config/utils";
import { UpsertProductInput } from "./schema";

interface ProductAdminState {
  products: Product[];
  recentlyViewedIds: number[];
  wishlistIds: number[];
  addProduct: (input: UpsertProductInput) => Product;
  updateProduct: (id: number, input: Partial<UpsertProductInput>) => void;
  updateVariantStock: (productId: number, variantId: string, stock: number) => void;
  deleteProduct: (id: number) => void;
  addRecentlyViewed: (id: number) => void;
  toggleWishlist: (id: number) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductAdminState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      recentlyViewedIds: [],
      wishlistIds: [],

      addProduct: (input) => {
        const current = get().products;
        const nextId = current.length ? Math.max(...current.map((p) => p.id)) + 1 : 1;
        const newProduct: Product = {
          id: nextId,
          slug: `${slugify(input.name)}-${nextId}`,
          name: input.name,
          color: input.color,
          colorHex: input.colorHex || "#111111",
          price: input.price,
          originalPrice: input.originalPrice,
          category: input.category,
          sizes: input.sizes,
          images: input.images,
          isNew: input.isNew ?? true,
          isSale: input.isSale ?? Boolean(input.originalPrice && input.originalPrice > input.price),
          description:
            input.description ||
            "Relaxed, considered fit with clean finishing. Model is 183 cm and wears size M.",
          materialsAndCare:
            "Premium natural fibres. Cold wash or dry clean. Store folded or on a wide hanger.",
          shippingAndReturns:
            "Free shipping over $300. Returns accepted within 30 days in original condition.",
          variants:
            input.variants ||
            input.sizes.map((size) => ({
              id: `var-${nextId}-${size}`,
              sku: `TG-FW26-${String(nextId).padStart(2, "0")}-${size}`,
              size,
              color: input.color,
              colorHex: input.colorHex || "#111111",
              stock: 10,
              price: input.price,
            })),
          createdAt: new Date().toISOString(),
        };
        set({ products: [newProduct, ...current] });
        return newProduct;
      },

      updateProduct: (id, input) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...input,
                  slug: input.name ? `${slugify(input.name)}-${p.id}` : p.slug,
                }
              : p
          ),
        }));
      },

      updateVariantStock: (productId, variantId, stock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  variants: p.variants.map((v) =>
                    v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v
                  ),
                }
              : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      addRecentlyViewed: (id) => {
        set((state) => {
          const filtered = state.recentlyViewedIds.filter((x) => x !== id);
          return { recentlyViewedIds: [id, ...filtered].slice(0, 8) };
        });
      },

      toggleWishlist: (id) => {
        set((state) => ({
          wishlistIds: state.wishlistIds.includes(id)
            ? state.wishlistIds.filter((x) => x !== id)
            : [...state.wishlistIds, id],
        }));
      },

      resetProducts: () => set({ products: INITIAL_PRODUCTS }),
    }),
    {
      name: "tage-products-storage",
      version: 2,
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.products)) {
          state.products = state.products.map((p) => {
            const validImages =
              Array.isArray(p.images) && p.images.length > 0
                ? p.images.map((img) =>
                    typeof img === "string"
                      ? img.replace(/^\/?asset\/images\//, "/images/")
                      : "/images/products/p1-01.jpg"
                  )
                : ["/images/products/p1-01.jpg"];
            return { ...p, images: validImages };
          });
        }
      },
    }
  )
);

