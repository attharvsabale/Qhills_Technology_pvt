"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  Briefcase,
  ExternalLink,
  FileText,
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Search,
  ShoppingBag,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
};

const mainNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/orders", label: "Order Management", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/transactions", label: "Transaction", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Bookmark },
];
const productNav: NavItem[] = [
  { href: "/admin/products/new", label: "Add Products", icon: PlusCircle },
];
const adminNav: NavItem[] = [
  { href: "/admin/profile", label: "Admin role", icon: UserCircle },
];

function NavLink({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      <Icon size={16} />
      {!collapsed && item.label}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname?.startsWith(item.href) ?? false;

  const renderSide = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center pt-5 lg:pt-6",
          isCollapsed ? "justify-center px-2" : "justify-between px-5"
        )}
      >
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden lg:grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        <button
          className="grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <X size={16} />
        </button>
      </div>

      <div className={cn("flex-1 overflow-y-auto pb-3 pt-4", isCollapsed ? "px-2" : "px-3")}>
        {!isCollapsed && (
          <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Main menu
          </div>
        )}
        <nav className="flex flex-col gap-1">
          {mainNav.map((n) => (
            <NavLink
              key={n.href}
              item={n}
              active={isActive(n)}
              collapsed={isCollapsed}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        {!isCollapsed ? (
          <div className="mb-2 mt-6 px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Product
          </div>
        ) : (
          <div className="my-3 border-t border-neutral-100" />
        )}
        <nav className="flex flex-col gap-1">
          {productNav.map((n) => (
            <NavLink
              key={n.href}
              item={n}
              active={isActive(n)}
              collapsed={isCollapsed}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        {!isCollapsed ? (
          <div className="mb-2 mt-6 px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Admin
          </div>
        ) : (
          <div className="my-3 border-t border-neutral-100" />
        )}
        <nav className="flex flex-col gap-1">
          {adminNav.map((n) => (
            <NavLink
              key={n.href}
              item={n}
              active={isActive(n)}
              collapsed={isCollapsed}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      </div>

      <div className={cn("border-t border-neutral-100", isCollapsed ? "p-2" : "p-3")}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Image
              src="https://i.pravatar.cc/80?img=12"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
            />
            <button
              className="grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
              title="Log out"
            >
              <LogOut size={14} />
            </button>
            <Link
              href="/"
              title="Your Shop"
              className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            >
              <Briefcase size={14} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-2 py-2">
              <Image
                src="https://i.pravatar.cc/80?img=12"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">Dealport</div>
                <div className="truncate text-xs text-neutral-500">
                  Mark@thedesigner...
                </div>
              </div>
              <button
                className="grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
            <Link
              href="/"
              className="mt-2 flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <span className="flex items-center gap-2">
                <Briefcase size={14} />
                Your Shop
              </span>
              <ExternalLink size={14} className="text-neutral-400" />
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-neutral-200 bg-white transition-[width] duration-200 lg:block",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {renderSide(collapsed)}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-72 bg-white shadow-xl transition-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {renderSide(false)}
        </aside>
      </div>

      <header
        className={cn(
          "sticky top-0 z-30 border-b border-neutral-200 bg-white transition-[padding] duration-200",
          collapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <div className="flex h-16 items-center gap-3 px-4 md:px-8">
          <button
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-neutral-100 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>

          <h1 className="text-lg font-semibold tracking-tight">
            {pathname === "/admin"
              ? "Dashboard"
              : pathname === "/admin/products/new"
              ? "Add Product"
              : pathname === "/admin/products"
              ? "Products"
              : pathname === "/admin/profile"
              ? "Admin role"
              : pathname
                  ?.split("/")
                  .pop()
                  ?.replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()) ?? ""}
          </h1>

          <label className="relative ml-auto hidden w-full max-w-md md:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              placeholder="Search data, users, or reports"
              className="h-10 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-9 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:bg-white"
            />
          </label>

          <button className="relative ml-auto grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 md:ml-0">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-500" />
          </button>
        </div>
      </header>

      <main className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-20" : "lg:pl-64")}>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
