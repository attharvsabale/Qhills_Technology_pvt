import type { Category, Product, Review } from "@/types";

const API = "https://dummyjson.com";

// ---------- DummyJSON shapes ----------
interface DJReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface DJProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews?: DJReview[];
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  meta?: { createdAt?: string; updatedAt?: string };
}

interface DJProductsResponse {
  products: DJProduct[];
  total: number;
  skip: number;
  limit: number;
}

interface DJCategory {
  slug: string;
  name: string;
  url: string;
}

// ---------- helpers ----------
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildSlug(p: { id: number | string; title: string }): string {
  return `${slugify(p.title)}-${p.id}`;
}

function idFromSlug(slug: string): number | null {
  const m = slug.match(/-(\d+)$/);
  return m ? Number(m[1]) : null;
}

function titleCase(s: string): string {
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function badgeFor(p: DJProduct): Product["badge"] {
  if (p.discountPercentage >= 15) return "sale";
  if (p.rating >= 4.6) return "best";
  return undefined;
}

function mapProduct(p: DJProduct): Product {
  const compareAt =
    p.discountPercentage > 0
      ? Math.round((p.price / (1 - p.discountPercentage / 100)) * 100) / 100
      : undefined;

  const features = [
    p.warrantyInformation,
    p.shippingInformation,
    p.returnPolicy,
  ].filter((x): x is string => Boolean(x));

  return {
    id: String(p.id),
    slug: buildSlug(p),
    title: p.title,
    brand: p.brand ?? titleCase(p.category),
    category: titleCase(p.category),
    categorySlug: p.category,
    description: p.description,
    price: p.price,
    compareAtPrice: compareAt,
    rating: p.rating,
    reviewCount: p.reviews?.length ?? 0,
    images: p.images?.length ? p.images : [p.thumbnail],
    stock: p.stock,
    tags: p.tags,
    features,
    badge: badgeFor(p),
    createdAt: p.meta?.createdAt ?? new Date().toISOString(),
  };
}

function mapReview(productId: string, r: DJReview, idx: number): Review {
  return {
    id: `${productId}-r${idx}`,
    productId,
    author: r.reviewerName,
    avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(r.reviewerEmail)}`,
    rating: r.rating,
    title: "",
    body: r.comment,
    date: r.date,
  };
}

// ---------- caching fetch ----------
async function djFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    // ISR-style caching on the server; ignored on the client.
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`DummyJSON ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// ---------- public API ----------
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
  // We fetch a large set then filter/sort/paginate in memory so that
  // search + price filters work even though DummyJSON's API is limited.
  let raw: DJProduct[];

  if (query.q) {
    const data = await djFetch<DJProductsResponse>(
      `/products/search?q=${encodeURIComponent(query.q)}&limit=0`
    );
    raw = data.products;
  } else if (query.category) {
    const data = await djFetch<DJProductsResponse>(
      `/products/category/${encodeURIComponent(query.category)}?limit=0`
    );
    raw = data.products;
  } else {
    const data = await djFetch<DJProductsResponse>(`/products?limit=0`);
    raw = data.products;
  }

  let items = raw.map(mapProduct);

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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const id = idFromSlug(slug);
  if (id == null) return null;
  try {
    const p = await djFetch<DJProduct>(`/products/${id}`);
    return mapProduct(p);
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const data = await djFetch<DJProductsResponse>(
    `/products?limit=100&select=id,title,description,category,price,discountPercentage,rating,stock,brand,thumbnail,images,tags,meta`
  );
  return data.products
    .map(mapProduct)
    .sort((a, b) => b.rating * b.reviewCount + b.rating - (a.rating * a.reviewCount + a.rating))
    .slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const data = await djFetch<DJProductsResponse>(
    `/products?limit=100&select=id,title,description,category,price,discountPercentage,rating,stock,brand,thumbnail,images,tags,meta`
  );
  return data.products
    .map(mapProduct)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export async function getRelatedProducts(
  slug: string,
  limit = 4
): Promise<Product[]> {
  const base = await getProductBySlug(slug);
  if (!base) return [];
  const data = await djFetch<DJProductsResponse>(
    `/products/category/${encodeURIComponent(base.categorySlug)}?limit=0`
  );
  return data.products
    .filter((p) => String(p.id) !== base.id)
    .map(mapProduct)
    .slice(0, limit);
}

export async function listCategories(): Promise<Category[]> {
  const cats = await djFetch<DJCategory[]>(`/products/categories`);
  // Pull a tiny sample per category in parallel to get an image + count.
  const enriched = await Promise.all(
    cats.map(async (c, i) => {
      try {
        const sample = await djFetch<DJProductsResponse>(
          `/products/category/${encodeURIComponent(
            c.slug
          )}?limit=1&select=thumbnail`
        );
        return {
          id: `c${i + 1}`,
          name: c.name,
          slug: c.slug,
          image: sample.products[0]?.thumbnail ?? "",
          productCount: sample.total,
        } satisfies Category;
      } catch {
        return {
          id: `c${i + 1}`,
          name: c.name,
          slug: c.slug,
          image: "",
          productCount: 0,
        } satisfies Category;
      }
    })
  );
  return enriched;
}

export async function getReviewsFor(productId: string): Promise<Review[]> {
  try {
    const p = await djFetch<DJProduct>(`/products/${productId}`);
    return (p.reviews ?? []).map((r, i) => mapReview(productId, r, i));
  } catch {
    return [];
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const p = await djFetch<DJProduct>(`/products/${id}`);
        return mapProduct(p);
      } catch {
        return null;
      }
    })
  );
  return results.filter((p): p is Product => Boolean(p));
}
