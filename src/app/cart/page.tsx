"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronUp, ChevronDown, ShoppingBag, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);

  const [coupon, setCoupon] = useState("");

  const shipping = 0; // Free per design
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Container className="py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-muted)]">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Looks like you haven&apos;t added anything yet. Start exploring our
            catalog.
          </p>
          <Link href="/shop">
            <Button size="lg">Continue shopping</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-muted-fg)]">
        <Link href="/" className="hover:text-[var(--color-fg)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-fg)]">Cart</span>
      </nav>

      {/* Table header */}
      <div className="mt-10 hidden grid-cols-[2fr_1fr_1fr_1fr] items-center rounded-[4px] bg-white px-10 py-6 shadow-[0_1px_13px_rgba(0,0,0,0.05)] md:grid">
        <span className="text-base">Product</span>
        <span className="text-base">Price</span>
        <span className="text-base">Quantity</span>
        <span className="text-right text-base">Subtotal</span>
      </div>

      {/* Rows */}
      <div className="mt-10 space-y-10">
        {items.map((i) => {
          const lineTotal = i.price * i.quantity;
          return (
            <div
              key={`${i.productId}-${i.color}-${i.size}`}
              className="grid grid-cols-1 items-center gap-4 rounded-[4px] bg-white px-10 py-6 shadow-[0_1px_13px_rgba(0,0,0,0.05)] md:grid-cols-[2fr_1fr_1fr_1fr]"
            >
              {/* Product cell */}
              <div className="flex items-center gap-5">
                <div className="relative h-14 w-14 shrink-0">
                  <Image
                    src={i.image}
                    alt={i.title}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                  <button
                    onClick={() => remove(i.productId, i.color, i.size)}
                    aria-label="Remove"
                    className="absolute -left-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--color-primary)] text-white"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
                <Link
                  href={`/products/${i.slug}`}
                  className="text-sm hover:text-[var(--color-primary)]"
                >
                  {i.title}
                </Link>
              </div>

              {/* Price */}
              <div className="text-sm md:text-base">
                <span className="md:hidden text-[var(--color-muted-fg)] mr-2">
                  Price:
                </span>
                {formatCurrency(i.price)}
              </div>

              {/* Quantity */}
              <div className="flex items-center md:block">
                <span className="md:hidden text-[var(--color-muted-fg)] mr-2 text-sm">
                  Qty:
                </span>
                <div className="relative inline-flex h-11 w-[72px] items-center rounded-[4px] border border-[var(--color-border)]">
                  <span className="flex-1 px-3 text-sm">
                    {String(i.quantity).padStart(2, "0")}
                  </span>
                  <div className="flex h-full flex-col border-l border-[var(--color-border)]">
                    <button
                      onClick={() =>
                        updateQty(
                          i.productId,
                          i.quantity + 1,
                          i.color,
                          i.size
                        )
                      }
                      aria-label="Increase quantity"
                      className="grid h-1/2 w-6 place-items-center text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() =>
                        updateQty(
                          i.productId,
                          Math.max(1, i.quantity - 1),
                          i.color,
                          i.size
                        )
                      }
                      aria-label="Decrease quantity"
                      className="grid h-1/2 w-6 place-items-center text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-sm md:text-right md:text-base">
                <span className="md:hidden text-[var(--color-muted-fg)] mr-2">
                  Subtotal:
                </span>
                {formatCurrency(lineTotal)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Return / Update */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/shop"
          className="rounded-[4px] border border-[var(--color-border)] px-12 py-4 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-muted)]"
        >
          Return To Shop
        </Link>
        <button
          type="button"
          onClick={() => {
            /* update is automatic via store; button kept for visual parity */
          }}
          className="rounded-[4px] border border-[var(--color-border)] px-12 py-4 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-muted)]"
        >
          Update Cart
        </button>
      </div>

      {/* Coupon + Cart Total */}
      <div className="mt-20 grid gap-8 lg:grid-cols-2">
        <div className="flex h-fit flex-wrap gap-4">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon Code"
            className="h-14 flex-1 min-w-[200px] rounded-[4px] border border-[var(--color-fg)] px-6 text-base outline-none placeholder:text-[var(--color-muted-fg)]"
          />
          <button
            type="button"
            className="h-14 rounded-[4px] bg-[var(--color-primary)] px-12 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Apply Coupon
          </button>
        </div>

        <aside className="ml-auto w-full max-w-md rounded-[4px] border border-[var(--color-fg)] p-6">
          <h3 className="text-xl font-medium">Cart Total</h3>

          <div className="mt-6 flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <span className="text-base">Subtotal:</span>
            <span className="text-base">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--color-border)] py-4">
            <span className="text-base">Shipping:</span>
            <span className="text-base">
              {shipping === 0 ? "Free" : formatCurrency(shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-base">Total:</span>
            <span className="text-base">{formatCurrency(total)}</span>
          </div>

          <div className="mt-2 flex justify-center">
            <Link
              href="/checkout"
              className="rounded-[4px] bg-[var(--color-primary)] px-12 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Procees to checkout
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
