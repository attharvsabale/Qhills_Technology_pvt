import type { Customer, Order, Transaction } from "@/types";

const API = "https://dummyjson.com";

// ---------- DummyJSON shapes ----------
interface DJUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  username: string;
  birthDate?: string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

interface DJUsersResponse {
  users: DJUser[];
  total: number;
  skip: number;
  limit: number;
}

interface DJCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

interface DJCart {
  id: number;
  products: DJCartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

interface DJCartsResponse {
  carts: DJCart[];
  total: number;
  skip: number;
  limit: number;
}

// ---------- helpers ----------
async function djFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`DummyJSON ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// Deterministic pseudo-random based on a numeric seed, so dates/statuses
// stay stable between renders without needing a real backend.
function seeded(n: number): number {
  // simple LCG
  let s = (n * 9301 + 49297) % 233280;
  s = (s * 9301 + 49297) % 233280;
  return s / 233280;
}

function deriveJoinedAt(userId: number): string {
  const days = Math.floor(seeded(userId) * 720); // up to ~2 years
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function deriveOrderDate(cartId: number): string {
  const days = Math.floor(seeded(cartId) * 90); // last 90 days
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function deriveOrderStatus(cartId: number): Order["status"] {
  const r = seeded(cartId);
  if (r < 0.55) return "delivered";
  if (r < 0.75) return "shipped";
  if (r < 0.88) return "processing";
  if (r < 0.96) return "pending";
  return "cancelled";
}

function derivePaymentMethod(cartId: number): string {
  const r = Math.floor(seeded(cartId * 7) * 4);
  return ["Card •••• 4242", "PayPal", "UPI", "Cash on delivery"][r];
}

function deriveTxMethod(cartId: number): Transaction["method"] {
  const r = Math.floor(seeded(cartId * 11) * 4);
  return (["card", "paypal", "upi", "cod"] as const)[r];
}

function deriveTxStatus(cartId: number): Transaction["status"] {
  const r = seeded(cartId * 13);
  if (r < 0.7) return "success";
  if (r < 0.85) return "pending";
  if (r < 0.95) return "failed";
  return "refunded";
}

function fullName(u: DJUser): string {
  return `${u.firstName} ${u.lastName}`.trim();
}

// ---------- caches (per server lifetime) ----------
let _usersCache: DJUser[] | null = null;
let _cartsCache: DJCart[] | null = null;

async function getAllUsers(): Promise<DJUser[]> {
  if (_usersCache) return _usersCache;
  const data = await djFetch<DJUsersResponse>(
    `/users?limit=100&select=firstName,lastName,email,phone,image,username,address,birthDate`
  );
  _usersCache = data.users;
  return _usersCache;
}

async function getAllCarts(): Promise<DJCart[]> {
  if (_cartsCache) return _cartsCache;
  const data = await djFetch<DJCartsResponse>(`/carts?limit=0`);
  _cartsCache = data.carts;
  return _cartsCache;
}

// ---------- mappers ----------
function mapCustomer(u: DJUser, carts: DJCart[]): Customer {
  const userCarts = carts.filter((c) => c.userId === u.id);
  const totalSpent = userCarts.reduce((s, c) => s + c.discountedTotal, 0);
  return {
    id: String(u.id),
    name: fullName(u),
    email: u.email,
    phone: u.phone,
    avatar: u.image,
    joinedAt: deriveJoinedAt(u.id),
    ordersCount: userCarts.length,
    totalSpent: Math.round(totalSpent * 100) / 100,
    status: "active",
  };
}

function mapOrder(c: DJCart, users: DJUser[]): Order {
  const u = users.find((x) => x.id === c.userId);
  const customerName = u ? fullName(u) : `User ${c.userId}`;
  const email = u?.email ?? "";
  const subtotal = c.total;
  const total = c.discountedTotal;
  const tax = Math.round((total - subtotal * 0.92) * 100) / 100;

  return {
    id: `ORD-${String(c.id).padStart(5, "0")}`,
    userId: String(c.userId),
    customerName,
    email,
    items: c.products.map((p) => ({
      productId: String(p.id),
      title: p.title,
      image: p.thumbnail,
      price: p.price,
      quantity: p.quantity,
      slug: `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${p.id}`,
    })),
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: 0,
    tax: tax > 0 ? tax : 0,
    total: Math.round(total * 100) / 100,
    status: deriveOrderStatus(c.id),
    paymentMethod: derivePaymentMethod(c.id),
    address: {
      fullName: customerName,
      phone: u?.phone ?? "",
      line1: u?.address?.address ?? "",
      city: u?.address?.city ?? "",
      state: u?.address?.state ?? "",
      zip: u?.address?.postalCode ?? "",
      country: u?.address?.country ?? "",
    },
    createdAt: deriveOrderDate(c.id),
  };
}

function mapTransaction(c: DJCart, users: DJUser[]): Transaction {
  const u = users.find((x) => x.id === c.userId);
  return {
    id: `TXN-${String(c.id).padStart(6, "0")}`,
    orderId: `ORD-${String(c.id).padStart(5, "0")}`,
    customer: u ? fullName(u) : `User ${c.userId}`,
    amount: Math.round(c.discountedTotal * 100) / 100,
    method: deriveTxMethod(c.id),
    status: deriveTxStatus(c.id),
    date: deriveOrderDate(c.id),
  };
}

// ---------- public API (signatures preserved) ----------
export async function listCustomers(): Promise<Customer[]> {
  const [users, carts] = await Promise.all([getAllUsers(), getAllCarts()]);
  return users.map((u) => mapCustomer(u, carts));
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;
  try {
    const [u, carts] = await Promise.all([
      djFetch<DJUser>(`/users/${numericId}`),
      getAllCarts(),
    ]);
    return mapCustomer(u, carts);
  } catch {
    return null;
  }
}

export async function listOrders(opts?: {
  userId?: string;
  status?: Order["status"];
}): Promise<Order[]> {
  const [users, carts] = await Promise.all([getAllUsers(), getAllCarts()]);
  let items = carts.map((c) => mapOrder(c, users));
  if (opts?.userId) items = items.filter((o) => o.userId === opts.userId);
  if (opts?.status) items = items.filter((o) => o.status === opts.status);
  items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return items;
}

export async function getOrder(id: string): Promise<Order | null> {
  const m = id.match(/(\d+)$/);
  if (!m) return null;
  const cartId = Number(m[1]);
  try {
    const [c, users] = await Promise.all([
      djFetch<DJCart>(`/carts/${cartId}`),
      getAllUsers(),
    ]);
    return mapOrder(c, users);
  } catch {
    return null;
  }
}

export async function listTransactions(): Promise<Transaction[]> {
  const [users, carts] = await Promise.all([getAllUsers(), getAllCarts()]);
  return carts
    .map((c) => mapTransaction(c, users))
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export async function getDashboardMetrics() {
  const [users, carts] = await Promise.all([getAllUsers(), getAllCarts()]);
  const totalRevenue =
    Math.round(
      carts.reduce((s, c) => s + c.discountedTotal, 0) * 100
    ) / 100;
  const totalOrders = carts.length;
  const totalCustomers = users.length;
  const orders = carts.map((c) => mapOrder(c, users));
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    pendingOrders,
    completedOrders,
    cancelledOrders,
  };
}
