import { Product, AffiliateStat, Order, UserRole, WithdrawRequest, AppSettings } from './types';

export const APP_NAME = "E2S Shop";
export const CURRENCY = "৳"; // Changed to Taka symbol as context implies BD

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "E2S Shop & Affiliates",
  currency: "৳",
  taxRate: 0.00,
  shippingInsideCity: 60,
  shippingOutsideCity: 120,
  codEnabled: true,
  maintenanceMode: false,
  globalCommission: 0.10
};

// Products (Empty for production/real data integration)
export const PRODUCTS: Product[] = [];

// Affiliate Stats (Empty)
export const AFFILIATE_STATS: AffiliateStat[] = [];

// Orders (Empty)
export const MOCK_ORDERS: Order[] = [];

// Withdraw Requests (Empty)
export const MOCK_WITHDRAWS: WithdrawRequest[] = [];