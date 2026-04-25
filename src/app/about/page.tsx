import Image from "next/image";
import Link from "next/link";
import {
  Store,
  CircleDollarSign,
  ShoppingBag,
  Wallet,
  Truck,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";

const stats = [
  {
    value: "10.5k",
    label: "Sallers active our site",
    icon: Store,
    highlight: false,
  },
  {
    value: "33k",
    label: "Monthly Produduct Sale",
    icon: CircleDollarSign,
    highlight: true,
  },
  {
    value: "45.5k",
    label: "Customer active in our site",
    icon: ShoppingBag,
    highlight: false,
  },
  {
    value: "25k",
    label: "Anual gross sale in our site",
    icon: Wallet,
    highlight: false,
  },
];

const team = [
  {
    name: "Tom Cruise",
    role: "Founder & Chairman",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70",
  },
  {
    name: "Emma Watson",
    role: "Managing Director",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=70",
  },
  {
    name: "Will Smith",
    role: "Product Designer",
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&q=70",
  },
];

const services = [
  {
    icon: Truck,
    title: "FREE AND FAST DELIVERY",
    text: "Free delivery for all orders over $140",
  },
  {
    icon: Headphones,
    title: "24/7 CUSTOMER SERVICE",
    text: "Friendly 24/7 customer support",
  },
  {
    icon: ShieldCheck,
    title: "MONEY BACK GUARANTEE",
    text: "We reurn money within 30 days",
  },
];

const socialIcons: Record<string, string> = {
  twitter:
    "M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1A4.1 4.1 0 0 0 12 9.1c0 .3 0 .6.1.9A11.6 11.6 0 0 1 3.4 5a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.7 3.3 4.1-.4.1-.7.1-1.1.1l-.8-.1c.5 1.7 2.1 2.9 4 2.9A8.2 8.2 0 0 1 2 19c1.8 1.2 4 1.9 6.3 1.9 7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2Z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 2c-3.1 0-3.5 0-4.7.1-.9.1-1.4.2-1.7.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.2.8-.3 1.7-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1.9.2 1.4.3 1.7.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.8.2 1.7.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c.9-.1 1.4-.2 1.7-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.2-.8.3-1.7.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-.9-.2-1.4-.3-1.7-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.1-.8-.2-1.7-.3-1.2-.1-1.6-.1-4.7-.1Zm0 3.4a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Zm0 7.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Zm5.6-7.4a1 1 0 1 1-2.1 0 1 1 0 0 1 2.1 0Z",
  linkedin:
    "M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9Zm-1.5-10.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3v-9h2.9v1.2h.1c.4-.7 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V19Z",
};

function Social({ name }: { name: keyof typeof socialIcons }) {
  return (
    <a
      href="#"
      aria-label={name}
      className="text-[var(--color-fg)] transition-colors hover:text-[var(--color-primary)]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d={socialIcons[name]} />
      </svg>
    </a>
  );
}

export default function AboutPage() {
  return (
    <Container className="py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-muted-fg)]">
        <Link href="/" className="hover:text-[var(--color-fg)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-fg)]">About</span>
      </nav>

      {/* Our Story */}
      <section className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Our Story
          </h1>
          <p className="mt-8 text-base leading-relaxed text-[var(--color-fg)]">
            Launced in 2015, Exclusive is South Asia&apos;s premier online
            shopping marketplace with an active presense in Bangladesh.
            Supported by wide range of tailored marketing, data and service
            solutions, Exclusive has 10,500 sallers and 300 brands and serves 3
            milloons customers across the region.
          </p>
          <p className="mt-6 text-base leading-relaxed text-[var(--color-fg)]">
            Exclusive has more than 1 Million products to offer, growing at a
            very fast. Exclusive offers a diverse assotment in categories
            ranging from consumer.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=70"
            alt="Two women shopping with shopping bags"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`group flex flex-col items-center rounded-[4px] border px-6 py-8 transition-colors ${
                s.highlight
                  ? "border-transparent bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-fg)] hover:border-transparent hover:bg-[var(--color-primary)] hover:text-white"
              }`}
            >
              <div
                className={`grid h-20 w-20 place-items-center rounded-full p-2 ${
                  s.highlight ? "bg-white/20" : "bg-[var(--color-muted)]"
                }`}
              >
                <div
                  className={`grid h-full w-full place-items-center rounded-full ${
                    s.highlight
                      ? "bg-white text-[var(--color-fg)]"
                      : "bg-[var(--color-fg)] text-white"
                  }`}
                >
                  <Icon size={28} />
                </div>
              </div>
              <div className="mt-6 text-3xl font-bold tracking-tight">
                {s.value}
              </div>
              <div className="mt-2 text-sm">{s.label}</div>
            </div>
          );
        })}
      </section>

      {/* Team */}
      <section className="mt-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <article key={m.name} className="flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[var(--color-muted)]">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top"
                />
              </div>
              <h3 className="mt-6 text-2xl font-medium">{m.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-fg)]">{m.role}</p>
              <div className="mt-4 flex items-center gap-4">
                <Social name="twitter" />
                <Social name="instagram" />
                <Social name="linkedin" />
              </div>
            </article>
          ))}
        </div>

        {/* Carousel dots */}
        <div className="mt-12 flex items-center justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                i === 2
                  ? "w-3 bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                  : "w-2.5 bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mt-24 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="flex flex-col items-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-muted)] p-2">
                <div className="grid h-full w-full place-items-center rounded-full bg-[var(--color-fg)] text-white">
                  <Icon size={26} />
                </div>
              </div>
              <h4 className="mt-5 text-base font-bold tracking-wider">
                {s.title}
              </h4>
              <p className="mt-2 text-sm text-[var(--color-fg)]">{s.text}</p>
            </div>
          );
        })}
      </section>
    </Container>
  );
}
