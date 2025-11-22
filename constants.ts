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
    endTime: tomorrow.toISOString()
  }
};

// Products (Empty for production/real data integration)
export const PRODUCTS: Product[] = [];

// Affiliate Stats (Empty)
export const AFFILIATE_STATS: AffiliateStat[] = [];

// Orders (Empty)
export const MOCK_ORDERS: Order[] = [];

// Withdraw Requests (Empty)
export const MOCK_WITHDRAWS: WithdrawRequest[] = [];