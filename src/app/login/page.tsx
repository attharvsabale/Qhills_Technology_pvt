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

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
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
      name: data.email.split("@")[0],
      email: data.email,
      avatar: "https://i.pravatar.cc/120?img=32",
    });
    router.push("/account");
  }

  return (
    <div className="grid min-h-[calc(100vh-120px)] lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-primary)] text-white font-bold">
              N
            </div>
            <span className="text-lg font-semibold">Nova</span>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-fg)]">
            Sign in to continue shopping.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[var(--color-muted-fg)]">
                <input type="checkbox" className="accent-[var(--color-primary)]" />
                Remember me
              </label>
              <Link
                href="#"
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" block size="lg" loading={isSubmitting}>
              Sign in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-[var(--color-muted-fg)]">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            OR
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <div className="grid gap-2">
            <Button variant="outline" block>
              Continue with Google
            </Button>
            <Button variant="outline" block>
              Continue with Apple
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--color-muted-fg)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-[var(--color-fg)] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=70"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-3xl font-semibold">Designed for everyday life.</h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Discover curated products across electronics, gaming, accessories
            and more.
          </p>
        </div>
      </div>
    </div>
  );
}
