"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  CircleUser,
  Package,
  CircleX,
  Star,
  LogOut,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { useAuth } from "@/stores/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function ProfileMenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!openProfile) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setOpenProfile(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenProfile(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openProfile]);

  const count = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.items.length);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setOpenMenu(false);
  };

  return (
    <>
      <div className="bg-neutral-900 text-white">
        <Container className="flex items-center justify-between py-2 text-xs">
          <span>Free shipping on orders over $100</span>
          <div className="hidden gap-5 sm:flex">
            <Link href="/account" className="hover:text-[var(--color-accent)]">
              Track order
            </Link>
            <Link href="/contact" className="hover:text-[var(--color-accent)]">
              Help
            </Link>
            <Link href="/admin" className="hover:text-[var(--color-accent)]">
              Admin
            </Link>
          </div>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
        <Container className="flex h-16 items-center gap-4">
          <button
            className="-ml-2 grid h-10 w-10 place-items-center rounded-md hover:bg-[var(--color-muted)] lg:hidden"
            onClick={() => setOpenMenu(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-primary)] text-white font-bold">
              N
            </div>
            <span className="text-lg font-semibold tracking-tight">Nova</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm font-medium text-neutral-700 transition-colors hover:text-[var(--color-fg)]",
                  pathname === n.href && "text-[var(--color-fg)]"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <form
            onSubmit={onSearch}
            className="ml-auto hidden max-w-md flex-1 md:flex"
          >
            <label className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="h-10 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] pl-9 pr-4 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:bg-white"
              />
            </label>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Link
              href="/wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--color-muted)]"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {mounted && wishCount > 0 && (
                <Badge
                  variant="accent"
                  className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center px-1 text-[10px]"
                >
                  {wishCount}
                </Badge>
              )}
            </Link>

            <button
              onClick={() => setOpenCart(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--color-muted)]"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {mounted && count > 0 && (
                <Badge
                  variant="accent"
                  className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center px-1 text-[10px]"
                >
                  {count}
                </Badge>
              )}
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile((v) => !v)}
                aria-label="Account"
                aria-expanded={openProfile}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full transition-colors",
                  openProfile
                    ? "bg-[var(--color-primary)] text-white"
                    : "hover:bg-[var(--color-muted)]"
                )}
              >
                <User size={18} />
              </button>
              {openProfile && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-lg border border-white/20 p-2 text-white backdrop-blur-[40px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(130% 110% at 0% 100%, #9B5BAE 0%, #6B4470 22%, #5A5560 45%, #8C8A92 70%, #B4B2B8 100%)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  }}
                >
                  {user ? (
                    <>
                      <ProfileMenuItem
                        href="/account"
                        icon={<CircleUser size={18} />}
                        label="Manage My Account"
                        onClick={() => setOpenProfile(false)}
                      />
                      <ProfileMenuItem
                        href="/account?tab=orders"
                        icon={<Package size={18} />}
                        label="My Order"
                        onClick={() => setOpenProfile(false)}
                      />
                      <ProfileMenuItem
                        href="/account?tab=cancellations"
                        icon={<CircleX size={18} />}
                        label="My Cancellations"
                        onClick={() => setOpenProfile(false)}
                      />
                      <ProfileMenuItem
                        href="/account?tab=reviews"
                        icon={<Star size={18} />}
                        label="My Reviews"
                        onClick={() => setOpenProfile(false)}
                      />
                      <button
                        role="menuitem"
                        onClick={() => {
                          logout();
                          setOpenProfile(false);
                          router.push("/");
                        }}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <ProfileMenuItem
                        href="/login"
                        icon={<CircleUser size={18} />}
                        label="Login"
                        onClick={() => setOpenProfile(false)}
                      />
                      <ProfileMenuItem
                        href="/signup"
                        icon={<Star size={18} />}
                        label="Create Account"
                        onClick={() => setOpenProfile(false)}
                      />
                      <ProfileMenuItem
                        href="/wishlist"
                        icon={<Package size={18} />}
                        label="My Wishlist"
                        onClick={() => setOpenProfile(false)}
                      />
                      <ProfileMenuItem
                        href="/contact"
                        icon={<CircleX size={18} />}
                        label="Help & Contact"
                        onClick={() => setOpenProfile(false)}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          openMenu ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity",
            openMenu ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpenMenu(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[85%] max-w-xs bg-white p-5 shadow-xl transition-transform",
            openMenu ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpenMenu(false)}
              className="flex items-center gap-2"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-primary)] text-white font-bold">
                N
              </div>
              <span className="text-lg font-semibold">Nova</span>
            </Link>
            <button
              className="grid h-9 w-9 place-items-center rounded-md hover:bg-[var(--color-muted)]"
              onClick={() => setOpenMenu(false)}
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={onSearch} className="mb-4">
            <label className="relative block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="h-10 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] pl-9 pr-4 text-sm outline-none"
              />
            </label>
          </form>
          <nav className="flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpenMenu(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]",
                  pathname === n.href && "bg-[var(--color-muted)]"
                )}
              >
                {n.label}
              </Link>
            ))}
            <div className="my-3 h-px bg-[var(--color-border)]" />
            <Link
              href="/account"
              onClick={() => setOpenMenu(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              Account
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setOpenMenu(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              Wishlist
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpenMenu(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              Admin dashboard
            </Link>
          </nav>
        </aside>
      </div>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}
