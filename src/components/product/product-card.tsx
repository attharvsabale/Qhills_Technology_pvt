"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { cn, discountPercent, formatCurrency } from "@/lib/utils";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const isWished = useWishlist((s) => s.has(product.id));
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[var(--color-muted)]"
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge === "new" && <Badge variant="dark">New</Badge>}
          {product.badge === "hot" && <Badge variant="accent">Hot</Badge>}
          {product.badge === "best" && <Badge variant="info">Best seller</Badge>}
          {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWish({
              productId: product.id,
              title: product.title,
              image: product.images[0],
              price: product.price,
              slug: product.slug,
            });
          }}
          aria-label="Toggle wishlist"
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-sm backdrop-blur transition-colors hover:bg-white",
            isWished && "text-[var(--color-danger)]"
          )}
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-xs uppercase tracking-wider text-[var(--color-muted-fg)]">
          {product.category}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium hover:text-[var(--color-accent)]"
        >
          {product.title}
        </Link>
        <div className="flex items-center gap-2">
          <Rating value={product.rating} />
          <span className="text-xs text-[var(--color-muted-fg)]">
            ({product.reviewCount})
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="text-base font-semibold">
              {formatCurrency(product.price)}
            </div>
            {product.compareAtPrice && (
              <div className="text-xs text-[var(--color-muted-fg)] line-through">
                {formatCurrency(product.compareAtPrice)}
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Add to cart"
            onClick={() =>
              add({
                productId: product.id,
                title: product.title,
                image: product.images[0],
                price: product.price,
                quantity: 1,
                slug: product.slug,
              })
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-transform hover:scale-105"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-3">
      <div className="skeleton aspect-square rounded-[var(--radius-md)]" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
    </div>
  );
}
