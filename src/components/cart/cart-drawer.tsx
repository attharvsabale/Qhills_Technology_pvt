"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);

  return (
    <Sheet open={open} onClose={onClose} title={`Your Cart (${items.length})`}>
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-6xl">🛒</div>
          <h4 className="text-lg font-semibold">Your cart is empty</h4>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Explore our products and add your favorites to cart.
          </p>
          <Link href="/shop" onClick={onClose}>
            <Button>Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 divide-y divide-[var(--color-border)] overflow-y-auto px-5">
            {items.map((i) => (
              <div
                key={`${i.productId}-${i.color}-${i.size}`}
                className="flex gap-4 py-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-muted)]">
                  <Image src={i.image} alt={i.title} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${i.slug}`}
                    onClick={onClose}
                    className="line-clamp-2 text-sm font-medium hover:text-[var(--color-accent)]"
                  >
                    {i.title}
                  </Link>
                  {(i.color || i.size) && (
                    <div className="mt-0.5 text-xs text-[var(--color-muted-fg)]">
                      {[i.color, i.size].filter(Boolean).join(" • ")}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-[var(--color-border)]">
                      <button
                        onClick={() =>
                          updateQty(i.productId, i.quantity - 1, i.color, i.size)
                        }
                        className="grid h-8 w-8 place-items-center hover:bg-[var(--color-muted)]"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button
                        onClick={() =>
                          updateQty(i.productId, i.quantity + 1, i.color, i.size)
                        }
                        className="grid h-8 w-8 place-items-center hover:bg-[var(--color-muted)]"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">
                        {formatCurrency(i.price * i.quantity)}
                      </div>
                      <button
                        onClick={() => remove(i.productId, i.color, i.size)}
                        className="text-neutral-400 hover:text-[var(--color-danger)]"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--color-border)] bg-white px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[var(--color-muted-fg)]">Subtotal</span>
              <span className="text-base font-semibold">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={onClose}>
                <Button variant="outline" block>
                  View cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={onClose}>
                <Button block>Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
