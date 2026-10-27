"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { useProductStore } from "@/service/products/store";
import { fetchProductsApi, filterAndSortProducts } from "@/service/products/queries";
import { useUiStore } from "@/service/ui/store";

export const SHOP_PAGE_SIZE = 9;

export function useShopCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial category safely from window.location if available to avoid SSR/hydration lag
  const initialCategory = useMemo(() => {
    if (typeof window !== "undefined") {
      const urlCat = new URLSearchParams(window.location.search).get("category");
      if (urlCat) return urlCat;
    }
    return searchParams.get("category") || "All";
  }, [searchParams]);

  const allProducts = useProductStore((s) => s.products);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<"new" | "lo" | "hi">("new");
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const prevParamCatRef = useRef(initialCategory);
  const mountedTimeRef = useRef(Date.now());

  // Sync URL category param only when it genuinely changes via URL
  useEffect(() => {
    const paramCat =
      (typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("category")
        : null) ||
      searchParams.get("category") ||
      "All";

    if (paramCat !== prevParamCatRef.current) {
      prevParamCatRef.current = paramCat;
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
  const isFirstMountRef = useRef(true);

  // Debounced API sync with progress bar on filter / page changes
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    // Skip if settling from initial page transition mount (< 400ms) to avoid double progress bar
    if (Date.now() - mountedTimeRef.current < 400) {
      return;
    }

    let cancelled = false;
    setIsSyncingApi(true);
    useUiStore.getState().startProgress();

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
          useUiStore.getState().completeProgress();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsSyncingApi(false);
          useUiStore.getState().completeProgress();
        }
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

  const handleSelectCategory = useCallback(
    (cat: string) => {
      setCategory(cat);
      setPage(1);
      prevParamCatRef.current = cat;

      // Update URL query parameter without triggering full page reload or scrolling
      const params = new URLSearchParams(window.location.search);
      if (cat === "All") {
        params.delete("category");
      } else {
        params.set("category", cat);
      }
      const queryString = params.toString();
      const newUrl = queryString ? `/shop?${queryString}` : "/shop";
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

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

