import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <div className="text-[120px] font-semibold leading-none tracking-tight md:text-[160px]">
          <span className="bg-gradient-to-br from-neutral-900 to-[var(--color-accent)] bg-clip-text text-transparent">
            404
          </span>
        </div>
        <h1 className="text-2xl font-semibold md:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="max-w-md text-sm text-[var(--color-muted-fg)]">
          The link may be broken, or the page may have been moved. Let&apos;s get you
          back to something useful.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">Continue shopping</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
