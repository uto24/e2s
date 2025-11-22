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

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string; // New field
  address?: string; // New field
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
  price: number; // Selling Price
  wholesalePrice: number; // Base price for affiliates/resellers
  sale_price?: number;
  category: string;
  image: string; // Primary thumbnail
  images?: string[]; // Gallery images
  rating: number;
  reviews_count: number;
  reviews?: Review[]; // New field
  stock: number;
  status: 'active' | 'draft' | 'archived';
  sizes?: string[]; 
  colors?: string[];
  shippingFees: {
    inside: number;
    outside: number;
  };
  isCodAvailable: boolean;
  specifications?: Record<string, string>; // Key-value pairs for details
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  cartItemId: string;
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
  maintenanceMode: boolean;
  campaign: {
    isActive: boolean;
    title: string;
    subtitle: string;
    endTime: string; // ISO string
  };
}