import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Truck,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { FlashCountdown } from "@/components/home/flash-countdown";
import { CategoryPills } from "@/components/home/category-pills";
import { getFeaturedProducts, getNewArrivals } from "@/services/products";

const sidebarCats = [
  "Woman's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Lifestyle",
  "Medicine",
  "Sports & Outdoor",
  "Baby's & Toys",
  "Groceries & Pets",
  "Health & Beauty",
];

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="block h-8 w-4 rounded-sm bg-[var(--color-primary)]" />
      <span className="text-sm font-semibold text-[var(--color-primary)]">
        {label}
      </span>
    </div>
  );
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(4),
  ]);

  const flashSale = featured.slice(0, 4);
  const bestSelling = featured.slice(4, 8);
  const explore = Array.from(
    new Map(
      [...newArrivals, ...featured].map((p) => [p.id, p])
    ).values()
  ).slice(0, 8);

  return (
    <div>
      {/* Hero: sidebar + banner */}
      <section className="border-b border-[var(--color-border)]">
        <Container className="grid gap-10 py-6 lg:grid-cols-[14rem_1fr]">
          <aside className="hidden border-r border-[var(--color-border)] pr-4 lg:block">
            <ul className="flex flex-col">
              {sidebarCats.map((c) => (
                <li key={c}>
                  <Link
                    href={`/shop?q=${encodeURIComponent(c)}`}
                    className="flex items-center justify-between py-2 text-sm text-[var(--color-fg)] hover:text-[var(--color-primary)]"
                  >
                    {c}
                    {(c === "Woman's Fashion" || c === "Men's Fashion") && (
                      <ChevronRight size={14} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="relative overflow-hidden rounded-[var(--radius-md)] bg-black">
            <div className="relative grid items-center gap-6 px-8 py-10 md:grid-cols-2 md:px-12 md:py-14">
              <div className="text-white">
                <div className="mb-4 flex items-center gap-3 text-sm">
                  <Image
                    src="/1200px-Apple_gray_logo 1.png"
                    alt="Apple"
                    width={40}
                    height={49}
                    className="h-10 w-auto"
                  />
                  <span>iPhone 14 Series</span>
                </div>
                <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                  Up to 10%
                  <br />
                  off Voucher
                </h1>
                <Link
                  href="/shop?category=smartphones"
                  className="mt-6 inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-medium transition-all hover:gap-3"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
              </div>
              <div className="relative aspect-[4/3] w-full md:scale-110 lg:scale-125">
                <Image
                  src="/hero_endframe__cvklg0xk3w6e_large 2.png"
                  alt="iPhone 14"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full border-2 border-white ${
                    i === 2
                      ? "bg-[var(--color-primary)] ring-2 ring-white"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Flash Sales */}
      <section className="py-16">
        <Container>
          <SectionEyebrow label="Today's" />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-wrap items-end gap-10 md:gap-16">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Flash Sales
              </h2>
              <FlashCountdown />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {flashSale.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <div className="border-t border-[var(--color-border)]" />

      {/* Browse By Category */}
      <section className="py-16">
        <Container>
          <SectionEyebrow label="Categories" />
          <div className="mt-5 flex items-end justify-between">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Browse By Category
            </h2>
          </div>
          <div className="mt-10">
            <CategoryPills />
          </div>
        </Container>
      </section>

      <div className="border-t border-[var(--color-border)]" />

      {/* Best Selling */}
      <section className="py-16">
        <Container>
          <SectionEyebrow label="This Month" />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Best Selling Products
            </h2>
            <Link href="/shop?sort=popular">
              <Button variant="primary">View All</Button>
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {bestSelling.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Music Experience banner */}
      <section className="py-8">
        <Container>
          <div className="relative overflow-hidden rounded-[var(--radius-md)] bg-black px-8 py-12 md:px-16 md:py-20">
            <div className="relative grid items-center gap-10 md:grid-cols-2">
              <div className="text-white">
                <div className="mb-4 text-sm font-semibold text-[var(--color-primary)]">
                  Categories
                </div>
                <h3 className="text-3xl font-semibold leading-tight md:text-5xl">
                  Enhance Your
                  <br />
                  Music Experience
                </h3>
                <div className="mt-6 flex gap-3">
                  {[
                    { l: "Hours", v: "23" },
                    { l: "Days", v: "05" },
                    { l: "Minutes", v: "59" },
                    { l: "Seconds", v: "35" },
                  ].map((x) => (
                    <div
                      key={x.l}
                      className="grid h-16 w-16 place-items-center rounded-full bg-white text-center"
                    >
                      <div>
                        <div className="text-sm font-semibold text-[var(--color-fg)]">
                          {x.v}
                        </div>
                        <div className="text-[10px] text-[var(--color-fg)]">
                          {x.l}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/shop?category=headphones">
                    <Button variant="primary" size="lg">
                      Buy Now!
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative aspect-[4/3] w-full md:scale-110">
                {/* Radial fade glow behind speaker */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(200,200,200,0.55) 0%, rgba(140,140,140,0.35) 25%, rgba(70,70,70,0.18) 50%, rgba(0,0,0,0) 75%)",
                    filter: "blur(30px)",
                  }}
                />
                <Image
                  src="/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png"
                  alt="JBL Boombox"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="relative object-contain"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Explore Our Products */}
      <section className="py-16">
        <Container>
          <SectionEyebrow label="Our Products" />
          <div className="mt-5 flex items-end justify-between">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Explore Our Products
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {explore.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* New Arrival mosaic */}
      <section className="py-16">
        <Container>
          <SectionEyebrow label="Featured" />
          <div className="mt-5 flex items-end justify-between">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              New Arrival
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Big tile */}
            <Link
              href="/shop?category=gaming"
              className="relative block aspect-square overflow-hidden rounded-[var(--radius-md)] bg-black md:aspect-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1000&q=75"
                alt="PlayStation 5"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-90"
              />
              <div className="absolute bottom-6 left-6 max-w-xs text-white">
                <div className="text-xl font-semibold">PlayStation 5</div>
                <p className="mt-2 text-sm text-white/80">
                  Black and White version of the PS5 coming out on sale.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 border-b border-white pb-0.5 text-sm font-medium">
                  Shop Now
                </span>
              </div>
            </Link>

            <div className="grid gap-6">
              <Link
                href="/shop?category=accessories"
                className="relative block aspect-[2/1] overflow-hidden rounded-[var(--radius-md)] bg-neutral-800"
              >
                <Image
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&q=75"
                  alt="Women's Collections"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
                <div className="absolute bottom-6 left-6 max-w-xs text-white">
                  <div className="text-xl font-semibold">
                    Women&apos;s Collections
                  </div>
                  <p className="mt-2 text-sm text-white/80">
                    Featured woman collections that give you another vibe.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 border-b border-white pb-0.5 text-sm font-medium">
                    Shop Now
                  </span>
                </div>
              </Link>

              <div className="grid gap-6 sm:grid-cols-2">
                <Link
                  href="/shop?category=headphones"
                  className="relative block aspect-square overflow-hidden rounded-[var(--radius-md)] bg-black"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=75"
                    alt="Speakers"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover opacity-90"
                  />
                  <div className="absolute bottom-5 left-5 max-w-[12rem] text-white">
                    <div className="text-lg font-semibold">Speakers</div>
                    <p className="mt-1 text-xs text-white/80">
                      Amazon wireless speakers
                    </p>
                    <span className="mt-2 inline-flex items-center border-b border-white pb-0.5 text-xs font-medium">
                      Shop Now
                    </span>
                  </div>
                </Link>
                <Link
                  href="/shop?q=perfume"
                  className="relative block aspect-square overflow-hidden rounded-[var(--radius-md)] bg-black"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=75"
                    alt="Perfume"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover opacity-90"
                  />
                  <div className="absolute bottom-5 left-5 max-w-[12rem] text-white">
                    <div className="text-lg font-semibold">Perfume</div>
                    <p className="mt-1 text-xs text-white/80">
                      GUCCI INTENSE OUD EDP
                    </p>
                    <span className="mt-2 inline-flex items-center border-b border-white pb-0.5 text-xs font-medium">
                      Shop Now
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services strip */}
      <section className="pb-20">
        <Container>
          <div className="grid gap-10 text-center md:grid-cols-3">
            {[
              {
                icon: <Truck size={28} />,
                title: "FREE AND FAST DELIVERY",
                desc: "Free delivery for all orders over $140",
              },
              {
                icon: <Headphones size={28} />,
                title: "24/7 CUSTOMER SERVICE",
                desc: "Friendly 24/7 customer support",
              },
              {
                icon: <ShieldCheck size={28} />,
                title: "MONEY BACK GUARANTEE",
                desc: "We return money within 30 days",
              },
            ].map((s) => (
              <div key={s.title} className="flex flex-col items-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-neutral-300/60 p-3">
                  <div className="grid h-full w-full place-items-center rounded-full bg-[var(--color-secondary)] text-white">
                    {s.icon}
                  </div>
                </div>
                <div className="mt-5 text-base font-semibold tracking-wide">
                  {s.title}
                </div>
                <div className="mt-1 text-sm text-[var(--color-muted-fg)]">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
