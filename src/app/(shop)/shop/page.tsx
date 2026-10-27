"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Crumbs } from "@/components/ui/Crumbs";
import { Icons } from "@/components/ui/Icons";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterDrawer } from "@/components/product/FilterDrawer";
import { SortDropdown } from "@/components/product/SortDropdown";
import { useProductStore } from "@/service/products/store";
import { fetchProductsApi, filterAndSortProducts } from "@/service/products/queries";
import { useUiStore } from "@/service/ui/store";
import { Product } from "@/types";

const PAGE_SIZE = 9;

function ShopCatalogContent() {
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

  // Initial synchronous computation + 2-second debounced mock API sync
  const initialPaginated = filterAndSortProducts(allProducts, {
    category,
    sizes,
    maxPrice,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const [displayItems, setDisplayItems] = useState<Product[]>(initialPaginated.items);
  const [totalItems, setTotalItems] = useState<number>(initialPaginated.total);
  const [totalPages, setTotalPages] = useState<number>(initialPaginated.totalPages);
  const [isSyncingApi, setIsSyncingApi] = useState(false);

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
        pageSize: PAGE_SIZE,
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

  const categories = [
    "All",
    ...Array.from(new Set(allProducts.map((p) => p.category))),
  ];

  const toggleSize = (s: string) => {
    setPage(1);
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const tabClass = (active: boolean) =>
    `ul py-1 ${active ? "border-b border-current" : "mute hover:text-[color:var(--fg)]"}`;

  const activeFilterCount = sizes.length + (maxPrice ? 1 : 0);

  return (
    <section className="max-w-[1500px] mx-auto px-5 py-12">
      <Crumbs items={[["Home", "/"], ["Shop"]]} />

      <div className="flex items-end justify-between mt-4 mb-6">
        <h1 className="serif text-4xl md:text-5xl">
          {category === "All" ? "All Products" : category}
        </h1>
        <div className="flex items-center gap-3">
          <span className="mute text-xs">{totalItems} items</span>
        </div>
      </div>

      {/* Category Bar */}
      {/* <div className="border-y line"> */}
        <div className="flex gap-7 h-12 items-center overflow-x-auto no-sb text-[11px] tracking-[0.2em] uppercase whitespace-nowrap">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={tabClass(c === category)}
            >
              {c === "All" ? "New Arrivals" : c}
            </button>
          ))}
        </div>
      {/* </div> */}

      {/* Filter & Sort Bar */}
      <div className="flex items-center justify-between gap-4 py-3 mb-8 border-b line">
        <div className="flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase py-2"
          >
            {Icons.filter}
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-[color:var(--accent)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className="ul text-[11px] tracking-[0.15em] uppercase mute"
            >
              {s} ×
            </button>
          ))}

          {maxPrice && (
            <button
              type="button"
              onClick={() => {
                setMaxPrice(undefined);
                setPage(1);
              }}
              className="ul text-[11px] tracking-[0.15em] uppercase mute"
            >
              Under ${maxPrice} ×
            </button>
          )}
        </div>

        <SortDropdown
          value={sort}
          onChange={(next) => {
            setSort(next);
            setPage(1);
          }}
        />
      </div>

      {/* Product Grid */}
      <div>
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
            {displayItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mute text-sm py-24 text-center">
            No products match these filters.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t line">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border line text-xs tracking-[0.2em] uppercase disabled:opacity-30"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setPage(pageNum)}
              className={`w-10 h-10 text-xs border line ${
                page === pageNum ? "bg-[color:var(--accent)] text-white" : ""
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border line text-xs tracking-[0.2em] uppercase disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sizes={sizes}
        onToggleSize={toggleSize}
        maxPrice={maxPrice}
        onChangeMaxPrice={(val) => {
          setMaxPrice(val);
          setPage(1);
        }}
        onClear={() => {
          setSizes([]);
          setMaxPrice(undefined);
          setPage(1);
        }}
        count={totalItems}
      />
    </section>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1500px] mx-auto px-5 py-24 text-center text-xs tracking-[0.2em] uppercase mute">
          Loading TAGE Catalog...
        </div>
      }
    >
      <ShopCatalogContent />
    </Suspense>
  );
}

