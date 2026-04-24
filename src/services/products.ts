import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { reviews } from "@/data/reviews";
import type { Product } from "@/types";
import { sleep } from "@/lib/utils";

export interface ProductQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  page?: number;
  pageSize?: number;
}

export async function listProducts(query: ProductQuery = {}): Promise<{
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}> {
  await sleep(250);
  let items = [...products];

  if (query.q) {
    const q = query.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (query.category) {
    items = items.filter((p) => p.categorySlug === query.category);
  }
  if (typeof query.minPrice === "number") {
    items = items.filter((p) => p.price >= query.minPrice!);
  }
  if (typeof query.maxPrice === "number") {
    items = items.filter((p) => p.price <= query.maxPrice!);
  }
  switch (query.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
      items.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
    default:
      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;
  const total = items.length;
  const paged = items.slice((page - 1) * pageSize, page * pageSize);

  return { items: paged, total, page, pageSize };
}

export async function getProductBySlug(slug: string) {
  await sleep(200);
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 8) {
  await sleep(150);
  return [...products]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, limit);
}

export async function getNewArrivals(limit = 8) {
  await sleep(150);
  return [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export async function getRelatedProducts(slug: string, limit = 4) {
  await sleep(120);
  const base = products.find((p) => p.slug === slug);
  if (!base) return [];
  return products
    .filter((p) => p.categorySlug === base.categorySlug && p.slug !== slug)
    .slice(0, limit);
}

export async function listCategories() {
  await sleep(100);
  return categories;
}

export async function getReviewsFor(productId: string) {
  await sleep(120);
  return reviews.filter((r) => r.productId === productId);
}
