"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUp,
  Copy,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Trash2,
} from "lucide-react";
import { listCustomers } from "@/services/admin";
import type { Customer as LiveCustomer } from "@/types";
import { formatDate } from "@/lib/utils";

/* --------------------------------- Data --------------------------------- */

type Status = "Active" | "Inactive" | "VIP";

type Customer = {
  rawId: string;
  id: string;
  name: string;
  phone: string;
  orders: number;
  spend: string;
  status: Status;
  email: string;
  address: string;
  avatar: string;
  registration: string;
  lastPurchase: string;
  totals: { total: number; completed: number; canceled: number };
};

function deriveStatus(orders: number): Status {
  if (orders === 0) return "Inactive";
  if (orders >= 4) return "VIP";
  return "Active";
}

function toViewCustomer(u: LiveCustomer): Customer {
  return {
    rawId: u.id,
    id: `#CUST${u.id}`,
    name: u.name,
    phone: u.phone,
    orders: u.ordersCount,
    spend: u.totalSpent.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    status: deriveStatus(u.ordersCount),
    email: u.email,
    address: u.email,
    avatar: u.avatar,
    registration: formatDate(u.joinedAt),
    lastPurchase: "—",
    totals: {
      total: u.ordersCount,
      completed: Math.max(0, u.ordersCount - 1),
      canceled: u.ordersCount > 0 ? 1 : 0,
    },
  };
}

/* ------------------------------- Helpers -------------------------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const color =
    status === "Active"
      ? "text-emerald-600"
      : status === "Inactive"
      ? "text-rose-500"
      : "text-amber-500";
  const dot =
    status === "Active"
      ? "bg-emerald-500"
      : status === "Inactive"
      ? "bg-rose-500"
      : "bg-amber-500";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

/* ----------------------------- Area chart ------------------------------- */

function CustomerChart() {
  // y values for Sun..Sat (0..50k scale)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const values = [22, 32, 30, 25, 42, 30, 42]; // in k
  const max = 50;

  const W = 620;
  const H = 210;
  const PAD_L = 32;
  const PAD_R = 10;
  const PAD_T = 10;
  const PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const x = (i: number) => PAD_L + (i * innerW) / (values.length - 1);
  const y = (v: number) => PAD_T + innerH - (v / max) * innerH;

  // Plateau path with smooth S-curve transitions between days
  const pts = values.map((v, i) => ({ x: x(i), y: y(v) }));
  const stepX = innerW / (values.length - 1);
  const k = stepX * 0.28;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` L ${midX - k} ${prev.y}`;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${midX + k} ${curr.y}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  const area = `${d} L ${pts[pts.length - 1].x} ${PAD_T + innerH} L ${pts[0].x} ${PAD_T + innerH} Z`;

  const wedIdx = 3; // Wednesday highlighted with tooltip "Thursday 25,409" per image
  const tipIdx = 3;
  const tipX = x(tipIdx);
  const tipY = y(values[tipIdx]);

  const yLabels = [50, 40, 30, 20, 10, 0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="block w-full h-auto"
    >
      <defs>
        <linearGradient id="custArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* y grid labels */}
      {yLabels.map((v) => {
        const yy = y(v);
        return (
          <g key={v}>
            <text
              x={0}
              y={yy + 3}
              fontSize="10"
              fill="#a3a3a3"
            >
              {v}k
            </text>
          </g>
        );
      })}

      {/* dashed vertical on Wed */}
      <line
        x1={x(wedIdx)}
        x2={x(wedIdx)}
        y1={PAD_T}
        y2={PAD_T + innerH}
        stroke="#d4d4d4"
        strokeDasharray="3 3"
      />

      {/* area + line */}
      <path d={area} fill="url(#custArea)" />
      <path d={d} fill="none" stroke="#10b981" strokeWidth="2" />

      {/* tooltip dot */}
      <circle cx={tipX} cy={tipY} r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />

      {/* tooltip */}
      <g>
        <rect
          x={tipX - 42}
          y={tipY - 34}
          width="84"
          height="26"
          rx="6"
          fill="#10b981"
        />
        <text
          x={tipX}
          y={tipY - 17}
          fontSize="10"
          fill="#fff"
          textAnchor="middle"
        >
          Thursday
        </text>
        <text
          x={tipX}
          y={tipY - 6}
          fontSize="10"
          fontWeight="600"
          fill="#fff"
          textAnchor="middle"
        >
          25,409
        </text>
      </g>

      {/* x labels */}
      {days.map((d2, i) => (
        <text
          key={d2}
          x={x(i)}
          y={H - 8}
          fontSize="11"
          fill={i === 3 ? "#171717" : "#a3a3a3"}
          fontWeight={i === 3 ? 600 : 400}
          textAnchor="middle"
        >
          {d2}
        </text>
      ))}
    </svg>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function CustomersPage() {
  const [range, setRange] = useState<"this" | "last">("this");
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const { data: liveCustomers = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => listCustomers(),
    staleTime: 5 * 60 * 1000,
  });

  const customers = liveCustomers.map(toViewCustomer);
  const selected = customers[selectedIdx] ?? customers[0];

  return (
    <div className="space-y-5">
      {/* Top row: left KPI column + right overview */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {/* KPI stack */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-start justify-between">
              <p className="text-sm text-neutral-500">Total Customers</p>
              <MoreHorizontal className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold text-neutral-900">11,040</h3>
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600">
                <ArrowUp className="h-3 w-3" /> 14.4%
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Last 7 days</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <p className="text-sm text-neutral-500">New Customers</p>
              <MoreHorizontal className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold text-neutral-900">2,370</h3>
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600">
                <ArrowUp className="h-3 w-3" /> 20%
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Last 7 days</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <p className="text-sm text-neutral-500">Visitor</p>
              <MoreHorizontal className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold text-neutral-900">250k</h3>
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600">
                <ArrowUp className="h-3 w-3" /> 20%
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Last 7 days</p>
          </Card>
        </div>

        {/* Customer Overview */}
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">Customer Overview</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-full bg-neutral-50 p-0.5 text-xs">
                <button
                  onClick={() => setRange("this")}
                  className={`px-3 py-1 rounded-full transition ${
                    range === "this"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-neutral-500"
                  }`}
                >
                  This week
                </button>
                <button
                  onClick={() => setRange("last")}
                  className={`px-3 py-1 rounded-full transition ${
                    range === "last"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-neutral-500"
                  }`}
                >
                  Last week
                </button>
              </div>
              <MoreHorizontal className="h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* Inline stats */}
          <div className="mt-5 grid grid-cols-4 gap-4">
            <div>
              <p className="text-xl font-semibold text-neutral-900">25k</p>
              <p className="text-xs text-neutral-500 border-b-2 border-emerald-500 pb-1 inline-block mt-1">
                Active Customers
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">5.6k</p>
              <p className="text-xs text-neutral-500 mt-1">Repeat Customers</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">250k</p>
              <p className="text-xs text-neutral-500 mt-1">Shop Visitor</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">5.5%</p>
              <p className="text-xs text-neutral-500 mt-1">Conversion Rate</p>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-4">
            <CustomerChart />
          </div>
        </Card>
      </div>

      {/* Customer Details section */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 mb-3">Customer Details</h2>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 items-start">
          {/* Customers table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-50/60 text-neutral-600">
                    <th className="text-left font-medium px-5 py-3">Customer Id</th>
                    <th className="text-left font-medium px-5 py-3">Name</th>
                    <th className="text-left font-medium px-5 py-3">Phone</th>
                    <th className="text-left font-medium px-5 py-3">Order Count</th>
                    <th className="text-left font-medium px-5 py-3">Total Spend</th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                    <th className="text-left font-medium px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={`s-${i}`} className="border-t border-neutral-100">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-5 py-3">
                            <div className="h-3 w-full rounded skeleton" />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                  {!isLoading && customers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-neutral-500">
                        No customers found.
                      </td>
                    </tr>
                  )}
                  {customers.map((c, i) => (
                    <tr
                      key={c.rawId}
                      onClick={() => setSelectedIdx(i)}
                      className={`border-t border-neutral-100 cursor-pointer transition ${
                        selectedIdx === i ? "bg-neutral-100" : "hover:bg-neutral-50"
                      }`}
                    >
                      <td className="px-5 py-3 text-neutral-700">{c.id}</td>
                      <td className="px-5 py-3 text-neutral-700">
                        <Link
                          href={`/admin/customers/${c.rawId}`}
                          className="hover:text-emerald-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-neutral-700">{c.phone}</td>
                      <td className="px-5 py-3 text-neutral-700">{c.orders}</td>
                      <td className="px-5 py-3 text-neutral-700">{c.spend}</td>
                      <td className="px-5 py-3"><StatusPill status={c.status} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3 text-neutral-400">
                          <button className="hover:text-neutral-600" aria-label="Message" onClick={(e) => e.stopPropagation()}>
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="hover:text-rose-500" aria-label="Delete" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-100">
              <button className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                ← Previous
              </button>
              <div className="flex items-center gap-1 text-sm">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`h-8 w-8 rounded-md ${
                      n === 1
                        ? "bg-emerald-600 text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-2 text-neutral-400">.....</span>
                <button className="h-8 w-8 rounded-md text-neutral-600 hover:bg-neutral-100">
                  24
                </button>
              </div>
              <button className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                Next →
              </button>
            </div>
          </Card>

          {/* Customer detail card */}
          {selected && <CustomerDetailCard customer={selected} />}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Customer detail card --------------------------- */

function CustomerDetailCard({ customer }: { customer: Customer }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Image
          src={customer.avatar}
          alt={customer.name}
          width={48}
          height={48}
          className="rounded-full h-12 w-12 object-cover"
          unoptimized
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-neutral-900 truncate">{customer.name}</h4>
          <p className="text-xs text-neutral-500 truncate">{customer.email}</p>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600" aria-label="Copy">
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {/* Contact info */}
      <div>
        <p className="text-xs text-neutral-500 mb-2">Customer Info</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700">
            <Phone className="h-3.5 w-3.5 text-neutral-400" />
            {customer.phone}
          </div>
          <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
            {customer.address || customer.email}
          </div>
        </div>
      </div>

      {/* Social */}
      <div>
        <p className="text-xs text-neutral-500 mb-2">Social Media</p>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white">
          <span className="h-6 w-6 rounded-full bg-[#1877F2] flex items-center justify-center">f</span>
          <span className="h-6 w-6 rounded-full bg-[#25D366] flex items-center justify-center">W</span>
          <span className="h-6 w-6 rounded-full bg-[#1DA1F2] flex items-center justify-center">t</span>
          <span className="h-6 w-6 rounded-full bg-[#0A66C2] flex items-center justify-center">in</span>
          <span className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">IG</span>
        </div>
      </div>

      {/* Activity */}
      <div>
        <p className="text-xs text-neutral-500 mb-2">Activity</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Registration:</span>
            <span className="text-neutral-700">{customer.registration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Last purchase:</span>
            <span className="text-neutral-700">{customer.lastPurchase}</span>
          </div>
        </div>
      </div>

      {/* Order overview */}
      <div>
        <p className="text-xs text-neutral-500 mb-2">Order overview</p>
        <div className="grid grid-cols-3 gap-2 border border-neutral-200 rounded-xl p-3 text-center">
          <div>
            <p className="text-base font-semibold text-neutral-900">{customer.totals.total}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Total order</p>
          </div>
          <div className="border-x border-neutral-200">
            <p className="text-base font-semibold text-neutral-900">{customer.totals.completed}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Completed</p>
          </div>
          <div>
            <p className="text-base font-semibold text-neutral-900">{customer.totals.canceled}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Canceled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
