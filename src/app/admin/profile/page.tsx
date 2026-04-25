"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  HelpCircle,
  Link2,
  Pencil,
  Plus,
  Share2,
  Sparkles,
} from "lucide-react";

const defaultAvatar = "https://i.pravatar.cc/160?img=12";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-neutral-200 bg-white p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
      {children}
    </label>
  );
}

function Field({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-11 w-full items-center rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 focus-within:border-emerald-500 ${className}`}
    >
      {children}
    </div>
  );
}

function PasswordField({
  placeholder = "Enter password",
  defaultValue = "",
}: {
  placeholder?: string;
  defaultValue?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field>
      <input
        type={show ? "text" : "password"}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="ml-2 grid h-7 w-7 place-items-center rounded text-neutral-400 hover:bg-neutral-100"
      >
        {show ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
    </Field>
  );
}

function GoogleLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function FacebookLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.5 12.5h2l.3-2.4h-2.3V8.6c0-.7.2-1.2 1.2-1.2h1.3v-2.2c-.2 0-1-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.1v1.7H9v2.4h2.1V19h2.4v-6.5z"
      />
    </svg>
  );
}

function XLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#000"
        d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.8l-5.32-6.96L4.2 22H.94l8.02-9.16L.5 2h6.98l4.81 6.36L18.244 2zm-2.38 18h1.88L7.22 4H5.2l10.664 16z"
      />
    </svg>
  );
}

function SocialLinked({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {icon}
      <span className="inline-flex items-center gap-1 text-xs text-sky-500">
        <Link2 size={11} className="-rotate-45" />
        Linked
      </span>
    </div>
  );
}

function DatePickerField({ display }: { display: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const shown =
    value &&
    new Date(value).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  function open() {
    const el = ref.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
        return;
      } catch {}
    }
    el.focus();
    el.click();
  }
  return (
    <div className="relative">
      <input
        readOnly
        onClick={open}
        value={shown ? String(shown) : ""}
        placeholder={display}
        className="h-11 w-full cursor-pointer rounded-lg border border-neutral-200 bg-white pl-3 pr-10 text-sm text-neutral-700 placeholder:text-neutral-700 outline-none focus:border-emerald-500"
      />
      <button
        type="button"
        onClick={open}
        className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
      >
        <Calendar size={15} />
      </button>
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}

export default function AdminProfilePage() {
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(f);
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-900">About section</h2>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Profile card */}
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Profile</h3>
              <div className="flex items-center gap-2 text-neutral-400">
                <button className="grid h-7 w-7 place-items-center rounded-md hover:bg-neutral-100 hover:text-neutral-600">
                  <Edit3 size={14} />
                </button>
                <button className="grid h-7 w-7 place-items-center rounded-md hover:bg-neutral-100 hover:text-neutral-600">
                  <Share2 size={14} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full ring-1 ring-neutral-200">
                <Image
                  src={avatar}
                  alt="Wade Warren"
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="mt-4 text-lg font-semibold text-neutral-900">
                Wade Warren
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-neutral-500">
                wade.warren@example.com
                <button className="text-neutral-400 hover:text-neutral-600">
                  <Copy size={12} />
                </button>
              </div>

              <div className="mt-5 w-full">
                <div className="mb-3 text-sm font-medium text-neutral-700">
                  Linked with Social media
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                  <SocialLinked icon={<GoogleLogo />} />
                  <SocialLinked icon={<FacebookLogo />} />
                  <SocialLinked icon={<XLogo />} />
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="inline-flex h-8 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 text-xs text-neutral-700 hover:bg-neutral-50">
                    <Plus size={12} /> Social media
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Change Password</h3>
              <button className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline">
                Need help <HelpCircle size={12} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <FieldLabel>Current Password</FieldLabel>
                <PasswordField />
                <a
                  href="#"
                  className="mt-2 inline-block text-xs text-sky-500 hover:underline"
                >
                  Forgot Current Password? Click here
                </a>
              </div>
              <div>
                <FieldLabel>New Password</FieldLabel>
                <PasswordField />
              </div>
              <div>
                <FieldLabel>Re-enter Password</FieldLabel>
                <PasswordField />
              </div>

              <button className="mt-2 h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
                Save Change
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Profile Update</h3>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
              <Edit3 size={12} /> Edit
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-neutral-200">
              <Image
                src={avatar}
                alt=""
                fill
                sizes="44px"
                unoptimized
                className="object-cover"
              />
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-9 items-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Upload New
            </button>
            <button
              type="button"
              onClick={() => setAvatar(defaultAvatar)}
              className="inline-flex h-9 items-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Delete
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel>First Name</FieldLabel>
              <Field>
                <input
                  defaultValue="Wade"
                  className="h-full w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </div>
            <div>
              <FieldLabel>Last Name</FieldLabel>
              <Field>
                <input
                  defaultValue="Warren"
                  className="h-full w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </div>

            <div>
              <FieldLabel>Password</FieldLabel>
              <PasswordField defaultValue="supersecret" />
            </div>

            <div>
              <FieldLabel>Phone Number</FieldLabel>
              <Field className="pr-2">
                <input
                  defaultValue="(406) 555-0120"
                  className="h-full flex-1 bg-transparent text-sm outline-none"
                />
                <span className="ml-2 flex items-center gap-1 border-l border-neutral-200 pl-2 text-xs text-neutral-600">
                  <span className="text-sm">🇺🇸</span>
                  <ChevronDown size={13} className="text-neutral-400" />
                </span>
              </Field>
            </div>

            <div>
              <FieldLabel>E-mail</FieldLabel>
              <Field>
                <input
                  defaultValue="wade.warren@example.com"
                  className="h-full w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </div>

            <div>
              <FieldLabel>Date of Birth</FieldLabel>
              <DatePickerField display="12- January- 1999" />
            </div>

            <div className="md:col-span-2">
              <FieldLabel>Location</FieldLabel>
              <Field>
                <input
                  defaultValue="2972 Westheimer Rd. Santa Ana, Illinois 85486"
                  className="h-full w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <FieldLabel>Credit Card</FieldLabel>
              <Field className="pr-2">
                <span className="relative mr-2 inline-block h-5 w-7">
                  <span className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#EB001B]" />
                  <span className="absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#F79E1B] opacity-90" />
                </span>
                <input
                  defaultValue="843-4359-4444"
                  className="h-full flex-1 bg-transparent text-sm outline-none"
                />
                <ChevronDown size={14} className="text-neutral-400" />
              </Field>
            </div>

            <div className="md:col-span-2">
              <FieldLabel>Biography</FieldLabel>
              <div className="relative rounded-lg border border-neutral-200 bg-white focus-within:border-emerald-500">
                <textarea
                  rows={4}
                  placeholder="Enter a biography about you"
                  className="w-full resize-none rounded-lg bg-transparent px-3 py-2.5 pr-20 text-sm text-neutral-700 placeholder:text-neutral-400 outline-none"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <button className="grid h-7 w-7 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100">
                    <Pencil size={13} />
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100">
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
