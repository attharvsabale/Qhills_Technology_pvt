"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function Cell({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-[10px] font-medium text-[var(--color-fg)]">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums tracking-tight md:text-3xl">
        {pad(value)}
      </div>
    </div>
  );
}

function Sep() {
  return (
    <div className="self-end pb-1 text-2xl font-bold text-[var(--color-danger)] md:text-3xl">
      :
    </div>
  );
}

interface Props {
  /** ms from now until the sale ends. Default: 4 days. */
  durationMs?: number;
  className?: string;
}

export function FlashCountdown({
  durationMs = 4 * 24 * 60 * 60 * 1000,
  className,
}: Props) {
  const [remaining, setRemaining] = useState<number>(durationMs);

  useEffect(() => {
    const end = Date.now() + durationMs;
    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [durationMs]);

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const mins = Math.floor((remaining % 3_600_000) / 60_000);
  const secs = Math.floor((remaining % 60_000) / 1000);

  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className ?? ""}`}>
      <Cell label="Days" value={days} />
      <Sep />
      <Cell label="Hours" value={hours} />
      <Sep />
      <Cell label="Minutes" value={mins} />
      <Sep />
      <Cell label="Seconds" value={secs} />
    </div>
  );
}

