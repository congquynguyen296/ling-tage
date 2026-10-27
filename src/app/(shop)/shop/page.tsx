"use client";

import { Suspense } from "react";
import { Crumbs } from "@/components/ui/Crumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterDrawer } from "@/components/product/FilterDrawer";
import { ShopHeader } from "@/components/product/ShopHeader";
import { Pagination } from "@/components/ui/Pagination";
import { useShopCatalog } from "@/hooks/useShopCatalog";

function ShopCatalogContent() {
  const {
    products,
    totalItems,
    totalPages,
    isSyncingApi,
    category,
    setCategory,
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
  } = useShopCatalog();

  const activeFilterCount = sizes.length + (typeof maxPrice === "number" ? 1 : 0);

  return (
    <section className="w-full px-5 sm:px-8 md:px-12 lg:px-14 py-10">
      <Crumbs items={[["Home", "/"], ["Shop"]]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-6 mb-8">
        <div>
          <h1 className="serif text-4xl md:text-5xl">Shop All</h1>
          <p className="mute text-xs tracking-widest uppercase mt-2">
            Archive & Vintage Collection · {totalItems} Unique Pieces
          </p>
        </div>
      </div>

      {/* Extracted Header & Filter Bar */}
      <ShopHeader
        categories={categories}
        activeCategory={category}
        onSelectCategory={setCategory}
        sort={sort}
        onChangeSort={setSort}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => setFilterOpen(true)}
        sizes={sizes}
        onToggleSize={toggleSize}
        maxPrice={maxPrice}
        onClearMaxPrice={() => setMaxPrice(undefined)}
        onClearAll={clearFilters}
      />

      {/* Product Grid */}
      <div className="mt-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mute text-sm py-24 text-center">
            No products match these filters.
          </p>
        )}
      </div>

      {/* Decoupled Pagination Component: Waits for loading to complete before scrolling to top */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isSyncingApi}
      />

      {/* Filter Drawer with draft selections and Apply button */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sizes={sizes}
        maxPrice={maxPrice}
        onApply={applyFilters}
      />
    </section>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center mute">Loading catalog...</div>}>
      <ShopCatalogContent />
    </Suspense>
  );
}
