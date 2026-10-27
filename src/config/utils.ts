export const SITE_NAME = "TAGE";
export const FREE_SHIPPING_THRESHOLD = 300;
export const STANDARD_SHIPPING_FEE = 15;
export const EXPRESS_SHIPPING_FEE = 25;

export function money(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function shipFee(subtotal: number, method: "std" | "exp" = "std"): number {
  if (method === "exp") return EXPRESS_SHIPPING_FEE;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Simulates network/server debounce delay (default 2000ms as requested for mock Spring Boot API)
 */
export function delay(ms: number = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const DEFAULT_PRODUCT_IMAGE = "/images/products/p1-01.jpg";

/**
 * Returns a valid, safe image path for any product.
 * Handles missing images, undefined values, legacy /asset/ prefixes, and fallbacks.
 */
export function getSafeProductImage(
  product?: { images?: string[]; id?: number } | null,
  index: number = 0
): string {
  if (!product) return DEFAULT_PRODUCT_IMAGE;
  const raw = product.images?.[index] || product.images?.[0];
  if (typeof raw === "string" && raw.trim().length > 0) {
    const cleaned = raw.replace(/^\/?asset\/images\//, "/images/");
    if (cleaned.startsWith("/images/")) {
      return cleaned;
    }
  }
  return DEFAULT_PRODUCT_IMAGE;
}

