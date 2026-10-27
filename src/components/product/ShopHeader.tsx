"use client";

import { Icons } from "@/components/ui/Icons";
import { SortDropdown } from "@/components/product/SortDropdown";

interface ShopHeaderProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  sort: "new" | "lo" | "hi";
  onChangeSort: (sort: "new" | "lo" | "hi") => void;
  activeFilterCount: number;
  onOpenFilter: () => void;
  sizes: string[];
  onToggleSize: (size: string) => void;
  maxPrice?: number;
  onClearMaxPrice: () => void;
  onClearAll: () => void;
}

export function ShopHeader({
  categories,
  activeCategory,
  onSelectCategory,
  sort,
  onChangeSort,
  activeFilterCount,
  onOpenFilter,
  sizes,
  onToggleSize,
  maxPrice,
  onClearMaxPrice,
  onClearAll,
}: ShopHeaderProps) {
  const hasActiveFilters = sizes.length > 0 || typeof maxPrice === "number";

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b line">
        {/* Category Navigation Pills */}
        <div className="flex items-center gap-6 overflow-x-auto no-sb text-xs tracking-[0.18em] uppercase py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap transition-colors py-1 ${
                  isActive
                    ? "border-b-2 border-black font-semibold text-black"
                    : "mute hover:text-black"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Action Controls: Filter trigger + Sort Dropdown */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
          <button
            type="button"
            onClick={onOpenFilter}
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-4 py-2 border line hover:border-[color:var(--fg)] transition-colors"
          >
            {Icons.filter}
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[color:var(--accent)] text-white text-[10px] flex items-center justify-center font-mono">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SortDropdown value={sort} onChange={onChangeSort} />
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs mute mr-1 uppercase tracking-wider">Active:</span>
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onToggleSize(s)}
              className="text-xs px-2.5 py-1 border line bg-[color:var(--card)] flex items-center gap-1.5 hover:bg-neutral-200 transition-colors"
            >
              <span>Size {s}</span>
              <span className="text-[10px] opacity-60">✕</span>
            </button>
          ))}
          {typeof maxPrice === "number" && (
            <button
              type="button"
              onClick={onClearMaxPrice}
              className="text-xs px-2.5 py-1 border line bg-[color:var(--card)] flex items-center gap-1.5 hover:bg-neutral-200 transition-colors"
            >
              <span>Under ${maxPrice}</span>
              <span className="text-[10px] opacity-60">✕</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs mute underline ml-2 hover:text-[color:var(--fg)]"
          >
            Clear all
          </button>
        </div>
      )}
    </>
  );
}

