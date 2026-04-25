import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-hover)]",
        dark:
          "bg-[var(--color-secondary)] text-[var(--color-secondary-fg)] hover:brightness-125",
        secondary:
          "bg-[var(--color-surf)] text-[var(--color-surf-fg)] hover:brightness-95",
        accent:
          "border border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:bg-[var(--color-aqua)]",
        gradient:
          "bg-gradient-primary text-white hover:brightness-110",
        outline:
          "border border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:bg-[var(--color-muted)]",
        ghost:
          "text-[var(--color-fg)] hover:bg-[var(--color-muted)]",
        danger:
          "bg-[var(--color-danger)] text-white hover:brightness-95",
        subtle:
          "bg-[var(--color-muted)] text-[var(--color-fg)] hover:bg-[var(--color-aqua)]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
