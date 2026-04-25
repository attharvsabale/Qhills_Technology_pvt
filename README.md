# Nova — E-Commerce Frontend

A production-ready, responsive multi-category e-commerce frontend built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Zustand**, and **TanStack Query**. It ships with a complete customer storefront and an admin dashboard, backed by the public [DummyJSON](https://dummyjson.com) API.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Tech stack](#tech-stack)
3. [Top-level layout](#top-level-layout)
4. [`src/` deep dive](#src-deep-dive)
   - [`src/app/` — routes](#srcapp--routes)
   - [`src/components/` — UI building blocks](#srccomponents--ui-building-blocks)
   - [`src/services/` — data layer](#srcservices--data-layer)
   - [`src/stores/` — client state](#srcstores--client-state)
   - [`src/types/` — domain models](#srctypes--domain-models)
   - [`src/lib/` — shared utilities](#srclib--shared-utilities)
5. [Design system & styling](#design-system--styling)
6. [Data flow](#data-flow)
7. [Deployment](#deployment-vercel)
8. [Conventions & notes](#conventions--notes)

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # run production build
npm run lint         # eslint
```

- Customer site: <http://localhost:3000>
- Admin dashboard: <http://localhost:3000/admin>

No environment variables required — all data is fetched from DummyJSON.

---

## Tech stack

| Concern            | Choice                                                              |
| ------------------ | ------------------------------------------------------------------- |
| Framework          | **Next.js 16** (App Router, RSC by default)                         |
| Language           | **TypeScript** (strict)                                             |
| Styling            | **Tailwind CSS v4** with `@theme` tokens in `globals.css`           |
| Client state       | **Zustand** + `persist` (cart, wishlist, auth)                      |
| Server state       | **@tanstack/react-query v5** (product/admin data caching)           |
| Forms & validation | **react-hook-form** + **zod** (`@hookform/resolvers`)               |
| Icons              | **lucide-react**                                                    |
| Class utilities    | `clsx`, `tailwind-merge`, `class-variance-authority`                |
| Images             | `next/image` with remote patterns (Unsplash, picsum, pravatar, DummyJSON) |
| Data source        | [DummyJSON](https://dummyjson.com) public REST API                  |

---

## Top-level layout

```
task/
├── AGENTS.md                 # Agent rules (this is NOT vanilla Next.js — read docs in node_modules/next/dist/docs)
├── CLAUDE.md                 # Re-exports AGENTS.md for Claude tooling
├── README.md                 # This file
├── eslint.config.mjs         # Flat ESLint config (next/core-web-vitals + TS)
├── next.config.ts            # Next config: image remotePatterns
├── next-env.d.ts             # Next.js type augmentation (do not edit)
├── package.json              # Scripts & dependencies
├── postcss.config.mjs        # Tailwind v4 PostCSS plugin
├── tsconfig.json             # TS config + `@/*` path alias → `src/*`
├── public/                   # Static assets served at site root
│   ├── card.svg              # Custom card illustration
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg  # Defaults from CRA
└── src/                      # All application code
```

Notable config detail — `next.config.ts` whitelists remote image hosts so `next/image` can optimise them:

```ts
images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }, ... ] }
```

---

## `src/` deep dive

```
src/
├── app/            # Routes (App Router)
├── components/     # Reusable UI
├── lib/            # Tiny shared helpers
├── services/       # Data-fetching functions (DummyJSON adapters)
├── stores/         # Zustand client stores
└── types/          # Shared TypeScript interfaces
```

### `src/app/` — routes

Next.js 16 App Router. Every folder is a URL segment; `page.tsx` makes it routable, `layout.tsx` wraps children. Server Components by default — files marked `"use client"` opt into the client.

```
src/app/
├── globals.css              # Tailwind v4 @import + design tokens (@theme block)
├── layout.tsx               # Root <html>/<body>, fonts (Lato + Geist Mono), Providers, Header, Footer
├── providers.tsx            # Client-only TanStack Query provider (handles SSR hydration)
├── page.tsx                 # Home: hero, category pills, flash deals, featured grid
├── not-found.tsx            # Custom 404
│
├── about/page.tsx           # About / brand story page
├── contact/page.tsx         # Contact form (RHF + Zod)
├── login/page.tsx           # Split-screen login (fake auth via Zustand)
├── signup/page.tsx          # Split-screen signup with confirm-password + terms
├── account/page.tsx         # Authenticated user dashboard (Orders / Wishlist / Addresses / Profile / Settings tabs)
│
├── shop/page.tsx            # PLP — URL-driven filters (q, category, sort, min, max), mobile filter drawer
├── products/[slug]/page.tsx # PDP — gallery, variants, qty, wishlist, tabs, related products
├── cart/page.tsx            # Cart page — qty stepper, totals (free shipping >$100, 8% tax)
├── wishlist/page.tsx        # Wishlist with move-to-cart
├── checkout/page.tsx        # 3-step checkout (Contact → Shipping → Payment), Zod validated
│
└── admin/                   # Admin dashboard — separate layout, no public auth gate
    ├── layout.tsx           # Sidebar + topbar shell for /admin/*
    ├── page.tsx             # Dashboard: KPIs, revenue chart, top customers, recent orders/transactions
    ├── orders/page.tsx      # Orders table with status tabs + search
    ├── customers/
    │   ├── page.tsx         # Customers list
    │   └── [id]/page.tsx    # Customer detail with order history
    ├── categories/page.tsx  # CRUD-style category manager (slide-over Sheet)
    ├── products/
    │   ├── page.tsx         # Product catalog table
    │   └── new/page.tsx     # "Add product" form (images, pricing, stock)
    ├── transactions/page.tsx# Transactions table (status / method filters)
    └── profile/page.tsx     # Admin profile settings
```

**Key files explained**

- [src/app/layout.tsx](src/app/layout.tsx) — Loads Lato (UI) + Geist Mono (numerics), wires global `Providers`, mounts `Header` + `Footer` around `{children}`. Sets default `metadata` (title template `%s · Nova`).
- [src/app/providers.tsx](src/app/providers.tsx) — Creates a singleton `QueryClient` per browser tab and a fresh one per server request. Defaults: `staleTime: 60s`, `refetchOnWindowFocus: false`.
- [src/app/globals.css](src/app/globals.css) — Tailwind v4 entrypoint. Defines design tokens via `@theme` (colors, radii, shadows) consumed throughout components as `var(--color-*)`.
- [src/app/admin/layout.tsx](src/app/admin/layout.tsx) — Standalone admin shell (sidebar nav + topbar). Replaces the customer header for `/admin/*` routes.

### `src/components/` — UI building blocks

```
src/components/
├── ui/                       # Primitive, reusable, design-system pieces
│   ├── badge.tsx             # Pill badges (sale/new/best/hot variants via cva)
│   ├── button.tsx            # Button with variants (primary, ghost, outline, ...) and sizes
│   ├── container.tsx         # Max-width centered wrapper used by every page
│   ├── input.tsx             # Styled <input> + <textarea> with consistent focus rings
│   ├── rating.tsx            # Star rating display (read-only)
│   └── sheet.tsx             # Side-drawer (used for cart drawer, admin slide-overs)
│
├── layout/
│   ├── header.tsx            # Top nav: logo, links, search, account/cart/wishlist icons, mobile menu
│   └── footer.tsx            # Footer with link columns + newsletter form
│
├── product/
│   ├── product-card.tsx      # Grid card: image, badge, title, brand, rating, price, quick add
│   └── product-detail.tsx    # Full PDP UI used by /products/[slug]
│
├── cart/
│   └── cart-drawer.tsx       # Right-side mini-cart triggered from header
│
└── home/
    ├── category-pills.tsx    # Scrollable category chips on home
    └── flash-countdown.tsx   # Flash-deal countdown timer for home banner
```

All components are typed, tree-shakeable, and use the `cn()` helper from [src/lib/utils.ts](src/lib/utils.ts) to merge Tailwind classes safely.

### `src/services/` — data layer

Pure functions that talk to DummyJSON and **map** raw responses into the app's domain types ([src/types/index.ts](src/types/index.ts)). They are used by both Server Components (direct `await`) and Client Components (via TanStack Query).

```
src/services/
├── products.ts   # Catalog/PDP/category data
└── admin.ts      # Users → Customers, Carts → Orders, Transactions
```

**[src/services/products.ts](src/services/products.ts)** exports (typical surface):

- `getProducts({ q?, category?, sort?, limit?, skip? })` → `Product[]`
- `getProductBySlug(slug)` → `Product` (resolves trailing `-{id}` from slug)
- `getCategories()` → `Category[]`
- `getReviews(productId)` → `Review[]`
- Helpers: `buildSlug({ id, title })`, internal `mapProduct`, `slugify`, `titleCase`, `badgeFor` (computes `sale` / `best` / `new` badges from rating + discount).

`fetch` calls use Next's `next: { revalidate: 600 }` so RSC pages can ISR for 10 minutes per query.

**[src/services/admin.ts](src/services/admin.ts)** maps DummyJSON's `/users` and `/carts` into the admin domain (`Customer`, `Order`, `Transaction`). Statuses, dates, and payment methods are produced by a deterministic `seeded(n)` LCG so values are stable across renders without a real DB.

### `src/stores/` — client state

Zustand stores. Each is `"use client"` and persisted to `localStorage` so cart/wishlist/auth survive reloads.

```
src/stores/
├── auth.ts       # { user, login(user), logout() }            — fake auth
├── cart.ts       # { items, add, remove, updateQty, clear, subtotal(), count() }
└── wishlist.ts   # { items, add, remove, has(productId) }
```

Cart items are uniquely keyed by `(productId, color, size)` so the same product with different variants is treated as separate lines (see `same()` in [src/stores/cart.ts](src/stores/cart.ts)).

### `src/types/` — domain models

Single source of truth for shapes used across services, components, and stores. Defined in [src/types/index.ts](src/types/index.ts):

| Type             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `Category`       | Storefront category (id, name, slug, image)              |
| `Product`        | Catalog product (price, compareAtPrice, rating, images, badge, stock, …) |
| `ProductVariant` | Optional variant axes (label/value/priceDelta)           |
| `CartItem`       | Line in the cart (productId, qty, color, size, slug)     |
| `WishlistItem`   | Lite product reference for wishlist                      |
| `Address`        | Shipping address used in checkout/orders                 |
| `Order`          | Admin order entity (status enum, totals, items, address) |
| `Customer`       | Admin customer entity (joinedAt, totals, status)         |
| `Transaction`    | Payment record (method/status enums)                     |
| `Review`         | Product review                                           |
| `User`           | Logged-in user (auth store)                              |

### `src/lib/` — shared utilities

```
src/lib/
└── utils.ts      # cn(...) — clsx + tailwind-merge wrapper. Currency/format helpers if added later.
```

Use `cn()` whenever combining conditional Tailwind classes:

```tsx
<button className={cn("px-4 py-2 rounded-md", active && "bg-black text-white")} />
```

---

## Design system & styling

- **Tailwind v4** is configured PostCSS-only via `@tailwindcss/postcss` (see `postcss.config.mjs`). There is **no `tailwind.config.ts`** — tokens are declared inside `@theme { ... }` in [src/app/globals.css](src/app/globals.css).
- Design tokens (colors, radii, shadows, spacing scale) are exposed as CSS variables (`--color-bg`, `--color-primary`, …). Components reference them via `var(--color-*)` or Tailwind's auto-generated utilities (`bg-primary`, `text-muted`, etc.).
- Fonts: **Lato** (`--font-lato`) for UI, **Geist Mono** (`--font-geist-mono`) for numerics, both loaded via `next/font/google` in the root layout.
- Variants are expressed with `class-variance-authority` (see [src/components/ui/button.tsx](src/components/ui/button.tsx)).

---

## Data flow

```
DummyJSON  ──fetch──▶  src/services/*.ts  ──map──▶  Domain types
                                                        │
                                ┌───────────────────────┴─────────────────────────┐
                                ▼                                                 ▼
                       Server Components (await directly)              Client Components (useQuery)
                                │                                                 │
                                └────────────────────┬────────────────────────────┘
                                                     ▼
                                        Components in src/components/*
                                                     │
                                                     ▼
                          Local UI state ◀── Zustand stores (cart / wishlist / auth)
                                                     │
                                                     ▼
                                              localStorage (persist)
```

- Pages under `src/app/` decide between RSC and `"use client"` per file.
- Read-heavy pages (Home, Shop, PDP, admin tables) prefer **Server Components** for SEO + smaller JS.
- Interactive surfaces (cart drawer, filters, forms, admin slide-overs) are **Client Components** that hydrate on demand.

---

account.
- Admin pages are not gated — they're a UI demo, not a secure surface.
- Money is rendered with simple `toFixed(2)` formatting; swap in `Intl.NumberFormat` if you need locale-aware currency.
- ESLint runs on `npm run lint` (flat config, `next/core-web-vitals` + TypeScript).

