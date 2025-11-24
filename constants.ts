
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

// Rich Sample Products with Images, Specs, and Reviews
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Premium Wireless Noise Cancelling Headphones",
    slug: "wireless-headphones",
    description: "Experience world-class silence with our new noise-cancelling headphones. Designed for comfort and high-fidelity audio, these headphones are perfect for travel, work, or relaxing. Features a 30-hour battery life and quick charging.",
    price: 3500,
    wholesalePrice: 2800,
    sale_price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1524678606372-569f7ec1911b?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.8,
    reviews_count: 120,
    reviews: [
        { id: "r1", userId: "u1", userName: "Rahim A.", rating: 5, comment: "Amazing sound quality! Bass is perfect.", date: "10 Oct 2023" },
        { id: "r2", userId: "u2", userName: "Karim B.", rating: 4, comment: "Battery life is good, but a bit heavy.", date: "12 Oct 2023" }
    ],
    stock: 50,
    status: 'active',
    shippingFees: { inside: 60, outside: 120 },
    isCodAvailable: true,
    specifications: {
        "Bluetooth": "5.0",
        "Battery Life": "30 Hours",
        "Noise Cancellation": "Active ANC",
        "Weight": "250g",
        "Warranty": "1 Year"
    }
  },
  {
    id: "p2",
    title: "Smart Fitness Watch Series 5",
    slug: "fitness-watch",
    description: "Track your health and fitness with this advanced smartwatch. Monitors heart rate, sleep, and steps. Water-resistant up to 50 meters.",
    price: 2200,
    wholesalePrice: 1800,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.5,
    reviews_count: 85,
    stock: 30,
    status: 'active',
    shippingFees: { inside: 60, outside: 120 },
    isCodAvailable: true,
    specifications: {
        "Display": "AMOLED",
        "Water Resistance": "5ATM",
        "Sensors": "Heart Rate, SpO2",
        "Battery": "7 Days"
    }
  },
  {
    id: "p3",
    title: "Cotton T-Shirt Bundle (Pack of 3)",
    slug: "tshirt-bundle",
    description: "Comfortable 100% cotton t-shirts in various colors. Breathable fabric perfect for summer.",
    price: 1200,
    wholesalePrice: 900,
    sale_price: 999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
    images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.2,
    reviews_count: 200,
    stock: 100,
    status: 'active',
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Gray"],
    shippingFees: { inside: 60, outside: 120 },
    isCodAvailable: true,
    specifications: {
        "Material": "100% Cotton",
        "Fit": "Regular Fit",
        "Wash Care": "Machine Wash",
        "Origin": "Bangladesh"
    }
  },
  {
    id: "p4",
    title: "Organic Vitamin C Face Serum",
    slug: "face-serum",
    description: "Rejuvenate your skin with our organic serum. Reduces dark spots and brightens skin tone within 2 weeks.",
    price: 1500,
    wholesalePrice: 1100,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80",
    images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.9,
    reviews_count: 50,
    stock: 20,
    status: 'active',
    shippingFees: { inside: 50, outside: 100 },
    isCodAvailable: false,
    specifications: {
        "Volume": "30ml",
        "Key Ingredients": "Vitamin C, Hyaluronic Acid",
        "Skin Type": "All Skin Types",
        "Paraben Free": "Yes"
    }
  }
];

// Affiliate Stats (Empty)
export const AFFILIATE_STATS: AffiliateStat[] = [];

// Orders (Empty)
export const MOCK_ORDERS: Order[] = [];

// Withdraw Requests (Empty)
export const MOCK_WITHDRAWS: WithdrawRequest[] = [];
