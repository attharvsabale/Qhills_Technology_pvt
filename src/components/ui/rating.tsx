import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  size = 14,
  className,
  showValue = false,
}: {
  value: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && hasHalf);
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled ? "fill-amber-400 text-amber-400" : "text-neutral-300"
            )}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-xs text-[var(--color-muted-fg)]">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
