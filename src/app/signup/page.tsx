"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/auth";

const schema = z
  .object({
    name: z.string().min(2, "Your name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirm: z.string(),
    terms: z.literal(true, { error: "You must accept the terms" }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    await new Promise((r) => setTimeout(r, 800));
    login({
      id: "u1",
      name: data.name,
      email: data.email,
      avatar: "https://i.pravatar.cc/120?img=32",
    });
    router.push("/account");
  }

  return (
    <div className="grid min-h-[calc(100vh-120px)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=70"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-3xl font-semibold">Join the Nova community.</h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Create an account to track orders, save favorites, and unlock
            members-only deals.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-primary)] text-white font-bold">
              N
            </div>
            <span className="text-lg font-semibold">Nova</span>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted-fg)]">
            Takes less than a minute.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Input
              label="Full name"
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Password"
                type="password"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm password"
                type="password"
                error={errors.confirm?.message}
                {...register("confirm")}
              />
            </div>
            <label className="flex items-start gap-2 text-xs text-[var(--color-muted-fg)]">
              <input
                type="checkbox"
                className="mt-0.5 accent-[var(--color-primary)]"
                {...register("terms")}
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.terms && (
              <span className="text-xs text-[var(--color-danger)]">
                {errors.terms.message}
              </span>
            )}

            <Button type="submit" block size="lg" loading={isSubmitting}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-muted-fg)]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--color-fg)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
