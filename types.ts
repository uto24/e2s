export enum UserRole {
  ADMIN = 'admin',
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
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AffiliateStat {
  date: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}
