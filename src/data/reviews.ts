import type { Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Priya S.",
    avatar: "https://i.pravatar.cc/80?img=32",
    rating: 5,
    title: "Best phone I've owned",
    body: "The display is gorgeous and battery easily lasts a full day. Camera is a huge step up from my old phone.",
    date: "2026-04-10",
  },
  {
    id: "r2",
    productId: "p1",
    author: "Daniel K.",
    avatar: "https://i.pravatar.cc/80?img=15",
    rating: 4,
    title: "Great, but pricey",
    body: "Love everything about it except the price. Fast charging is a lifesaver on busy days.",
    date: "2026-04-02",
  },
  {
    id: "r3",
    productId: "p1",
    author: "Anaya M.",
    avatar: "https://i.pravatar.cc/80?img=45",
    rating: 5,
    title: "Camera is magical",
    body: "Low-light shots are next level. Photography alone justifies the upgrade.",
    date: "2026-03-28",
  },
];
