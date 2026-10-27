"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { useProductStore } from "@/service/products/store";
import { fetchProductsApi, filterAndSortProducts } from "@/service/products/queries";
import { useUiStore } from "@/service/ui/store";

export const SHOP_PAGE_SIZE = 9;

export function useShopCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const allProducts = useProductStore((s) => s.products);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<"new" | "lo" | "hi">("new");
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync URL category param if user navigates from header/footer
  useEffect(() => {
    const paramCat = searchParams.get("category");
    if (paramCat) {
      setCategory(paramCat);
      setPage(1);
    }
  }, [searchParams]);

  // Initial synchronous computation for immediate paint
  const initialPaginated = useMemo(
    () =>
      filterAndSortProducts(allProducts, {
        category,
        sizes,
        maxPrice,
        sort,
        page,
        pageSize: SHOP_PAGE_SIZE,
      }),
    [allProducts, category, sizes, maxPrice, sort, page]
  );

  const [displayItems, setDisplayItems] = useState<Product[]>(initialPaginated.items);
  const [totalItems, setTotalItems] = useState<number>(initialPaginated.total);
  const [totalPages, setTotalPages] = useState<number>(initialPaginated.totalPages);
  const [isSyncingApi, setIsSyncingApi] = useState(false);

  // Debounced API sync with simulated 2s delay & progress bar
  useEffect(() => {
    let cancelled = false;
    setIsSyncingApi(true);
    useUiStore.getState().triggerProgress();

    fetchProductsApi(
      {
        category,
        sizes,
        maxPrice,
        sort,
        page,
        pageSize: SHOP_PAGE_SIZE,
      },
      allProducts
    )
      .then((res) => {
        if (!cancelled) {
          setDisplayItems(res.data.items);
          setTotalItems(res.data.total);
          setTotalPages(res.data.totalPages);
          setIsSyncingApi(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsSyncingApi(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, sizes, maxPrice, sort, page, allProducts]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(allProducts.map((p) => p.category)))],
    [allProducts]
  );

  const toggleSize = useCallback((s: string) => {
    setPage(1);
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }, []);

  const handleSelectCategory = useCallback((cat: string) => {
    setCategory(cat);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSizes([]);
    setMaxPrice(undefined);
    setPage(1);
  }, []);

  const applyFilters = useCallback(
    ({ sizes: newSizes, maxPrice: newMaxPrice }: { sizes: string[]; maxPrice?: number }) => {
      setSizes(newSizes);
      setMaxPrice(newMaxPrice);
      setPage(1);
    },
    []
  );

  return {
    products: displayItems,
    totalItems,
    totalPages,
    isSyncingApi,
    category,
    setCategory: handleSelectCategory,
    sort,
    setSort,
    sizes,
    toggleSize,
    maxPrice,
    setMaxPrice,
    page,
    setPage,
    filterOpen,
    setFilterOpen,
    categories,
    clearFilters,
    applyFilters,
  };
}

