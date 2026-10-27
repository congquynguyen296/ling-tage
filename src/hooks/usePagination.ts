"use client";

import { useMemo } from "react";

export const DOTS = "..." as const;

export interface UsePaginationOptions {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

export interface UsePaginationReturn {
  pages: Array<number | typeof DOTS>;
  canGoPrev: boolean;
  canGoNext: boolean;
  totalPages: number;
}

function createRange(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}

/**
 * Custom hook containing pure pagination logic and calculations.
 * Computes the page list with ellipsis dots (...) and boundary states.
 */
export function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const pages = useMemo<Array<number | typeof DOTS>>(() => {
    // Total numbers to show = siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    // Case 1: Total pages less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return createRange(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but right dots needed
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = createRange(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: No right dots to show, but left dots needed
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = createRange(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots needed
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return createRange(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return {
    pages,
    canGoPrev,
    canGoNext,
    totalPages,
  };
}

