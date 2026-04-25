import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-fg)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted-fg)] transition-colors hover:border-neutral-300 focus:border-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40",
            error && "border-[var(--color-danger)] focus:border-[var(--color-danger)]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-[var(--color-muted-fg)]">{hint}</span>
        )}
        {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
