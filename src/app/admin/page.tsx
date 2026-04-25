"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import {
  getDashboardMetrics,
  listTransactions,
} from "@/services/admin";
import { getFeaturedProducts } from "@/services/products";
import { formatCurrency, formatDate } from "@/lib/utils";

/* --------------------------------- Data --------------------------------- */

const weekData = [
  { day: "Sun", value: 15 },
  { day: "Mon", value: 30 },
  { day: "Tue", value: 30 },
  { day: "Wed", value: 30 },
  { day: "Thu", value: 14 },
  { day: "Fri", value: 15 },
  { day: "Sat", value: 30 },
];

const userBars = [
  22, 30, 18, 26, 40, 34, 28, 36, 44, 38, 30, 24, 32, 42, 36, 28, 34, 40, 30,
  26, 36, 44, 48, 38, 34, 30, 42, 46, 36, 28, 34, 40, 32, 26, 30, 38, 44, 36,
];

const countries = [
  { flag: "🇺🇸", code: "US", sales: "30k", delta: "25.8%", up: true },
  { flag: "🇧🇷", code: "Brazil", sales: "30k", delta: "15.8%", up: false },
  { flag: "🇦🇺", code: "Australia", sales: "25k", delta: "35.8%", up: false },
];

const topProducts = [
  {
    name: "Apple iPhone 13",
    sku: "#FXZ-4567",
    price: "$999.00",
    img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=200",
  },
  {
    name: "Nike Air Jordan",
    sku: "#FXZ-4567",
    price: "$72.40",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  },
  {
    name: "T-shirt",
    sku: "#FXZ-4567",
    price: "$35.40",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
  },
  {
    name: "Assorted Cross Bag",
    sku: "#FXZ-4567",
    price: "$80.00",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200",
  },
];

const bestSelling = [
  { name: "Apple iPhone 13", orders: 104, status: "Stock", price: "$999.00", img: topProducts[0].img },
  { name: "Nike Air Jordan", orders: 56, status: "Stock out", price: "$999.00", img: topProducts[1].img },
  { name: "T-shirt", orders: 266, status: "Stock", price: "$999.00", img: topProducts[2].img },
  { name: "Cross Bag", orders: 506, status: "Stock", price: "$999.00", img: topProducts[3].img },
];

const cats = [
  { name: "Electronic", img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=120" },
  { name: "Fashion", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120" },
  { name: "Home", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120" },
];
const addProducts = [
  {
    name: "Smart Fitness Tracker",
    price: "$39.99",
    img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=120",
  },
  {
    name: "Leather Wallet",
    price: "$19.99",
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=120",
  },
  {
    name: "Electric Hair Trimmer",
    price: "$34.99",
    img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=120",
  },
];

/* ----------------------------- Sub-components ---------------------------- */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

function DetailsBtn() {
  return (
    <button className="rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
      Details
    </button>
  );
}

function KpiCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-neutral-400">{subtitle}</div>
        </div>
        <button className="grid h-6 w-6 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100">
          <MoreHorizontal size={16} />
        </button>
      </div>
      {children}
    </Card>
  );
}

function AreaChart() {
  const max = 50;
  const w = 620;
  const h = 220;
  const padding = { l: 36, r: 10, t: 10, b: 28 };
  const innerW = w - padding.l - padding.r;
  const innerH = h - padding.t - padding.b;
  const n = weekData.length;
  const stepX = innerW / (n - 1);

  const points = weekData.map((d, i) => ({
    x: padding.l + i * stepX,
    y: padding.t + innerH - (d.value / max) * innerH,
    value: d.value,
    day: d.day,
  }));

  // Plateau-style path: flat at each day's value, with smooth S-curve transitions
  // centered at the midpoint between consecutive days.
  const k = stepX * 0.28; // half-width of the smooth transition
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    // hold flat until just before the midpoint
    pathD += ` L ${midX - k} ${prev.y}`;
    // cubic S-curve through the midpoint to the next plateau
    pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${midX + k} ${curr.y}`;
  }
  // extend flat to the last point
  pathD += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.t + innerH} L ${points[0].x} ${padding.t + innerH} Z`;

  const yTicks = [0, 10, 20, 30, 40, 50];
  const tooltipIdx = 4; // Thu dip

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[240px] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* y grid */}
        {yTicks.map((t) => {
          const y = padding.t + innerH - (t / max) * innerH;
          return (
            <g key={t}>
              <line
                x1={padding.l}
                x2={w - padding.r}
                y1={y}
                y2={y}
                stroke="#f3f4f6"
                strokeDasharray="2 4"
              />
              <text
                x={padding.l - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#9ca3af"
              >
                {t}k
              </text>
            </g>
          );
        })}

        <path d={areaD} fill="url(#areaFill)" />
        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* x labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={h - 8}
            textAnchor="middle"
            fontSize="11"
            fill={i === tooltipIdx ? "#111827" : "#9ca3af"}
            fontWeight={i === tooltipIdx ? 600 : 400}
          >
            {p.day}
          </text>
        ))}

        {/* tooltip dot + line */}
        <line
          x1={points[tooltipIdx].x}
          x2={points[tooltipIdx].x}
          y1={points[tooltipIdx].y}
          y2={padding.t + innerH}
          stroke="#10b981"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <circle
          cx={points[tooltipIdx].x}
          cy={points[tooltipIdx].y}
          r="5"
          fill="#fff"
          stroke="#10b981"
          strokeWidth="2.5"
        />
      </svg>

      {/* floating tooltip */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
        style={{
          left: `${(points[tooltipIdx].x / w) * 100}%`,
          top: `${((points[tooltipIdx].y - 8) / h) * 100}%`,
        }}
      >
        Thursday
        <div className="text-[11px] font-normal text-emerald-50">
          {weekData[tooltipIdx].value}k
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Page --------------------------------- */

export default function AdminHome() {
  const { data: metrics } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: () => getDashboardMetrics(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: txs = [] } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: () => listTransactions(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: top = [] } = useQuery({
    queryKey: ["admin-top-products"],
    queryFn: () => getFeaturedProducts(6),
    staleTime: 60 * 60 * 1000,
  });

  const kpis = [
    {
      label: "Customers",
      value: metrics ? metrics.totalCustomers.toLocaleString() : "—",
      active: true,
    },
    { label: "Total Products", value: "3.5k" },
    { label: "Stock Products", value: "2.5k" },
    { label: "Out of Stock", value: "0.5k" },
    {
      label: "Revenue",
      value: metrics ? formatCurrency(metrics.totalRevenue) : "—",
    },
  ];

  const recentTxs = txs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Row 1: three KPI cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Total Sales" subtitle="Last 7 days">
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">
              {metrics ? formatCurrency(metrics.totalRevenue) : "—"}
            </span>
            <span className="text-sm text-neutral-500">Sales</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
              <ArrowUp size={12} />
              10.4%
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            Previous 7days <span className="text-neutral-500">($235)</span>
          </div>
          <div className="mt-4 flex justify-end">
            <DetailsBtn />
          </div>
        </KpiCard>

        <KpiCard title="Total Orders" subtitle="Last 7 days">
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">
              {metrics ? metrics.totalOrders.toLocaleString() : "—"}
            </span>
            <span className="text-sm text-neutral-500">order</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
              <ArrowUp size={12} />
              14.4%
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            Previous 7days <span className="text-neutral-500">(7.6K)</span>
          </div>
          <div className="mt-4 flex justify-end">
            <DetailsBtn />
          </div>
        </KpiCard>

        <KpiCard title="Pending & Canceled" subtitle="Last 7 days">
          <div className="mt-4 flex items-start gap-6">
            <div>
              <div className="text-xs text-neutral-500">Pending</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {metrics ? metrics.pendingOrders.toLocaleString() : "—"}
                </span>
                <span className="text-xs text-neutral-400">orders</span>
              </div>
            </div>
            <div className="h-10 w-px bg-neutral-200" />
            <div>
              <div className="text-xs text-neutral-500">Canceled</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {metrics ? metrics.cancelledOrders.toLocaleString() : "—"}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-rose-600">
                  <ArrowDown size={12} />
                  14.4%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <DetailsBtn />
          </div>
        </KpiCard>
      </div>

      {/* Row 2: report chart + users/sales by country */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-start justify-between">
            <div className="text-base font-semibold">Report for this week</div>
            <div className="inline-flex rounded-full border border-neutral-200 p-0.5 text-xs">
              <button className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                This week
              </button>
              <button className="rounded-full px-3 py-1 text-neutral-500">
                Last week
              </button>
            </div>
            <button className="grid h-6 w-6 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-b border-neutral-100 pb-5 md:grid-cols-5">
            {kpis.map((k) => (
              <div key={k.label}>
                <div className="text-xl font-bold tracking-tight">{k.value}</div>
                <div
                  className={`mt-1 inline-block text-xs ${
                    k.active
                      ? "border-b-2 border-emerald-500 pb-0.5 font-medium text-emerald-600"
                      : "text-neutral-500"
                  }`}
                >
                  {k.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <AreaChart />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-neutral-500">
                Users in last 30 minutes
              </div>
              <div className="mt-1 text-2xl font-bold tracking-tight">21.5K</div>
              <div className="text-[11px] text-neutral-400">Users per minute</div>
            </div>
          </div>

          {/* users per minute bars */}
          <div className="mt-3 flex h-16 items-end gap-[3px]">
            {userBars.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-emerald-500"
                style={{ height: `${v * 1.5}%` }}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm font-semibold">Sales by Country</div>
            <div className="text-xs text-neutral-400">Sales</div>
          </div>

          <div className="mt-3 space-y-3">
            {countries.map((c) => (
              <div key={c.code} className="flex items-center gap-3">
                <span className="text-lg">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold">{c.sales}</div>
                  <div className="text-[11px] text-neutral-500">{c.code}</div>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 w-full rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: c.code === "US" ? "70%" : c.code === "Brazil" ? "60%" : "45%",
                      }}
                    />
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                    c.up ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {c.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {c.delta}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full rounded-full border border-neutral-200 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
            View Insight
          </button>
        </Card>
      </div>

      {/* Row 3: transactions + top products */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Transaction</div>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
              Filter <Filter size={12} />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-neutral-400">
                  <th className="py-2 pr-4 font-medium">No</th>
                  <th className="py-2 pr-4 font-medium">Id Customer</th>
                  <th className="py-2 pr-4 font-medium">Order Date</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentTxs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-neutral-400">
                      Loading transactions…
                    </td>
                  </tr>
                )}
                {recentTxs.map((t, i) => (
                  <tr key={t.id}>
                    <td className="py-3 pr-4 text-neutral-500">{i + 1}.</td>
                    <td className="py-3 pr-4 font-medium">{t.orderId}</td>
                    <td className="py-3 pr-4 text-neutral-500">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          t.status === "success"
                            ? "text-emerald-600"
                            : t.status === "pending"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            t.status === "success"
                              ? "bg-emerald-500"
                              : t.status === "pending"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {t.status === "success"
                          ? "Paid"
                          : t.status === "pending"
                          ? "Pending"
                          : "Failed"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-medium">
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <DetailsBtn />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Top Products</div>
            <a
              href="#"
              className="text-xs font-medium text-emerald-600 hover:underline"
            >
              All product
            </a>
          </div>
          <label className="relative mt-4 block">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              placeholder="Search"
              className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
            />
          </label>
          <div className="mt-4 space-y-3">
            {top.length === 0 && (
              <div className="py-6 text-center text-xs text-neutral-400">
                Loading top products…
              </div>
            )}
            {top.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-md bg-neutral-100">
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-neutral-400">{p.brand}</div>
                </div>
                <div className="text-sm font-semibold">
                  {formatCurrency(p.price)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 4: best selling + add new product */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Best selling product</div>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
              Filter <Filter size={12} />
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="rounded-md bg-neutral-50 text-left text-[11px] uppercase tracking-wider text-neutral-500">
                  <th className="rounded-l-md px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Total Order</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="rounded-r-md px-4 py-3 font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bestSelling.map((p) => (
                  <tr key={p.name}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 overflow-hidden rounded-md bg-neutral-100">
                          <Image src={p.img} alt="" fill sizes="40px" className="object-cover" />
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.orders}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          p.status === "Stock" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            p.status === "Stock" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <DetailsBtn />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Add New Product</div>
            <a
              href="/admin/products/new"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              <Plus size={12} /> Add New
            </a>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-xs font-medium text-neutral-500">
              Categories
            </div>
            <div className="space-y-2">
              {cats.map((c) => (
                <button
                  key={c.name}
                  className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm hover:bg-neutral-50"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-md bg-neutral-100">
                    <Image src={c.img} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <span className="flex-1 font-medium">{c.name}</span>
                  <ChevronRight size={14} className="text-neutral-400" />
                </button>
              ))}
            </div>
            <div className="mt-2 text-center">
              <a href="#" className="text-xs font-medium text-emerald-600 hover:underline">
                See more
              </a>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-medium text-neutral-500">Product</div>
            <div className="space-y-2">
              {addProducts.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-md bg-neutral-100">
                    <Image src={p.img} alt="" fill sizes="32px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-400">{p.price}</div>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                    <Plus size={10} /> Add
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center">
              <a href="#" className="text-xs font-medium text-emerald-600 hover:underline">
                See more
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
