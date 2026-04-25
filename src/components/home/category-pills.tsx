"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Smartphone,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  label: string;
  href: string;
  icon: LucideIcon;
}

const items: Item[] = [
  { label: "Phones", href: "/shop?category=smartphones", icon: Smartphone },
  { label: "Computers", href: "/shop?category=laptops", icon: Monitor },
  { label: "SmartWatch", href: "/shop?category=accessories", icon: Watch },
  { label: "Camera", href: "/shop?category=cameras", icon: Camera },
  { label: "HeadPhones", href: "/shop?category=headphones", icon: Headphones },
  { label: "Gaming", href: "/shop?category=gaming", icon: Gamepad2 },
];

export function CategoryPills() {
  const [active, setActive] = useState(3);
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {items.map((it, i) => {
        const Icon = it.icon;
        const isActive = active === i;
        return (
          <Link
            key={it.label}
            href={it.href}
            onClick={() => setActive(i)}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border px-3 py-6 transition-all",
              isActive
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:border-[var(--color-primary)]"
            )}
          >
            <Icon size={32} strokeWidth={1.5} />
            <span className="text-sm font-medium">{it.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
