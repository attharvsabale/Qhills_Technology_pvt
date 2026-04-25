"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart";
import { formatCurrency, cn } from "@/lib/utils";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  companyName: z.string().optional(),
  streetAddress: z.string().min(3, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "Town/City is required"),
  phone: z.string().min(6, "Valid phone is required"),
  email: z.string().email("Valid email is required"),
  saveInfo: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

function generateOrderId() {
  return `ORD-${(Date.now() % 90000) + 10000}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);

  const [payment, setPayment] = useState<"bank" | "cod">("cod");
  const [coupon, setCoupon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shipping = 0;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { saveInfo: true },
  });

  async function onSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setOrderId(generateOrderId());
    clear();
    setSubmitting(false);
  }

  if (orderId) {
    return (
      <Container className="py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-aqua)] text-[var(--color-primary)]">
            <Check size={28} />
          </div>
          <h1 className="text-2xl font-semibold">Thank you for your order!</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Your order <b>{orderId}</b> has been placed.
          </p>
          <div className="flex gap-3">
            <Link href="/shop">
              <Button variant="outline">Continue shopping</Button>
            </Link>
            <Link href="/account">
              <Button>View orders</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  return (
    <Container className="py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-muted-fg)]">
        <Link href="/account" className="hover:text-[var(--color-fg)]">
          Account
        </Link>
        <span className="mx-2">/</span>
        <Link href="/account" className="hover:text-[var(--color-fg)]">
          My Account
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-[var(--color-fg)]">
          Product
        </Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-[var(--color-fg)]">
          View Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-fg)]">CheckOut</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        {/* Billing Details */}
        <form onSubmit={handleSubmit(onSubmit)} id="checkout-form">
          <h1 className="text-3xl font-medium tracking-tight">
            Billing Details
          </h1>

          <div className="mt-10 space-y-7">
            <FieldRow
              label="First Name"
              required
              error={errors.firstName?.message}
            >
              <input
                {...register("firstName")}
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </FieldRow>

            <FieldRow label="Company Name" error={errors.companyName?.message}>
              <input
                {...register("companyName")}
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </FieldRow>

            <FieldRow
              label="Street Address"
              required
              error={errors.streetAddress?.message}
            >
              <input
                {...register("streetAddress")}
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </FieldRow>

            <FieldRow
              label="Apartment, floor, etc. (optional)"
              error={errors.apartment?.message}
            >
              <input
                {...register("apartment")}
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </FieldRow>

            <FieldRow label="Town/City" required error={errors.city?.message}>
              <input
                {...register("city")}
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </FieldRow>

            <FieldRow
              label="Phone Number"
              required
              error={errors.phone?.message}
            >
              <input
                {...register("phone")}
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </FieldRow>

            <FieldRow
              label="Email Address"
              required
              error={errors.email?.message}
            >
              <input
                type="email"
                {...register("email")}
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </FieldRow>

            <label className="mt-2 flex items-center gap-4 text-base">
              <input
                type="checkbox"
                {...register("saveInfo")}
                className="peer sr-only"
              />
              <span className="grid h-6 w-6 place-items-center rounded-[4px] bg-[var(--color-primary)] text-white peer-checked:bg-[var(--color-primary)] peer-[:not(:checked)]:bg-[var(--color-muted)] peer-[:not(:checked)]:text-transparent">
                <Check size={16} strokeWidth={3} />
              </span>
              <span>Save this information for faster check-out next time</span>
            </label>
          </div>
        </form>

        {/* Order Summary */}
        <aside className="lg:pl-12">
          <div className="space-y-8">
            {items.map((i) => (
              <div
                key={`${i.productId}-${i.color}-${i.size}`}
                className="flex items-center gap-5"
              >
                <div className="relative h-14 w-14 shrink-0">
                  <Image
                    src={i.image}
                    alt={i.title}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <span className="flex-1 text-base">{i.title}</span>
                <span className="text-base">
                  {formatCurrency(i.price * i.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <span className="text-base">Subtotal:</span>
              <span className="text-base">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <span className="text-base">Shipping:</span>
              <span className="text-base">
                {shipping === 0 ? "Free" : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base">Total:</span>
              <span className="text-base">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-8 space-y-4">
            <PaymentRow
              label="Bank"
              checked={payment === "bank"}
              onChange={() => setPayment("bank")}
              right={
                <div className="flex items-center gap-2">
                  <PaymentLogo label="bKash" bg="#E2136E" />
                  <PaymentLogo label="VISA" bg="#1A1F71" />
                  <PaymentLogo label="MC" bg="#EB001B" />
                  <PaymentLogo label="Nagad" bg="#F36F21" />
                </div>
              }
            />
            <PaymentRow
              label="Cash on delivery"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
            />
          </div>

          {/* Coupon */}
          <div className="mt-8 flex flex-wrap gap-4">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon Code"
              className="h-14 flex-1 min-w-[180px] rounded-[4px] border border-[var(--color-fg)] px-6 text-base outline-none placeholder:text-[var(--color-muted-fg)]"
            />
            <button
              type="button"
              className="h-14 rounded-[4px] bg-[var(--color-primary)] px-10 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Apply Coupon
            </button>
          </div>

          {/* Place Order */}
          <div className="mt-8">
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className={cn(
                "h-14 rounded-[4px] bg-[var(--color-primary)] px-12 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              )}
            >
              {submitting ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function FieldRow({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-[var(--color-muted-fg)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-danger)]">*</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  );
}

function PaymentRow({
  label,
  checked,
  onChange,
  right,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  right?: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="flex items-center gap-4">
        <span
          onClick={onChange}
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full border-2",
            checked
              ? "border-[var(--color-fg)]"
              : "border-[var(--color-muted-fg)]"
          )}
        >
          {checked && (
            <span className="h-3 w-3 rounded-full bg-[var(--color-fg)]" />
          )}
        </span>
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <span className="text-base">{label}</span>
      </span>
      {right}
    </label>
  );
}

function PaymentLogo({ label, bg }: { label: string; bg: string }) {
  return (
    <span
      className="grid h-6 min-w-[40px] place-items-center rounded-[2px] px-2 text-[10px] font-bold text-white"
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
