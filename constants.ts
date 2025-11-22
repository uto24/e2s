import { Product, AffiliateStat, Order, UserRole, WithdrawRequest, AppSettings } from './types';

export const APP_NAME = "E2S Shop";
export const CURRENCY = "$";

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "E2S Shop & Affiliates",
  currency: "$",
  taxRate: 0.08,
  shippingCost: 5.00,
  maintenanceMode: false,
  globalCommission: 0.10
};

// Mock Products
export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Wireless Noise Cancelling Headphones',
    slug: 'wireless-headphones',
    description: 'Premium sound quality with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    sale_price: 249.99,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.8,
    reviews_count: 124,
    stock: 45,
    commission_rate: 0.10,
    status: 'active'
  },
  {
    id: 'p2',
    title: 'Ergonomic Office Chair',
    slug: 'ergonomic-chair',
    description: 'High-back mesh chair with lumbar support and adjustable armrests.',
    price: 199.00,
    category: 'Furniture',
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.5,
    reviews_count: 89,
    stock: 12,
    commission_rate: 0.15,
    status: 'active'
  },
  {
    id: 'p3',
    title: 'Smart Fitness Watch',
    slug: 'smart-watch',
    description: 'Track your health, heart rate, and sleep patterns with this waterproof smart watch.',
    price: 149.50,
    sale_price: 129.99,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.2,
    reviews_count: 210,
    stock: 100,
    commission_rate: 0.08,
    status: 'active'
  },
  {
    id: 'p4',
    title: 'Organic Cotton T-Shirt',
    slug: 'cotton-tshirt',
    description: '100% organic cotton t-shirt, breathable and soft.',
    price: 29.99,
    category: 'Fashion',
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.6,
    reviews_count: 54,
    stock: 200,
    commission_rate: 0.05,
    status: 'active'
  },
  {
    id: 'p5',
    title: 'Minimalist Backpack',
    slug: 'minimalist-backpack',
    description: 'Water-resistant travel backpack with laptop compartment.',
    price: 79.99,
    category: 'Accessories',
    image: 'https://picsum.photos/400/400?random=5',
    rating: 4.9,
    reviews_count: 340,
    stock: 5,
    commission_rate: 0.12,
    status: 'active'
  },
  {
    id: 'p6',
    title: '4K Gaming Monitor',
    slug: '4k-monitor',
    description: 'Ultra-fast 144Hz refresh rate gaming monitor.',
    price: 499.99,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=6',
    rating: 4.7,
    reviews_count: 80,
    stock: 0, // Out of stock test
    commission_rate: 0.10,
    status: 'active'
  }
];

// Mock Affiliate Stats
export const AFFILIATE_STATS: AffiliateStat[] = [
  { date: '2023-10-01', clicks: 120, conversions: 5, earnings: 45.00 },
  { date: '2023-10-02', clicks: 145, conversions: 8, earnings: 72.50 },
  { date: '2023-10-03', clicks: 90, conversions: 2, earnings: 15.00 },
  { date: '2023-10-04', clicks: 200, conversions: 12, earnings: 110.25 },
  { date: '2023-10-05', clicks: 180, conversions: 9, earnings: 85.00 },
  { date: '2023-10-06', clicks: 250, conversions: 15, earnings: 145.00 },
  { date: '2023-10-07', clicks: 310, conversions: 22, earnings: 210.00 },
];

// Mock Orders for Admin
export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customer: 'Alice Johnson', email: 'alice@example.com', total: 299.99, status: 'delivered', date: '2023-10-01', items: 2, paymentMethod: 'Stripe' },
  { id: 'ORD-002', customer: 'Bob Smith', email: 'bob@example.com', total: 49.99, status: 'processing', date: '2023-10-05', items: 1, paymentMethod: 'PayPal' },
  { id: 'ORD-003', customer: 'Charlie Brown', email: 'charlie@example.com', total: 129.99, status: 'pending', date: '2023-10-07', items: 3, paymentMethod: 'Stripe' },
  { id: 'ORD-004', customer: 'David Lee', email: 'david@example.com', total: 599.00, status: 'cancelled', date: '2023-10-08', items: 1, paymentMethod: 'Stripe' },
  { id: 'ORD-005', customer: 'Eve White', email: 'eve@example.com', total: 24.50, status: 'shipped', date: '2023-10-08', items: 5, paymentMethod: 'COD' },
];

// Mock Withdraw Requests
export const MOCK_WITHDRAWS: WithdrawRequest[] = [
  { id: 'W-101', affiliateName: 'John Doe', affiliateEmail: 'john@example.com', amount: 150.00, method: 'paypal', accountDetails: 'john@paypal.com', status: 'pending', date: '2023-10-08' },
  { id: 'W-102', affiliateName: 'Jane Smith', affiliateEmail: 'jane@test.com', amount: 500.00, method: 'bank', accountDetails: 'GB29384238', status: 'approved', date: '2023-10-07' },
  { id: 'W-103', affiliateName: 'Mike Ross', affiliateEmail: 'mike@law.com', amount: 1200.00, method: 'bkash', accountDetails: '0170000000', status: 'paid', date: '2023-10-01' },
];

export const MOCK_USER = {
  uid: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.AFFILIATE,
  affiliate_id: 'aff_john_123',
  balance: 1250.50,
  avatar: 'https://picsum.photos/100/100'
};