import { springBootFetch } from "@/config/db";
import { CollectionItem, PaginatedResponse, Product } from "@/types";
import { COLLECTIONS_MOCK, INITIAL_PRODUCTS } from "./mock";
import { ProductFilterInput, ProductFilterSchema } from "./schema";

/**
 * Filter & sort helper shared between SSR and mock API calls
 */
export function filterAndSortProducts(
  source: Product[],
  rawParams: Partial<ProductFilterInput>
): PaginatedResponse<Product> {
  const params = ProductFilterSchema.parse(rawParams);
  let filtered = [...source];

  if (params.category && params.category !== "All" && params.category !== "New Arrivals") {
    filtered = filtered.filter((p) => p.category === params.category);
  } else if (params.category === "New Arrivals") {
    filtered = filtered.filter((p) => p.isNew);
  }

  if (params.sizes && params.sizes.length > 0) {
    filtered = filtered.filter((p) => p.sizes.some((s) => params.sizes.includes(s)));
  }

  if (typeof params.minPrice === "number") {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }

  if (typeof params.maxPrice === "number") {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  if (params.q && params.q.trim() !== "") {
    const q = params.q.trim().toLowerCase();
    filtered = filtered.filter((p) =>
      `${p.name} ${p.color} ${p.category}`.toLowerCase().includes(q)
    );
  }

  if (params.sort === "lo") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params.sort === "hi") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));
  const page = Math.min(params.page, totalPages);
  const start = (page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize);

  return {
    items,
    total,
    page,
    pageSize: params.pageSize,
    totalPages,
  };
}

/**
 * Fetch products from Spring Boot API (or mock API with 2s debounce)
 */
export async function fetchProductsApi(
  rawParams: Partial<ProductFilterInput> = {},
  sourceProducts: Product[] = INITIAL_PRODUCTS
) {
  return springBootFetch<PaginatedResponse<Product>>("/products", {
    method: "GET",
    debounceKey: "products-list",
    mockResolver: () => filterAndSortProducts(sourceProducts, rawParams),
  });
}

/**
 * Fetch single product by slug or id (with 2s mock delay when called via API)
 */
export async function fetchProductBySlugApi(
  slugOrId: string,
  sourceProducts: Product[] = INITIAL_PRODUCTS
) {
  return springBootFetch<Product | null>(`/products/${slugOrId}`, {
    method: "GET",
    debounceKey: `product-detail-${slugOrId}`,
    mockResolver: () => findProductSync(slugOrId, sourceProducts),
  });
}

/**
 * Search products with 2s server-side debounce
 */
export async function searchProductsApi(
  query: string,
  sourceProducts: Product[] = INITIAL_PRODUCTS
) {
  const q = query.trim().toLowerCase();
  return springBootFetch<Product[]>(`/products/search?q=${encodeURIComponent(q)}`, {
    method: "GET",
    debounceKey: "products-search",
    mockResolver: () => {
      if (!q) return [];
      return sourceProducts.filter((p) =>
        `${p.name} ${p.color} ${p.category}`.toLowerCase().includes(q)
      );
    },
  });
}

export function findProductSync(
  slugOrId: string | number,
  sourceProducts: Product[] = INITIAL_PRODUCTS
): Product | null {
  if (typeof slugOrId === "number" || /^\d+$/.test(String(slugOrId))) {
    const id = Number(slugOrId);
    return sourceProducts.find((p) => p.id === id) || null;
  }
  return (
    sourceProducts.find((p) => p.slug === slugOrId) ||
    sourceProducts.find((p) => slugOrId.endsWith(`-${p.id}`)) ||
    null
  );
}

export function getCollectionsSync(): CollectionItem[] {
  return COLLECTIONS_MOCK;
}

