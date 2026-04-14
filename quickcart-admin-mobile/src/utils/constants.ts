// QuickCart Admin — Constants

declare const __DEV__: boolean;

export const API_BASE_URL = __DEV__
  ? 'http://localhost:5001/api'
  : 'https://quickcart-api-a09g.onrender.com/api';

export const APP_NAME = 'QuickCart Admin';
export const APP_VERSION = '1.0.0';

// Auto-refresh intervals
export const REFRESH_INTERVALS = {
  DASHBOARD: 60_000,       // 60 seconds
  ORDERS: 30_000,          // 30 seconds for order polling
  DEFAULT: 5 * 60_000,     // 5 minutes
} as const;

// Pagination
export const PAGE_SIZE = 20;

// Inactivity timeout (ms)
export const INACTIVITY_TIMEOUT = 30 * 60_000; // 30 minutes

// Order statuses
export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  pending: 'clock-outline',
  confirmed: 'check-circle-outline',
  processing: 'cog-outline',
  out_for_delivery: 'truck-delivery-outline',
  delivered: 'check-all',
  cancelled: 'close-circle-outline',
};

// Stock thresholds
export const LOW_STOCK_THRESHOLD = 10;
export const OUT_OF_STOCK_THRESHOLD = 0;
