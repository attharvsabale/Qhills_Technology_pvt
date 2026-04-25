"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { useWishlist } from "@/stores/wishlist";
import { useCart } from "@/stores/cart";
import {
  getProductsByIds,
  getFeaturedProducts,
} from "@/services/products";
import { discountPercent, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const add = useCart((s) => s.add);

  const ids = items.map((i) => i.productId);

  const { data: rows = [] } = useQuery({
    queryKey: ["wishlist-products", ids],
    queryFn: () => getProductsByIds(ids),
    enabled: ids.length > 0,
  });

  const { data: featured = [] } = useQuery({
    queryKey: ["featured-products", 8],
    queryFn: () => getFeaturedProducts(8),
  });

  // "Just For You": top-rated products not already in wishlist
  const wishlistIds = new Set(rows.map((p: Product) => p.id));
  const justForYou = featured
    .filter((p) => !wishlistIds.has(p.id))
    .slice(0, 4);

  if (rows.length === 0) {
    return (
      <Container className="py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-muted)]">
            <Heart size={28} />
          </div>
          <h1 className="text-2xl font-semibold">Your wishlist is empty</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Save items you love to find them quickly later.
          </p>
          <Link href="/shop">
            <Button size="lg">Browse products</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const moveAllToBag = () => {
    rows.forEach((p) => {
      add({
        productId: p.id,
        title: p.title,
        image: p.images[0],
        price: p.price,
        quantity: 1,
        slug: p.slug,
      });
      remove(p.id);
    });
  };

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Wishlist ({rows.length})</h1>
        <button
          onClick={moveAllToBag}
          className="rounded-[4px] border border-[var(--color-border)] bg-white px-8 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-muted)]"
        >
          Move All To Bag
        </button>
      </div>

      {/* Wishlist grid */}
      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((p) => (
          <WishlistCard
            key={p.id}
            product={p}
            onRemove={() => remove(p.id)}
            onAdd={() =>
              add({
                productId: p.id,
                title: p.title,
                image: p.images[0],
                price: p.price,
                quantity: 1,
                slug: p.slug,
              })
            }
          />
        ))}
      </div>

      {/* Just For You */}
      <div className="mt-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="block h-8 w-3 rounded-sm bg-[var(--color-primary)]" />
          <h2 className="text-xl font-medium">Just For You</h2>
        </div>
        <Link
          href="/shop"
          className="rounded-[4px] border border-[var(--color-border)] bg-white px-8 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-muted)]"
        >
          See All
        </Link>
      </div>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {justForYou.map((p) => (
          <JustForYouCard
            key={p.id}
            product={p}
            onAdd={() =>
              add({
                productId: p.id,
                title: p.title,
                image: p.images[0],
                price: p.price,
                quantity: 1,
                slug: p.slug,
              })
            }
          />
        ))}
      </div>
    </Container>
  );
}

function WishlistCard({
  product,
  onRemove,
  onAdd,
}: {
  product: Product;
  onRemove: () => void;
  onAdd: () => void;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[4px] bg-[var(--color-muted)]">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-6"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-[4px] bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white">
            -{discount}%
          </span>
        )}

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove from wishlist"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-[var(--color-fg)] shadow-sm transition-colors hover:bg-[var(--color-muted)]"
        >
          <Trash2 size={16} />
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:bg-black/90"
        >
          <ShoppingCart size={18} />
          <span>Add To Cart</span>
        </button>
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="mt-4 text-sm font-medium hover:text-[var(--color-primary)]"
      >
        {product.title}
      </Link>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-sm font-medium text-[var(--color-danger)]">
          {formatCurrency(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-sm text-[var(--color-muted-fg)] line-through">
            {formatCurrency(product.compareAtPrice)}
          </span>
        )}
      </div>
    </article>
  );
}

function JustForYouCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[4px] bg-[var(--color-muted)]">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-6"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-[4px] bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white">
              -{discount}%
            </span>
          )}
          {product.badge === "new" && (
            <span className="rounded-[4px] bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white">
              NEW
            </span>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          aria-label="Quick view"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-[var(--color-fg)] shadow-sm transition-colors hover:bg-[var(--color-muted)]"
        >
          <Eye size={16} />
        </Link>

        <button
          type="button"
          onClick={onAdd}
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:bg-black/90"
        >
          <ShoppingCart size={18} />
          <span>Add To Cart</span>
        </button>
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="mt-4 text-sm font-medium hover:text-[var(--color-primary)]"
      >
        {product.title}
      </Link>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-sm font-medium text-[var(--color-danger)]">
          {formatCurrency(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-sm text-[var(--color-muted-fg)] line-through">
            {formatCurrency(product.compareAtPrice)}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <Rating value={product.rating} />
        <span className="text-xs text-[var(--color-muted-fg)]">
          ({product.reviewCount})
        </span>
      </div>
    </article>
  );
}
