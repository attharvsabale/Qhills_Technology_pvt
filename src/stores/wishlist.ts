"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types";

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((s) => {
          const exists = s.items.find((i) => i.productId === item.productId);
          return {
            items: exists
              ? s.items.filter((i) => i.productId !== item.productId)
              : [...s.items, item],
          };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      has: (productId) => !!get().items.find((i) => i.productId === productId),
      clear: () => set({ items: [] }),
    }),
    { name: "shop-wishlist" }
  )
);
