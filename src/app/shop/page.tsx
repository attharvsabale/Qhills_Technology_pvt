"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { listProducts, listCategories } from "@/services/products";
import { cn } from "@/lib/utils";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Most popular", value: "popular" },
  { label: "Top rated", value: "rating" },
  { label: "Price: low → high", value: "price-asc" },
  { label: "Price: high → low", value: "price-desc" },
] as const;

export default function ShopPage() {
  return (
    <Suspense fallback={<Container className="py-10"><div className="h-8 w-40 skeleton rounded" /></Container>}>
      <ShopPageInner />
    </Suspense>
  );
}

function ShopPageInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = sp.get("q") ?? "";
  const category = sp.get("category") ?? "";
  const sort = (sp.get("sort") ?? "newest") as
    | "newest"
    | "popular"
    | "rating"
    | "price-asc"
    | "price-desc";
  const min = sp.get("min") ? Number(sp.get("min")) : undefined;
  const max = sp.get("max") ? Number(sp.get("max")) : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["products", { q, category, sort, min, max }],
    queryFn: () =>
      listProducts({
        q,
        category: category || undefined,
        sort,
        minPrice: min,
        maxPrice: max,
        pageSize: 24,
      }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
    staleTime: 60 * 60 * 1000,
  });

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    router.push(`/shop?${params.toString()}`);
  }

  function clearAll() {
    router.push("/shop");
  }

  const Filters = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-semibold">Category</h4>
        <div className="space-y-1.5">
          <button
            className={cn(
              "block w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-[var(--color-muted)]",
              !category && "bg-[var(--color-muted)] font-medium"
            )}
            onClick={() => setParam("category", null)}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam("category", c.slug)}
              className={cn(
                "block w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-[var(--color-muted)]",
                category === c.slug && "bg-[var(--color-muted)] font-medium"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold">Price</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={min ?? ""}
            onBlur={(e) => setParam("min", e.target.value || null)}
            className="h-10 w-full rounded-md border border-[var(--color-border)] px-3 text-sm"
          />
          <span className="text-[var(--color-muted-fg)]">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={max ?? ""}
            onBlur={(e) => setParam("max", e.target.value || null)}
            className="h-10 w-full rounded-md border border-[var(--color-border)] px-3 text-sm"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            { l: "Under $100", max: 100 },
            { l: "$100–$300", min: 100, max: 300 },
            { l: "$300–$800", min: 300, max: 800 },
            { l: "$800+", min: 800 },
          ].map((r, i) => (
            <button
              key={i}
              onClick={() => {
                const params = new URLSearchParams(sp.toString());
                if (r.min !== undefined) params.set("min", String(r.min));
                else params.delete("min");
                if (r.max !== undefined) params.set("max", String(r.max));
                else params.delete("max");
                router.push(`/shop?${params.toString()}`);
              }}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs hover:bg-[var(--color-muted)]"
            >
              {r.l}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={clearAll}
        className="text-xs font-medium text-[var(--color-muted-fg)] underline-offset-2 hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <Container className="py-10">
      <div className="mb-8">
        <div className="mb-1 text-xs text-[var(--color-muted-fg)]">Shop</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {category
            ? categories.find((c) => c.slug === category)?.name ?? "Products"
            : q
            ? `Results for "${q}"`
            : "All products"}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted-fg)]">
          {data ? `${data.total} products` : "Loading..."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal size={14} /> Filters
            </Button>

            <div className="hidden flex-wrap gap-2 lg:flex">
              {category && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs">
                  {categories.find((c) => c.slug === category)?.name}
                  <button onClick={() => setParam("category", null)}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {q && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs">
                  “{q}”
                  <button onClick={() => setParam("q", null)}>
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            <label className="ml-auto flex items-center gap-2 text-sm">
              <span className="hidden text-[var(--color-muted-fg)] md:inline">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && data && data.items.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-muted)]">
                <Filter size={22} />
              </div>
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-sm text-[var(--color-muted-fg)]">
                Try adjusting your filters or search term.
              </p>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          )}

          {!isLoading && data && data.items.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          filtersOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity",
            filtersOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setFiltersOpen(false)}
        />
        <aside
          className={cn(
            "absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 transition-transform",
            filtersOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Filters</h3>
            <button onClick={() => setFiltersOpen(false)}>
              <X size={18} />
            </button>
          </div>
          {Filters}
          <Button
            block
            className="mt-6"
            onClick={() => setFiltersOpen(false)}
          >
            Apply filters
          </Button>
        </aside>
      </div>
    </Container>
  );
}
