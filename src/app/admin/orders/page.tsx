"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import { listOrders, getDashboardMetrics } from "@/services/admin";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import type { Order } from "@/types";

/* --------------------------------- Data --------------------------------- */

type OrderStatus = "Delivered" | "Pending" | "Shipped" | "Cancelled";
type PaymentStatus = "Paid" | "Unpaid";

function toUiStatus(status: Order["status"]): OrderStatus {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "shipped":
      return "Shipped";
    case "cancelled":
      return "Cancelled";
    case "pending":
    case "processing":
    default:
      return "Pending";
  }
}

function toPayment(status: Order["status"]): PaymentStatus {
  return status === "pending" || status === "cancelled" ? "Unpaid" : "Paid";
}

const tabKeys = ["all", "completed", "pending", "cancelled"] as const;
type TabKey = (typeof tabKeys)[number];
const tabLabels: Record<TabKey, string> = {
  all: "All order",
  completed: "Completed",
  pending: "Pending",
  cancelled: "Canceled",
};

/* ------------------------------- UI helpers ------------------------------ */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white ${className}`}>
      {children}
    </div>
  );
}

function KpiCard({
  title,
  value,
  delta,
  up,
}: {
  title: string;
  value: string;
  delta?: string;
  up?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="mb-1 flex items-start justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <button className="grid h-6 w-6 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              up ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-1 text-xs text-neutral-400">Last 7 days</div>
    </Card>
  );
}

function PaymentDot({ type }: { type: PaymentStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-neutral-700">
      <span
        className={`h-2 w-2 rounded-full ${
          type === "Paid" ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<
    OrderStatus,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    Delivered: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: <Package size={12} />,
    },
    Pending: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: <Package size={12} />,
    },
    Shipped: {
      bg: "",
      text: "text-neutral-700",
      icon: <Truck size={12} />,
    },
    Cancelled: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      icon: <Package size={12} />,
    },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${s.bg} ${s.text}`}
    >
      {s.icon}
      {status}
    </span>
  );
}

/* ---------------------------------- Page --------------------------------- */

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 10;

  const { data: liveOrders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => listOrders(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: metrics } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: () => getDashboardMetrics(),
    staleTime: 5 * 60 * 1000,
  });

  const counts = useMemo(
    () => ({
      all: liveOrders.length,
      completed: liveOrders.filter((o) => o.status === "delivered").length,
      pending: liveOrders.filter(
        (o) => o.status === "pending" || o.status === "processing"
      ).length,
      cancelled: liveOrders.filter((o) => o.status === "cancelled").length,
    }),
    [liveOrders]
  );

  const filtered = useMemo(() => {
    let xs = liveOrders;
    if (activeTab === "completed") xs = xs.filter((o) => o.status === "delivered");
    else if (activeTab === "pending")
      xs = xs.filter((o) => o.status === "pending" || o.status === "processing");
    else if (activeTab === "cancelled")
      xs = xs.filter((o) => o.status === "cancelled");
    if (search) {
      const q = search.toLowerCase();
      xs = xs.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items[0]?.title.toLowerCase().includes(q)
      );
    }
    return xs;
  }, [liveOrders, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Order List</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
            <Plus size={14} /> Add Order
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            More Action
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard
          title="Total Orders"
          value={metrics ? metrics.totalOrders.toLocaleString() : "—"}
          delta="14.4%"
          up
        />
        <KpiCard
          title="New Orders"
          value={counts.pending.toLocaleString()}
          delta="20%"
          up
        />
        <KpiCard
          title="Completed Orders"
          value={counts.completed.toLocaleString()}
          delta="85%"
          up
        />
        <KpiCard
          title="Canceled Orders"
          value={counts.cancelled.toLocaleString()}
          delta="5%"
          up={false}
        />
      </div>

      {/* Orders table card */}
      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
          <div className="-mx-1 flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-neutral-50 p-1">
            {tabKeys.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setActiveTab(k);
                  setPage(1);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === k
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {tabLabels[k]}
                <span
                  className={`ml-1 ${
                    activeTab === k ? "text-emerald-600" : "text-neutral-400"
                  }`}
                >
                  ({counts[k]})
                </span>
              </button>
            ))}
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <label className="relative w-full sm:w-auto">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search order report"
                className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-500 sm:w-64"
              />
            </label>
            <button className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-neutral-50">
              <SlidersHorizontal size={14} />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-neutral-50">
              <ArrowUpDown size={14} />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-neutral-50">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-emerald-50/60 text-left text-xs font-medium text-neutral-600">
                <th className="px-5 py-3">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-neutral-300" />
                </th>
                <th className="px-5 py-3 font-medium">No.</th>
                <th className="px-5 py-3 font-medium">Order Id</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`s-${i}`}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-3 w-full rounded skeleton" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!isLoading && visible.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-neutral-500">
                    No orders match your filters.
                  </td>
                </tr>
              )}
              {visible.map((o, i) => {
                const first = o.items[0];
                const productLabel =
                  o.items.length > 1
                    ? `${first?.title} +${o.items.length - 1} more`
                    : first?.title ?? "—";
                return (
                  <tr key={o.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-neutral-300"
                      />
                    </td>
                    <td className="px-5 py-3 text-neutral-500">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-5 py-3 font-medium">{o.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                          {first?.image ? (
                            <Image
                              src={first.image}
                              alt=""
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="max-w-[220px] whitespace-normal leading-tight">
                          {productLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {o.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <PaymentDot type={toPayment(o.status)} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={toUiStatus(o.status)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
