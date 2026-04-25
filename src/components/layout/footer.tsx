"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Copyright } from "lucide-react";
import { Container } from "@/components/ui/container";

interface FooterLink {
  label: string;
  href: string;
}
interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Login / Register", href: "/login" },
      { label: "Cart", href: "/cart" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    title: "Quick Link",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms Of Use", href: "/terms" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const support = {
  address: "111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.",
  email: "exclusive@gmail.com",
  phone: "+88015-88888-9999",
};

type SocialKey = "facebook" | "twitter" | "instagram" | "linkedin";

const socialPaths: Record<SocialKey, string> = {
  facebook:
    "M22 12a10 10 0 1 0-11.6 9.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z",
  twitter:
    "M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1A4.1 4.1 0 0 0 12 9.1c0 .3 0 .6.1.9A11.6 11.6 0 0 1 3.4 5a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.7 3.3 4.1-.4.1-.7.1-1.1.1l-.8-.1c.5 1.7 2.1 2.9 4 2.9A8.2 8.2 0 0 1 2 19c1.8 1.2 4 1.9 6.3 1.9 7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2Z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 2c-3.1 0-3.5 0-4.7.1-.9.1-1.4.2-1.7.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.2.8-.3 1.7-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1.9.2 1.4.3 1.7.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.8.2 1.7.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c.9-.1 1.4-.2 1.7-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.2-.8.3-1.7.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-.9-.2-1.4-.3-1.7-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.1-.8-.2-1.7-.3-1.2-.1-1.6-.1-4.7-.1Zm0 3.4a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Zm0 7.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Zm5.6-7.4a1 1 0 1 1-2.1 0 1 1 0 0 1 2.1 0Z",
  linkedin:
    "M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9Zm-1.5-10.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3v-9h2.9v1.2h.1c.4-.7 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V19Z",
};

const socials: { label: string; key: SocialKey; href: string }[] = [
  { label: "Facebook", key: "facebook", href: "#" },
  { label: "Twitter", key: "twitter", href: "#" },
  { label: "Instagram", key: "instagram", href: "#" },
  { label: "LinkedIn", key: "linkedin", href: "#" },
];

function SocialIcon({ name }: { name: SocialKey }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={socialPaths[name]} />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 bg-[var(--color-primary)] text-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Subscribe */}
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Exclusive
            </Link>
            <h4 className="mt-5 text-base font-medium">Subscribe</h4>
            <p className="mt-3 text-sm text-white/85">
              Get 10% off your first order
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex h-12 items-center rounded-[var(--radius-sm)] border border-white px-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="h-full flex-1 bg-transparent text-sm text-white placeholder:text-white/70 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-8 w-8 place-items-center rounded-sm text-white transition-colors hover:bg-white/10"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-medium">Support</h4>
            <ul className="mt-5 space-y-4 text-sm text-white/90">
              <li>{support.address}</li>
              <li>
                <a
                  href={`mailto:${support.email}`}
                  className="hover:text-white"
                >
                  {support.email}
                </a>
              </li>
              <li>
                <a href={`tel:${support.phone}`} className="hover:text-white">
                  {support.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Dynamic link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-base font-medium">{col.title}</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/90">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download App */}
          <div>
            <h4 className="text-base font-medium">Download App</h4>
            <p className="mt-5 text-xs text-white/80">
              Save $3 with App New User Only
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="grid h-20 w-20 place-items-center rounded-sm bg-white text-[10px] font-medium text-[var(--color-fg)]">
                QR
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  aria-label="Get it on Google Play"
                  className="block h-9 w-28 rounded-sm border border-white/40 bg-black/40 text-center text-[10px] leading-9 hover:bg-black/60"
                >
                  Google Play
                </a>
                <a
                  href="#"
                  aria-label="Download on the App Store"
                  className="block h-9 w-28 rounded-sm border border-white/40 bg-black/40 text-center text-[10px] leading-9 hover:bg-black/60"
                >
                  App Store
                </a>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-white/90 transition-colors hover:text-white"
                >
                  <SocialIcon name={s.key} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 border-t border-white/20 pt-6 text-xs text-white/70">
          <Copyright size={14} />
          <span>
            Copyright Rimel {new Date().getFullYear()}. All right reserved
          </span>
        </div>
      </Container>
    </footer>
  );
}

