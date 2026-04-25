"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/stores/auth";
import { cn } from "@/lib/utils";

const sidebar: { title: string; items: { id: string; label: string; href?: string }[] }[] = [
  {
    title: "Manage My Account",
    items: [
      { id: "profile", label: "My Profile" },
      { id: "address", label: "Address Book" },
      { id: "payment", label: "My Payment Options" },
    ],
  },
  {
    title: "My Orders",
    items: [
      { id: "returns", label: "My Returns" },
      { id: "cancellations", label: "My Cancellations" },
    ],
  },
  {
    title: "My WishList",
    items: [{ id: "wishlist", label: "", href: "/wishlist" }],
  },
];

export default function AccountPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("profile");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (mounted && !user) router.replace("/login");
  }, [mounted, user, router]);

  useEffect(() => {
    if (user) {
      const [first, ...rest] = user.name.split(" ");
      setFirstName(first ?? "");
      setLastName(rest.join(" "));
      setEmail(user.email);
    }
  }, [user]);

  if (!mounted || !user) return null;

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    // simulate save
  };

  const onCancel = () => {
    const [first, ...rest] = user.name.split(" ");
    setFirstName(first ?? "");
    setLastName(rest.join(" "));
    setEmail(user.email);
    setAddress("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Container className="py-10">
      {/* Top bar: breadcrumb + welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="text-sm text-[var(--color-muted-fg)]">
          <Link href="/" className="hover:text-[var(--color-fg)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-fg)]">My Account</span>
        </nav>
        <p className="text-sm">
          Welcome!{" "}
          <span className="text-[var(--color-primary)]">{user.name}</span>
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside>
          <nav className="space-y-8 text-sm">
            {sidebar.map((group) => (
              <div key={group.title}>
                <h3 className="font-medium text-[var(--color-fg)]">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-2 pl-6 text-[var(--color-muted-fg)]">
                  {group.items.map((it) =>
                    it.href ? (
                      <li key={it.id}>
                        <Link
                          href={it.href}
                          className="hover:text-[var(--color-fg)]"
                        >
                          {it.label || group.title.replace("My ", "")}
                        </Link>
                      </li>
                    ) : (
                      <li key={it.id}>
                        <button
                          onClick={() => setActive(it.id)}
                          className={cn(
                            "transition-colors hover:text-[var(--color-fg)]",
                            active === it.id &&
                              "text-[var(--color-primary)]"
                          )}
                        >
                          {it.label}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main panel */}
        <section className="rounded-[4px] bg-white p-8 shadow-[0_1px_13px_rgba(0,0,0,0.05)] md:p-10">
          {active === "profile" && (
            <form onSubmit={onSave}>
              <h2 className="text-xl font-medium text-[var(--color-primary)]">
                Edit Your Profile
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Field label="First Name">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                  />
                </Field>
                <Field label="Address">
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Kingston, 5236, United State"
                    className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 placeholder:text-[var(--color-muted-fg)]"
                  />
                </Field>
              </div>

              <div className="mt-6">
                <Field label="Password Changes">
                  <div className="space-y-4">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Passwod"
                      className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 placeholder:text-[var(--color-muted-fg)]"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Passwod"
                      className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 placeholder:text-[var(--color-muted-fg)]"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm New Passwod"
                      className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 placeholder:text-[var(--color-muted-fg)]"
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-8 flex items-center justify-end gap-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-base font-medium text-[var(--color-fg)] hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-13 rounded-[4px] bg-[var(--color-primary)] px-12 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {active === "address" && (
            <Placeholder title="Address Book" />
          )}
          {active === "payment" && (
            <Placeholder title="My Payment Options" />
          )}
          {active === "returns" && <Placeholder title="My Returns" />}
          {active === "cancellations" && (
            <Placeholder title="My Cancellations" />
          )}
        </section>
      </div>
    </Container>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-base text-[var(--color-fg)]">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-xl font-medium text-[var(--color-primary)]">
        {title}
      </h2>
      <p className="mt-4 text-sm text-[var(--color-muted-fg)]">
        Nothing here yet.
      </p>
    </div>
  );
}
