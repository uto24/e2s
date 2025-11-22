import { Product, AffiliateStat, Order, UserRole } from './types';

export const APP_NAME = "E2S Shop";
export const CURRENCY = "$";

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
    commission_rate: 0.10
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
    commission_rate: 0.15
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
    commission_rate: 0.08
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
    commission_rate: 0.05
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
    stock: 25,
    commission_rate: 0.12
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
  { id: 'ORD-001', customer: 'Alice Johnson', total: 299.99, status: 'delivered', date: '2023-10-01' },
  { id: 'ORD-002', customer: 'Bob Smith', total: 49.99, status: 'processing', date: '2023-10-05' },
  { id: 'ORD-003', customer: 'Charlie Brown', total: 129.99, status: 'pending', date: '2023-10-07' },
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
