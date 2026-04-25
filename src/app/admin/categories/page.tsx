"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

/* --------------------------------- Data --------------------------------- */

const categories = [
  { name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&q=70" },
  { name: "Fashion", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&q=70" },
  { name: "Electronics", img: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=120&q=70" },
  { name: "Home & Lifestyle", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=120&q=70" },
  { name: "Sports & Outdoors", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=120&q=70" },
  { name: "Baby's & Toys", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=120&q=70" },
  { name: "Health & Fitness", img: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=120&q=70" },
  { name: "Books", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&q=70" },
];

type Product = { name: string; img: string; date: string; order: number; category: string };

const products: Product[] = [
  { name: "Wireless Bluetooth Headphones", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&q=70", date: "01-01-2025", order: 25, category: "Electronics" },
  { name: "Men's T-Shirt", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&q=70", date: "01-01-2025", order: 20, category: "Fashion" },
  { name: "Men's Leather Wallet", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=120&q=70", date: "01-01-2025", order: 35, category: "Fashion" },
  { name: "Memory Foam Pillow", img: "https://images.unsplash.com/photo-1631049552240-59fa2a8ea9c8?w=120&q=70", date: "01-01-2025", order: 40, category: "Home & Lifestyle" },
  { name: "Coffee Maker", img: "https://images.unsplash.com/photo-1544778229-16ab27ebb563?w=120&q=70", date: "01-01-2025", order: 45, category: "Home & Lifestyle" },
  { name: "Casual Baseball Cap", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=120&q=70", date: "01-01-2025", order: 55, category: "Fashion" },
  { name: "Full HD Webcam", img: "https://images.unsplash.com/photo-1587613864521-9ef8dfe617cc?w=120&q=70", date: "01-01-2025", order: 20, category: "Electronics" },
  { name: "Smart LED Color Bulb", img: "https://images.unsplash.com/photo-1565636192335-a71b5b4d25a9?w=120&q=70", date: "01-01-2025", order: 16, category: "Electronics" },
  { name: "Men's T-Shirt", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&q=70", date: "01-01-2025", order: 10, category: "Fashion" },
  { name: "Men's Leather Wallet", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=120&q=70", date: "01-01-2025", order: 35, category: "Fashion" },
];

const tabs = [
  { key: "all", label: "All Product", count: 145 },
  { key: "featured", label: "Featured Products" },
  { key: "sale", label: "On Sale" },
  { key: "out", label: "Out of Stock" },
];

/* --------------------------------- Page --------------------------------- */

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Discover */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900">Discover</h3>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg px-3 py-2">
              <Plus className="h-4 w-4" /> Add Product
            </button>
            <button className="inline-flex items-center gap-1.5 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-lg px-3 py-2">
              More Action <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((c, i) => {
              const isActive = activeCategory === c.name;
              return (
                <button
                  key={i}
                  onClick={() =>
                    setActiveCategory((cur) => (cur === c.name ? null : c.name))
                  }
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50/60 shadow-sm"
                      : "border-neutral-200 hover:border-emerald-400 hover:shadow-sm"
                  }`}
                >
                  <div className="relative h-10 w-12 shrink-0 rounded-md overflow-hidden bg-neutral-100">
                    <Image src={c.img} alt={c.name} fill sizes="64px" className="object-cover" unoptimized />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-emerald-700" : "text-neutral-800"
                    }`}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            aria-label="Next"
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm text-neutral-600 hover:text-neutral-900"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-2xl border border-neutral-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
          <div className="flex items-center rounded-full bg-neutral-50 p-0.5 text-sm">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-full transition ${
                  activeTab === t.key
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={`ml-1 ${
                      activeTab === t.key ? "text-emerald-600" : "text-neutral-400"
                    }`}
                  >
                    ({t.count})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your product"
                className="pl-9 pr-3 h-9 w-60 rounded-full bg-neutral-50 border border-neutral-200 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <button className="h-9 w-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700" aria-label="Add">
              <Plus className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700" aria-label="More">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-50/60 text-neutral-600">
                <th className="text-left font-medium px-5 py-3 w-10"></th>
                <th className="text-left font-medium px-5 py-3">No.</th>
                <th className="text-left font-medium px-5 py-3">Product</th>
                <th className="text-left font-medium px-5 py-3">Created Date</th>
                <th className="text-left font-medium px-5 py-3">Order</th>
                <th className="text-left font-medium px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-500">
                    No products found
                    {activeCategory ? ` in “${activeCategory}”` : ""}.
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <tr key={i} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                  <td className="px-5 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                  </td>
                  <td className="px-5 py-3 text-neutral-700">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 shrink-0 rounded-md overflow-hidden bg-neutral-100">
                        <Image src={p.img} alt={p.name} fill sizes="40px" className="object-cover" unoptimized />
                      </div>
                      <span className="text-neutral-800 max-w-[180px] leading-tight">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-700">{p.date}</td>
                  <td className="px-5 py-3 text-neutral-700">{p.order}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3 text-neutral-400">
                      <button className="hover:text-neutral-700" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="hover:text-rose-500" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-100">
          <button className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
            ← Previous
          </button>
          <div className="flex items-center gap-1 text-sm">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`h-8 w-8 rounded-md ${
                  n === 1 ? "bg-emerald-600 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-2 text-neutral-400">.....</span>
            <button className="h-8 w-8 rounded-md text-neutral-600 hover:bg-neutral-100">24</button>
          </div>
          <button className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
