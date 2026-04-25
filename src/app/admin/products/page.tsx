"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listProducts, listCategories } from "@/services/products";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function ProductsAdminPage() {
  const { data: fetched } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => listProducts({ pageSize: 200 }),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
    staleTime: 60 * 60 * 1000,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    if (fetched?.items) setProducts(fetched.items);
  }, [fetched]);

  const filtered = products.filter((p) => {
    if (cat !== "all" && p.categorySlug !== cat) return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function remove(id: string) {
    setProducts((xs) => xs.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            {products.length} products in catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus size={14} /> Add product
          </Button>
        </Link>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] p-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="h-9 w-full max-w-sm rounded-md border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-9 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-[var(--color-muted-fg)]">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Product</th>
                <th className="px-5 py-3 text-left font-medium">Category</th>
                <th className="px-5 py-3 text-left font-medium">Price</th>
                <th className="px-5 py-3 text-left font-medium">Stock</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-neutral-100">
                        <Image
                          src={p.images[0]}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.title}</div>
                        <div className="text-xs text-[var(--color-muted-fg)]">
                          {p.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--color-muted-fg)]">
                    {p.category}
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-5 py-3">{p.stock}</td>
                  <td className="px-5 py-3">
                    <Badge variant={p.stock > 0 ? "success" : "danger"}>
                      {p.stock > 0 ? "In stock" : "Out"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-neutral-100"
                        title="View"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => remove(p.id)}
                        className="grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
