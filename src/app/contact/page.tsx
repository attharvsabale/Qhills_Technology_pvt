"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";

const schema = z.object({
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone"),
  message: z.string().min(10, "Tell us a bit more"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <Container className="py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-muted-fg)]">
        <Link href="/" className="hover:text-[var(--color-fg)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-fg)]">Contact</span>
      </nav>

      <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Contact info card */}
        <aside className="rounded-[4px] bg-white p-8 shadow-[0_1px_13px_rgba(0,0,0,0.05)]">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-white">
                <Phone size={18} />
              </span>
              <h3 className="text-base font-medium">Call To Us</h3>
            </div>
            <p className="mt-6 text-sm text-[var(--color-fg)]">
              We are available 24/7, 7 days a week.
            </p>
            <p className="mt-4 text-sm text-[var(--color-fg)]">
              Phone: +8801611112222
            </p>
          </div>

          <div className="my-8 h-px bg-[var(--color-border)]" />

          <div>
            <div className="flex items-center gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-white">
                <Mail size={18} />
              </span>
              <h3 className="text-base font-medium">Write To US</h3>
            </div>
            <p className="mt-6 text-sm text-[var(--color-fg)]">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="mt-4 text-sm text-[var(--color-fg)]">
              Emails: customer@exclusive.com
            </p>
            <p className="mt-3 text-sm text-[var(--color-fg)]">
              Emails: support@exclusive.com
            </p>
          </div>
        </aside>

        {/* Form card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[4px] bg-white p-8 shadow-[0_1px_13px_rgba(0,0,0,0.05)]"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <input
                {...register("name")}
                placeholder="Your Name *"
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="Your Email *"
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("phone")}
                placeholder="Your Phone *"
                className="h-12 w-full rounded-[4px] bg-[var(--color-muted)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <textarea
              {...register("message")}
              placeholder="Your Massage"
              rows={8}
              className="w-full resize-none rounded-[4px] bg-[var(--color-muted)] p-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            {sent && (
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)]">
                <Check size={14} /> Message sent!
              </span>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-13 rounded-[4px] bg-[var(--color-primary)] px-12 py-4 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Massage"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
