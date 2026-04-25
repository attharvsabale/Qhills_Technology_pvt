import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-muted)] text-[var(--color-fg)]",
        primary: "bg-[var(--color-primary)] text-white",
        secondary: "bg-[var(--color-surf)] text-[var(--color-surf-fg)]",
        accent: "bg-[var(--color-accent)] text-white",
        success: "bg-[var(--color-aqua)] text-[var(--color-success)]",
        danger: "bg-red-50 text-[var(--color-danger)]",
        warning: "bg-amber-50 text-amber-700",
        info: "bg-indigo-50 text-[var(--color-accent)]",
        outline:
          "border border-[var(--color-border)] bg-white text-[var(--color-fg)]",
        dark: "bg-[var(--color-secondary)] text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
