"use client";

import { useMemo } from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
};

type Item = number | "dots";

function getPages(page: number, total: number, siblingCount: number): Item[] {
  const totalNumbers = siblingCount * 2 + 5; // first + last + current + 2*siblings + 2*dots
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;

  const items: Item[] = [];

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1
    );
    items.push(...leftRange, "dots", total);
  } else if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => total - (3 + siblingCount * 2) + 1 + i
    );
    items.push(1, "dots", ...rightRange);
  } else if (showLeftDots && showRightDots) {
    const middle = Array.from(
      { length: right - left + 1 },
      (_, i) => left + i
    );
    items.push(1, "dots", ...middle, "dots", total);
  } else {
    items.push(...Array.from({ length: total }, (_, i) => i + 1));
  }

  return items;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  const pages = useMemo(
    () => getPages(page, totalPages, siblingCount),
    [page, totalPages, siblingCount]
  );

  if (totalPages <= 1) return null;

  const goPrev = () => onPageChange(Math.max(1, page - 1));
  const goNext = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-4 py-4 sm:px-5 ${className}`}
    >
      <button
        onClick={goPrev}
        disabled={page === 1}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span aria-hidden>←</span> Previous
      </button>

      <div className="order-last w-full overflow-x-auto sm:order-none sm:w-auto">
        <div className="flex items-center gap-1 whitespace-nowrap">
          {pages.map((p, i) =>
            p === "dots" ? (
              <span key={`d-${i}`} className="px-2 text-neutral-400">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-md text-sm ${
                  page === p
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      </div>

      <button
        onClick={goNext}
        disabled={page === totalPages}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next <span aria-hidden>→</span>
      </button>
    </div>
  );
}
