import { springBootFetch } from "@/config/db";
import { Product } from "@/types";
import { UpsertProductInput, UpsertProductSchema } from "./schema";

/**
 * Validates product payload with Zod before sending to Spring Boot backend (with 2s mock debounce)
 */
export async function createProductService(
  rawInput: UpsertProductInput,
  onMockCreate?: (validated: UpsertProductInput) => Product
) {
  const validated = UpsertProductSchema.parse(rawInput);

  return springBootFetch<Product>("/admin/products", {
    method: "POST",
    body: JSON.stringify(validated),
    debounceKey: "admin-create-product",
    mockResolver: () => {
      if (onMockCreate) {
        return onMockCreate(validated);
      }
      throw new Error("Mock create handler not provided");
    },
  });
}

/**
 * Updates variant inventory stock on Spring Boot backend (with 2s mock debounce)
 */
export async function updateVariantStockService(
  productId: number,
  variantId: string,
  stock: number,
  onMockUpdate?: () => void
) {
  if (stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  return springBootFetch<{ productId: number; variantId: string; stock: number }>(
    `/admin/products/${productId}/variants/${variantId}/stock`,
    {
      method: "PATCH",
      body: JSON.stringify({ stock }),
      debounceKey: `stock-${productId}-${variantId}`,
      mockResolver: () => {
        onMockUpdate?.();
        return { productId, variantId, stock };
      },
    }
  );
}

