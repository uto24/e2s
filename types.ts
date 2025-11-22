export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  PRODUCT_MANAGER = 'product_manager',
  ORDER_MANAGER = 'order_manager',
  AFFILIATE_MANAGER = 'affiliate_manager',
  SELLER = 'seller',
  USER = 'user',
  AFFILIATE = 'affiliate'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  affiliate_id?: string;
  balance: number;
  avatar?: string;
  joinedAt?: string;
  status?: 'active' | 'banned';
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  category: string;
  image: string;
  rating: number;
  reviews_count: number;
  stock: number;
  commission_rate: number; // Percentage, e.g., 0.10 for 10%
  status: 'active' | 'draft' | 'archived';
  sizes?: string[]; // Array of available sizes
  colors?: string[]; // Array of available colors
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  cartItemId: string; // Unique ID for cart entry (product + variants)
}

export interface AffiliateStat {
  date: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: number;
  paymentMethod: string;
}

export type WithdrawStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface WithdrawRequest {
  id: string;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  method: 'bank' | 'paypal' | 'other';
  accountDetails: string;
  status: WithdrawStatus;
  date: string;
}

export interface AppSettings {
  appName: string;
  currency: string;
  taxRate: number;
  shippingInsideCity: number; // Special area rate
  shippingOutsideCity: number; // Rest of country rate
  codEnabled: boolean; // Cash on Delivery toggle
  maintenanceMode: boolean;
  globalCommission: number;
}