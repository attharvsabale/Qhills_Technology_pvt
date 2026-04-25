"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import type { Product, Review } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { cn, formatCurrency } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  silver: "#C0C0C0",
  gold: "#D4AF37",
  red: "#E53935",
  blue: "#3B82F6",
  green: "#10B981",
  navy: "#1E293B",
  grey: "#9CA3AF",
  gray: "#9CA3AF",
  pink: "#EC4899",
  yellow: "#F0D451",
  beige: "#E8DCCB",
};

function colorToHex(name: string) {
  return COLOR_MAP[name.toLowerCase()] ?? name;
}

export function ProductDetail({
  product,
  related,
  reviews,
}: {
  product: Product;
  related: Product[];
  reviews: Review[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(2);
  const [color, setColor] = useState(product.colors?.[0]);
  const [size, setSize] = useState(
    product.sizes?.[Math.min(2, (product.sizes?.length ?? 1) - 1)]
  );

  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const isWished = useWishlist((s) => s.has(product.id));

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : product.rating;

  const thumbs = product.images.slice(0, 4);

  return (
    <div className="py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-muted-fg)]">
        <Link href="/account" className="hover:text-[var(--color-fg)]">
          Account
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/shop?category=${product.categorySlug}`}
          className="hover:text-[var(--color-fg)]"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-fg)]">{product.title}</span>
      </nav>

      <div className="mt-10 grid gap-20 lg:grid-cols-2">
        {/* Gallery */}
        <div className="grid gap-4 md:grid-cols-[170px_1fr]">
          <div className="order-2 flex gap-4 md:order-1 md:flex-col">
            {thumbs.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "relative grid aspect-[170/138] place-items-center overflow-hidden rounded-[4px] bg-[var(--color-muted)] transition-shadow",
                  activeImg === i &&
                    "ring-2 ring-[var(--color-primary)] ring-offset-2"
                )}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="170px"
                  className="object-contain p-3"
                />
              </button>
            ))}
          </div>
          <div className="relative order-1 grid aspect-[500/600] place-items-center overflow-hidden rounded-[4px] bg-[var(--color-muted)] md:order-2">
            <Image
              src={product.images[activeImg]}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Stars value={avgRating} />
              <span className="ml-2 text-[var(--color-muted-fg)]">
                ({product.reviewCount} Reviews)
              </span>
            </div>
            <span className="h-4 w-px bg-[var(--color-border)]" />
            <span
              className={cn(
                product.stock > 0
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-danger)]"
              )}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-4 text-2xl">{formatCurrency(product.price)}</div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--color-fg)]">
            {product.description}
          </p>

          <div className="my-6 h-px bg-[var(--color-border)]" />

          {/* Colours */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-6">
              <span className="text-base">Colours:</span>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full transition-shadow",
                      color === c &&
                        "ring-2 ring-[var(--color-fg)] ring-offset-2"
                    )}
                    style={{ backgroundColor: colorToHex(c) }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-base">Size:</span>
              <div className="flex flex-wrap items-center gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-8 min-w-[32px] rounded-[4px] border px-2 text-sm font-medium transition-colors",
                      size === s
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:bg-[var(--color-muted)]"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Buy Now + Wishlist */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex h-11 items-stretch rounded-[4px] border border-[var(--color-border)]">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="grid w-10 place-items-center hover:bg-[var(--color-muted)]"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="grid w-12 place-items-center border-x border-[var(--color-border)] text-base">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="grid w-10 place-items-center bg-[var(--color-primary)] text-white hover:opacity-90"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() =>
                add({
                  productId: product.id,
                  title: product.title,
                  image: product.images[0],
                  price: product.price,
                  quantity: qty,
                  slug: product.slug,
                  color,
                  size,
                })
              }
              className="h-11 rounded-[4px] bg-[var(--color-primary)] px-12 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Buy Now
            </button>

            <button
              onClick={() =>
                toggleWish({
                  productId: product.id,
                  title: product.title,
                  image: product.images[0],
                  price: product.price,
                  slug: product.slug,
                })
              }
              aria-label="Toggle wishlist"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-[4px] border border-[var(--color-border)] transition-colors hover:bg-[var(--color-muted)]",
                isWished && "text-[var(--color-danger)]"
              )}
            >
              <Heart size={18} fill={isWished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Delivery card */}
          <div className="mt-8 rounded-[4px] border border-[var(--color-border)]">
            <div className="flex items-start gap-4 p-4">
              <Truck size={32} className="mt-0.5" />
              <div>
                <div className="text-base font-medium">Free Delivery</div>
                <p className="mt-1 text-xs underline">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <div className="h-px bg-[var(--color-border)]" />
            <div className="flex items-start gap-4 p-4">
              <RotateCcw size={32} className="mt-0.5" />
              <div>
                <div className="text-base font-medium">Return Delivery</div>
                <p className="mt-1 text-xs">
                  Free 30 Days Delivery Returns.{" "}
                  <span className="underline">Details</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="flex items-center gap-4">
            <span className="block h-8 w-3 rounded-sm bg-[var(--color-primary)]" />
            <h2 className="text-xl font-medium text-[var(--color-primary)]">
              Related Item
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < full ? "#F0D451" : "none"}
          stroke={i < full ? "#F0D451" : "#C7C7C7"}
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
