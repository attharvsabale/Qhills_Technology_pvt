"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, color?: string, size?: string) => void;
  updateQty: (
    productId: string,
    qty: number,
    color?: string,
    size?: string
  ) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

const same = (a: CartItem, b: CartItem) =>
  a.productId === b.productId && a.color === b.color && a.size === b.size;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const idx = s.items.findIndex((i) => same(i, item));
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + item.quantity,
            };
            return { items: next };
          }
          return { items: [...s.items, item] };
        }),
      remove: (productId, color, size) =>
        set((s) => ({
          items: s.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.color === color &&
                i.size === size
              )
          ),
        })),
      updateQty: (productId, qty, color, size) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.productId === productId &&
              i.color === color &&
              i.size === size
                ? { ...i, quantity: Math.max(1, qty) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "shop-cart" }
  )
);
