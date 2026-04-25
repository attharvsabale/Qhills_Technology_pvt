"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onClose,
  side = "right",
  title,
  children,
  widthClassName = "w-full sm:max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left";
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 transition-opacity",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute top-0 h-full bg-white shadow-[var(--shadow-pop)] transition-transform",
          widthClassName,
          side === "right" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : side === "right"
            ? "translate-x-full"
            : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-[var(--color-muted)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-[calc(100%-57px)] overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}
