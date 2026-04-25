import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("container-px mx-auto w-full max-w-[1400px]", className)}
      {...props}
    />
  );
}
