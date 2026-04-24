export type ID = string;

export interface Category {
  id: ID;
  name: string;
  slug: string;
  image: string;
  productCount?: number;
}

export interface ProductVariant {
  id: ID;
  label: string;
  value: string;
  priceDelta?: number;
}

export interface Product {
  id: ID;
  slug: string;
  title: string;
  brand: string;
  category: string;
  categorySlug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  tags?: string[];
  features?: string[];
  badge?: "new" | "sale" | "hot" | "best";
  createdAt: string;
}

export interface CartItem {
  productId: ID;
  title: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  slug: string;
}

export interface WishlistItem {
  productId: ID;
  title: string;
  image: string;
  price: number;
  slug: string;
}

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: ID;
  userId?: ID;
  customerName: string;
  email: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  address: Address;
  createdAt: string;
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedAt: string;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "blocked";
}

export interface Transaction {
  id: ID;
  orderId: ID;
  customer: string;
  amount: number;
  method: "card" | "paypal" | "upi" | "cod";
  status: "success" | "pending" | "failed" | "refunded";
  date: string;
}

export interface Review {
  id: ID;
  productId: ID;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
}
