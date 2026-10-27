"use client";

import { usePagination, DOTS } from "@/hooks/usePagination";
import { useScrollTop } from "@/hooks/useScrollTop";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  autoScrollTop?: boolean;
  isLoading?: boolean;
  className?: string;
}

/**
 * Reusable, presentational Pagination component.
 * Decoupled from pagination math/state logic (handled by usePagination)
 * and automatically scrolls to top ONLY after data loading has finished (handled by useScrollTop).
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  autoScrollTop = true,
  isLoading = false,
  className = "",
}: PaginationProps) {
  const { pages, canGoPrev, canGoNext } = usePagination({
    currentPage,
    totalPages,
    siblingCount,
  });

  // Automatically scroll to top ONLY after data loading completes
  useScrollTop(autoScrollTop ? currentPage : undefined, {
    isLoading,
  });

  if (totalPages <= 1) return null;

  const handlePageSelect = (targetPage: number) => {
    if (
      targetPage === currentPage ||
      targetPage < 1 ||
      targetPage > totalPages ||
      isLoading
    ) {
      return;
    }
    onPageChange(targetPage);
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`flex items-center justify-center gap-1.5 sm:gap-2 mt-16 pt-8 border-t line select-none ${
        isLoading ? "pointer-events-none opacity-60" : ""
      } ${className}`}
    >
      {/* Previous Page Button */}
      <button
        type="button"
        disabled={!canGoPrev || isLoading}
        onClick={() => handlePageSelect(currentPage - 1)}
        aria-label="Go to previous page"
        className="px-3.5 sm:px-4 py-2 border line text-[11px] sm:text-xs tracking-[0.2em] uppercase disabled:opacity-25 hover:border-[color:var(--fg)] transition-colors active:scale-95"
      >
        Prev
      </button>

      {/* Page Numbers & Ellipsis */}
      {pages.map((item, idx) => {
        if (item === DOTS) {
          return (
            <span
              key={`dots-${idx}`}
              className="w-7 sm:w-8 h-9 sm:h-10 flex items-center justify-center text-xs mute select-none font-mono"
            >
              &#8230;
            </span>
          );
        }

        const pageNum = item as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            disabled={isLoading}
            onClick={() => handlePageSelect(pageNum)}
            aria-current={isActive ? "page" : undefined}
            aria-label={`Go to page ${pageNum}`}
            className={`w-9 h-9 sm:w-10 sm:h-10 text-xs border line transition-colors flex items-center justify-center font-mono ${
              isActive
                ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)] font-medium"
                : "hover:border-[color:var(--fg)]"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Page Button */}
      <button
        type="button"
        disabled={!canGoNext || isLoading}
        onClick={() => handlePageSelect(currentPage + 1)}
        aria-label="Go to next page"
        className="px-3.5 sm:px-4 py-2 border line text-[11px] sm:text-xs tracking-[0.2em] uppercase disabled:opacity-25 hover:border-[color:var(--fg)] transition-colors active:scale-95"
      >
        Next
      </button>
    </nav>
  );
}
