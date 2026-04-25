"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&q=75";
const thumbA =
  "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=60";
const thumbB =
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=60";

const swatches = [
  "#DCEFD3",
  "#F3D7D6",
  "#D9DEE1",
  "#EEE3C0",
  "#2F333A",
];

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

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-emerald-500 ${
        props.className ?? ""
      }`}
    />
  );
}

function SelectLike({
  placeholder = "Select your product",
}: {
  placeholder?: string;
}) {
  return (
    <button
      type="button"
      className="flex h-10 w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-400 outline-none hover:border-neutral-300"
    >
      <span>{placeholder}</span>
      <ChevronDown size={16} className="text-neutral-400" />
    </button>
  );
}

function DateInput({ placeholder }: { placeholder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  const display = value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";

  function openPicker() {
    const el = ref.current;
    if (!el) return;
    // Chromium supports showPicker(); fall back to focus+click for others.
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
        onClick={openPicker}
        value={display}
        placeholder={placeholder}
        className="h-10 w-full cursor-pointer rounded-lg border border-neutral-200 bg-white pl-3 pr-10 text-sm text-neutral-700 placeholder:text-neutral-400 outline-none focus:border-emerald-500"
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label={`Pick ${placeholder} date`}
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

export default function AddProductPage() {
  const [taxIncluded, setTaxIncluded] = useState(true);
  const [unlimited, setUnlimited] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [color, setColor] = useState(0);
  const [hero, setHero] = useState<string>(heroImage);
  const [thumbs, setThumbs] = useState<string[]>([thumbA, thumbB]);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  function filesToDataUrls(files: FileList | null): Promise<string[]> {
    if (!files || files.length === 0) return Promise.resolve([]);
    return Promise.all(
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .map(
          (f) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = reject;
              reader.readAsDataURL(f);
            })
        )
    );
  }

  async function onHeroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const urls = await filesToDataUrls(e.target.files);
    if (urls[0]) setHero(urls[0]);
    e.target.value = "";
  }

  async function onAddThumbs(e: React.ChangeEvent<HTMLInputElement>) {
    const urls = await filesToDataUrls(e.target.files);
    if (urls.length) setThumbs((xs) => [...xs, ...urls]);
    e.target.value = "";
  }

  function removeThumb(i: number) {
    setThumbs((xs) => xs.filter((_, j) => j !== i));
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-emerald-600">
          Add New Product
        </h2>

        <div className="ml-auto flex items-center gap-3">
          <label className="relative hidden md:block">
            <input
              placeholder="Search product for add"
              className="h-10 w-64 rounded-full border border-neutral-200 bg-white pl-4 pr-10 text-sm placeholder:text-neutral-400 outline-none focus:border-emerald-500"
            />
            <Search
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </label>

          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
            Publish Product
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            <Save size={14} />
            Save to draft
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Basic Details */}
          <Card>
            <h3 className="mb-5 text-base font-semibold text-neutral-900">
              Basic Details
            </h3>

            <div className="space-y-5">
              <div>
                <FieldLabel>Product Name</FieldLabel>
                <TextInput defaultValue="iPhone 15" />
              </div>

              <div>
                <FieldLabel>Product Description</FieldLabel>
                <div className="relative">
                  <textarea
                    rows={4}
                    defaultValue="The iPhone 15 delivers cutting-edge performance with the A16 Bionic chip, an immersive Super Retina XDR display, advanced dual-camera system, and exceptional battery life, all encased in stunning aerospace-grade aluminum."
                    className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 pr-20 text-sm leading-relaxed text-neutral-700 outline-none focus:border-emerald-500"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="grid h-7 w-7 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="grid h-7 w-7 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100"
                    >
                      <Sparkles size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <h3 className="mb-5 text-base font-semibold text-neutral-900">
              Pricing
            </h3>

            <div className="space-y-5">
              <div>
                <FieldLabel>Product Price</FieldLabel>
                <div className="flex h-10 w-full items-center rounded-lg border border-neutral-200 bg-white">
                  <input
                    defaultValue="$999.89"
                    className="h-full flex-1 rounded-l-lg bg-transparent px-3 text-sm text-neutral-800 outline-none"
                  />
                  <div className="flex h-full items-center gap-1 border-l border-neutral-200 px-3 text-xs text-neutral-600">
                    <span className="text-sm">🇺🇸</span>
                    <ChevronDown size={13} className="text-neutral-400" />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel>
                    Discounted Price{" "}
                    <span className="text-neutral-400">(Optional)</span>
                  </FieldLabel>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2">
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-white text-sm text-neutral-700 shadow-sm">
                      $
                    </span>
                    <span className="text-sm font-medium text-neutral-800">
                      99
                    </span>
                    <span className="ml-auto rounded-md bg-white px-2 py-1 text-xs text-neutral-600 shadow-sm">
                      Sale= $900.89
                    </span>
                  </div>
                </div>

                <div>
                  <FieldLabel>Tax Included</FieldLabel>
                  <div className="flex items-center gap-6 py-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="radio"
                        name="tax"
                        checked={taxIncluded}
                        onChange={() => setTaxIncluded(true)}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      Yes
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="radio"
                        name="tax"
                        checked={!taxIncluded}
                        onChange={() => setTaxIncluded(false)}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel>Expiration</FieldLabel>
                <div className="grid gap-4 md:grid-cols-2">
                  <DateInput placeholder="Start" />
                  <DateInput placeholder="End" />
                </div>
              </div>
            </div>
          </Card>

          {/* Inventory */}
          <Card>
            <h3 className="mb-5 text-base font-semibold text-neutral-900">
              Inventory
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>Stock Quantity</FieldLabel>
                <TextInput defaultValue="Unlimited" />
              </div>
              <div>
                <FieldLabel>Stock Status</FieldLabel>
                <div className="relative">
                  <select
                    defaultValue="In Stock"
                    className="h-10 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 pr-9 text-sm text-neutral-800 outline-none focus:border-emerald-500"
                  >
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                    <option>Pre-order</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUnlimited((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  unlimited ? "bg-emerald-500" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    unlimited ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
              <span className="text-sm text-neutral-700">Unlimited</span>
            </div>

            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              Highlight this product in a featured section.
            </label>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <Save size={14} /> Save to draft
              </button>
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
                Publish Product
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-5 text-base font-semibold text-neutral-900">
              Upload Product Image
            </h3>

            <FieldLabel>Product Image</FieldLabel>
            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onHeroChange}
            />
            <input
              ref={addInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onAddThumbs}
            />
            <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={hero}
                  alt="Product"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  unoptimized
                  className="object-contain p-6"
                />
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Upload size={12} /> Browse
                </button>
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  <RefreshCw size={12} /> Replace
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {thumbs.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="96px"
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeThumb(i)}
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-neutral-600 shadow hover:bg-white"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addInputRef.current?.click()}
                className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-600 hover:bg-emerald-50"
              >
                <span className="flex flex-col items-center gap-1">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
                    <Plus size={14} />
                  </span>
                  <span className="text-[11px] font-medium">Add Image</span>
                </span>
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="mb-5 text-base font-semibold text-neutral-900">
              Categories
            </h3>

            <div className="space-y-5">
              <div>
                <FieldLabel>Product Categories</FieldLabel>
                <SelectLike />
              </div>
              <div>
                <FieldLabel>Product Tag</FieldLabel>
                <SelectLike />
              </div>

              <div>
                <FieldLabel>Select your color</FieldLabel>
                <div className="flex items-center gap-3">
                  {swatches.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setColor(i)}
                      style={{ backgroundColor: c }}
                      className={`h-9 w-9 rounded-md transition-all ${
                        color === i
                          ? "ring-2 ring-emerald-500 ring-offset-2"
                          : "ring-1 ring-neutral-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
