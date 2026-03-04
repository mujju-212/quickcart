// API Configuration
// Use your laptop's WiFi IP so physical devices on the same network can connect
const DEV_HOST = '192.168.1.115'; // ← your laptop's WiFi IP

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:5001/api`
  : 'https://quickcart-api-a09g.onrender.com/api';

// App Info
export const APP_NAME = 'QuickCart';
export const APP_TAGLINE = 'Groceries in 10 minutes';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_cache',
  WISHLIST_DATA: 'wishlist_cache',
  HAS_ONBOARDED: 'has_onboarded',
  SELECTED_ADDRESS: 'selected_address',
  RECENT_SEARCHES: 'recent_searches',
  LOCATION_DATA: 'location_data',
  PUSH_TOKEN: 'push_token',
  THEME_MODE: 'theme_mode',
  VIEW_PREFERENCE: 'view_preference',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  products: ['products'] as const,
  product: (id: number) => ['product', id] as const,
  categories: ['categories'] as const,
  categoryProducts: (id: number) => ['categoryProducts', id] as const,
  cart: ['cart'] as const,
  wishlist: ['wishlist'] as const,
  orders: ['orders'] as const,
  order: (id: number) => ['order', id] as const,
  addresses: ['addresses'] as const,
  banners: ['banners'] as const,
  offers: ['offers'] as const,
  reviews: (productId: number) => ['reviews', productId] as const,
  profile: ['profile'] as const,
  notifications: ['notifications'] as const,
  relatedProducts: (id: number) => ['relatedProducts', id] as const,
  searchProducts: (query: string) => ['searchProducts', query] as const,
} as const;

// Pagination
export const PAGE_SIZE = 20;

// OTP Config
export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;
export const DEMO_OTP = '123456';

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#8B5CF6',
  out_for_delivery: '#06B6D4',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

// Delivery
export const DELIVERY_FEE = 25;
export const FREE_DELIVERY_THRESHOLD = 499;
export const HANDLING_FEE = 5;
export const DELIVERY_TIME_MIN = 10;
export const DELIVERY_TIME_MAX = 15;

// Image Placeholders
export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x200?text=Product';
export const PLACEHOLDER_CATEGORY = 'https://via.placeholder.com/100x100?text=Category';
export const PLACEHOLDER_BANNER = 'https://via.placeholder.com/400x200?text=Banner';

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: { damping: 15, stiffness: 150 },
  springBouncy: { damping: 12, stiffness: 200 },
  springGentle: { damping: 20, stiffness: 100 },
} as const;

// Search
export const SEARCH_DEBOUNCE_MS = 300;
export const MAX_RECENT_SEARCHES = 10;

// Review Ratings
export const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

// Address Types
export const ADDRESS_TYPES = [
  { label: 'Home', icon: 'home', value: 'home' },
  { label: 'Work', icon: 'briefcase', value: 'work' },
  { label: 'Other', icon: 'map-pin', value: 'other' },
] as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: 'banknote', description: 'Pay when your order arrives', enabled: true },
  { id: 'upi', label: 'UPI Payment', icon: 'smartphone', description: 'GPay, PhonePe, Paytm', enabled: false },
  { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card', description: 'Visa, Mastercard, RuPay', enabled: false },
] as const;

// Onboarding slides
export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Fresh Groceries\nat Your Doorstep',
    subtitle: 'Browse thousands of products from your favorite brands',
    description: 'Browse thousands of products from your favorite brands',
    emoji: '🛒',
    animation: 'delivery',
  },
  {
    id: 2,
    title: '10-Minute\nDelivery',
    subtitle: 'Lightning-fast delivery right to your door',
    description: 'Lightning-fast delivery right to your door',
    emoji: '⚡',
    animation: 'speed',
  },
  {
    id: 3,
    title: 'Best Prices,\nBest Quality',
    subtitle: 'Premium quality products at unbeatable prices',
    description: 'Premium quality products at unbeatable prices',
    emoji: '💰',
    animation: 'shopping',
  },
] as const;

// Tab bar search placeholder cycling texts
export const SEARCH_PLACEHOLDERS = [
  'Search for atta, dal, milk...',
  'Search for fruits & vegetables...',
  'Search for snacks & drinks...',
  'Search for dairy products...',
  'Search for personal care...',
];
