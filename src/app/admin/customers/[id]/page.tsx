import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCustomer, listOrders } from "@/services/admin";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  const theirOrders = await listOrders({ userId: customer.id });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]"
      >
        <ArrowLeft size={14} /> Back to customers
      </Link>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Image
              src={customer.avatar}
              alt={customer.name}
              width={88}
              height={88}
              className="h-22 w-22 rounded-full"
            />
            <div>
              <div className="text-lg font-semibold">{customer.name}</div>
              <Badge
                variant={customer.status === "active" ? "success" : "danger"}
                className="mt-1"
              >
                {customer.status}
              </Badge>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-[var(--color-muted-fg)]" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-[var(--color-muted-fg)]" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-[var(--color-muted-fg)]">Joined</span>
              <span>{formatDate(customer.joinedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted-fg)]">Orders</span>
              <span>{customer.ordersCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted-fg)]">Total spent</span>
              <span className="font-semibold">
                {formatCurrency(customer.totalSpent)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <h3 className="text-base font-semibold">Order history</h3>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {theirOrders.length === 0 && (
              <div className="p-8 text-center text-sm text-[var(--color-muted-fg)]">
                No orders yet.
              </div>
            )}
            {theirOrders.map((o) => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1">
                  <div className="text-sm font-medium">{o.id}</div>
                  <div className="text-xs text-[var(--color-muted-fg)]">
                    {formatDate(o.createdAt)} · {o.items.length} items
                  </div>
                </div>
                <Badge
                  variant={
                    o.status === "delivered"
                      ? "success"
                      : o.status === "pending"
                      ? "warning"
                      : o.status === "cancelled"
                      ? "danger"
                      : "info"
                  }
                >
                  {o.status}
                </Badge>
                <div className="w-24 text-right text-sm font-semibold">
                  {formatCurrency(o.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
