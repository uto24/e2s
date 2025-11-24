
import { Product, AffiliateStat, Order, UserRole, WithdrawRequest, AppSettings } from './types';

export const APP_NAME = "ই-শপ";
export const CURRENCY = "৳";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "ই-শপ ও এফিলিয়েট",
  currency: "৳",
  taxRate: 0.00,
  maintenanceMode: false,
  campaign: {
    isActive: true,
    title: "ফ্ল্যাশ সেল!",
    subtitle: "সীমিত সময়ের জন্য বিশেষ মূল্যছাড়",
    endTime: tomorrow.toISOString(),
    gradientFrom: "#16a34a", // green-600
    gradientTo: "#059669"   // emerald-600
  },
  popup: {
    isActive: false,
    title: "বিশেষ অফার!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80",
    link: "/offers"
  }
};

// Sample Products to ensure shop isn't empty
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Premium Wireless Headphones",
    slug: "wireless-headphones",
    description: "High quality wireless headphones with noise cancellation.",
    price: 3500,
    wholesalePrice: 2800,
    sale_price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    reviews_count: 120,
    stock: 50,
    status: 'active',
    shippingFees: { inside: 60, outside: 120 },
    isCodAvailable: true
  },
  {
    id: "p2",
    title: "Smart Fitness Watch",
    slug: "fitness-watch",
    description: "Track your health and fitness with this advanced smartwatch.",
    price: 2200,
    wholesalePrice: 1800,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    rating: 4.5,
    reviews_count: 85,
    stock: 30,
    status: 'active',
    shippingFees: { inside: 60, outside: 120 },
    isCodAvailable: true
  },
  {
    id: "p3",
    title: "Cotton T-Shirt Bundle",
    slug: "tshirt-bundle",
    description: "Comfortable cotton t-shirts in various colors.",
    price: 1200,
    wholesalePrice: 900,
    sale_price: 999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
    rating: 4.2,
    reviews_count: 200,
    stock: 100,
    status: 'active',
    sizes: ["M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    shippingFees: { inside: 60, outside: 120 },
    isCodAvailable: true
  },
  {
    id: "p4",
    title: "Organic Face Serum",
    slug: "face-serum",
    description: "Rejuvenate your skin with our organic serum.",
    price: 1500,
    wholesalePrice: 1100,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviews_count: 50,
    stock: 20,
    status: 'active',
    shippingFees: { inside: 50, outside: 100 },
    isCodAvailable: false
  }
];

// Affiliate Stats (Empty)
export const AFFILIATE_STATS: AffiliateStat[] = [];

// Orders (Empty)
export const MOCK_ORDERS: Order[] = [];

// Withdraw Requests (Empty)
export const MOCK_WITHDRAWS: WithdrawRequest[] = [];
