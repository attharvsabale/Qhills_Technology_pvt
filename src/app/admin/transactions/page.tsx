"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { listTransactions, getDashboardMetrics } from "@/services/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import type { Transaction } from "@/types";

/* --------------------------------- Data --------------------------------- */

type TxStatus = "Complete" | "Pending" | "Canceled";
type Method = "CC" | "PayPal" | "Bank";

function toUiStatus(s: Transaction["status"]): TxStatus {
  if (s === "success") return "Complete";
  if (s === "pending") return "Pending";
  return "Canceled";
}

function toUiMethod(m: Transaction["method"]): Method {
  if (m === "paypal") return "PayPal";
  if (m === "upi" || m === "cod") return "Bank";
  return "CC";
}

const tabKeys = ["all", "completed", "pending", "canceled"] as const;
type TabKey = (typeof tabKeys)[number];
const tabLabels: Record<TabKey, string> = {
  all: "All order",
  completed: "Completed",
  pending: "Pending",
  canceled: "Canceled",
};

/* ------------------------------- Helpers -------------------------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  up = true,
}: {
  label: string;
  value: string;
  delta: string;
  up?: boolean;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm text-neutral-500">{label}</p>
        <MoreHorizontal className="h-4 w-4 text-neutral-400" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold text-neutral-900">{value}</h3>
        <span
          className={`inline-flex items-center gap-0.5 text-xs ${
            up ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {delta}
        </span>
      </div>
      <p className="mt-1 text-xs text-neutral-400">Last 7 days</p>
    </Card>
  );
}

function StatusText({ status }: { status: TxStatus }) {
  const cls =
    status === "Complete"
      ? "text-emerald-600"
      : status === "Pending"
      ? "text-amber-500"
      : "text-rose-500";
  const dot =
    status === "Complete"
      ? "bg-emerald-500"
      : status === "Pending"
      ? "bg-amber-500"
      : "bg-rose-500";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

/* ------------------------------ Credit Card ----------------------------- */

function CreditCard() {
  return (
    <div
      className="relative w-full max-w-[320px] aspect-[260/164] rounded-2xl overflow-hidden text-white shadow-lg select-none bg-[url('/credit-green-card-bg.svg')] bg-cover bg-center"
      aria-label="Finaci credit card"
    >
      {/* Top row: brand + chip */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase opacity-90">
          Finaci
        </div>
        <div className="h-6 w-8 rounded-[4px] bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-inner" />
      </div>

      {/* Card number */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 font-mono text-[15px] tracking-[0.18em] tabular-nums">
        4242&nbsp;&nbsp;5678&nbsp;&nbsp;9012&nbsp;&nbsp;3456
      </div>

      {/* Bottom row: holder + expiry + brand mark */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <div className="leading-tight">
          <div className="text-[9px] uppercase tracking-widest opacity-70">
            Card Holder
          </div>
          <div className="text-[12px] font-medium">Mark Anderson</div>
        </div>
        <div className="leading-tight text-right">
          <div className="text-[9px] uppercase tracking-widest opacity-70">
            Expires
          </div>
          <div className="text-[12px] font-medium tabular-nums">08/29</div>
        </div>
        <div className="flex items-center -space-x-2" aria-hidden>
          <span className="h-5 w-5 rounded-full bg-rose-500/90" />
          <span className="h-5 w-5 rounded-full bg-amber-400/90" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const { data: txs = [], isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: () => listTransactions(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: metrics } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: () => getDashboardMetrics(),
    staleTime: 5 * 60 * 1000,
  });

  const counts = useMemo(
    () => ({
      all: txs.length,
      completed: txs.filter((t) => t.status === "success").length,
      pending: txs.filter((t) => t.status === "pending").length,
      canceled: txs.filter(
        (t) => t.status === "failed" || t.status === "refunded"
      ).length,
    }),
    [txs]
  );

  const totalRevenue = useMemo(
    () =>
      txs
        .filter((t) => t.status === "success")
        .reduce((s, t) => s + t.amount, 0),
    [txs]
  );

  const filtered = useMemo(() => {
    let xs = txs;
    if (activeTab === "completed") xs = xs.filter((t) => t.status === "success");
    else if (activeTab === "pending") xs = xs.filter((t) => t.status === "pending");
    else if (activeTab === "canceled")
      xs = xs.filter((t) => t.status === "failed" || t.status === "refunded");
    if (search) {
      const q = search.toLowerCase();
      xs = xs.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q)
      );
    }
    return xs;
  }, [txs, activeTab, search]);

  return (
    <div className="space-y-5">
      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.5fr] gap-4">
        {/* KPI col 1 */}
        <div className="space-y-4">
          <KpiCard
            label="Total Revenue"
            value={metrics ? formatCurrency(metrics.totalRevenue) : "—"}
            delta="14.4%"
          />
          <KpiCard
            label="Pending Transactions"
            value={counts.pending.toLocaleString()}
            delta="85%"
          />
        </div>
        {/* KPI col 2 */}
        <div className="space-y-4">
          <KpiCard
            label="Completed Transactions"
            value={counts.completed.toLocaleString()}
            delta="20%"
          />
          <KpiCard
            label="Failed Transactions"
            value={counts.canceled.toLocaleString()}
            delta="15%"
            up={false}
          />
        </div>

        {/* Payment method */}
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">Payment Method</h3>
            <MoreHorizontal className="h-4 w-4 text-neutral-400" />
          </div>

          <div className="mt-3 flex items-start gap-4">
            <CreditCard />
            <div className="text-sm space-y-1.5 pt-1">
              <p>
                <span className="text-neutral-500">Status: </span>
                <span className="text-emerald-600 font-medium">Active</span>
              </p>
              <p>
                <span className="text-neutral-500">Transactions: </span>
                <span className="text-neutral-800 font-medium">
                  {counts.all.toLocaleString()}
                </span>
              </p>
              <p>
                <span className="text-neutral-500">Revenue: </span>
                <span className="text-neutral-800 font-medium">
                  {formatCurrency(totalRevenue)}
                </span>
              </p>
              <button className="text-indigo-500 text-sm font-medium hover:underline">
                View Transactions
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button className="flex-1 inline-flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-lg h-9">
              <Plus className="h-4 w-4" /> Add Card
            </button>
            <button className="px-4 h-9 rounded-lg bg-rose-50 text-rose-500 text-sm font-medium hover:bg-rose-100">
              Deactivate
            </button>
          </div>
        </Card>
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl border border-neutral-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="inline-flex items-center rounded-full bg-neutral-50 p-0.5 text-sm whitespace-nowrap">
              {tabKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setActiveTab(k)}
                  className={`px-3 py-1.5 rounded-full transition shrink-0 ${
                    activeTab === k
                      ? "bg-white text-emerald-600 shadow-sm"
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
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payment history"
                className="pl-9 pr-3 h-9 w-full sm:w-60 rounded-full bg-neutral-50 border border-neutral-200 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <button className="h-9 w-9 shrink-0 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 shrink-0 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700" aria-label="Sort">
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 shrink-0 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700" aria-label="More">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-emerald-50/60 text-neutral-600">
                <th className="text-left font-medium px-5 py-3">Transaction</th>
                <th className="text-left font-medium px-5 py-3">Customer</th>
                <th className="text-left font-medium px-5 py-3">Date</th>
                <th className="text-left font-medium px-5 py-3">Total</th>
                <th className="text-left font-medium px-5 py-3">Method</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-left font-medium px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`s-${i}`} className="border-t border-neutral-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-3 w-full rounded skeleton" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-neutral-500">
                    No transactions found.
                  </td>
                </tr>
              )}
              {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((t) => (
                <tr key={t.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                  <td className="px-5 py-3 text-neutral-700">{t.id}</td>
                  <td className="px-5 py-3 text-neutral-700">{t.customer}</td>
                  <td className="px-5 py-3 text-neutral-700">{formatDate(t.date)}</td>
                  <td className="px-5 py-3 text-neutral-700">{formatCurrency(t.amount)}</td>
                  <td className="px-5 py-3 text-neutral-700">{toUiMethod(t.method)}</td>
                  <td className="px-5 py-3"><StatusText status={toUiStatus(t.status)} /></td>
                  <td className="px-5 py-3">
                    <button className="text-emerald-600 text-sm font-medium hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
