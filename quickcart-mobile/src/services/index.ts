export { default as api } from './api';
export type { ApiResponse, PaginatedResponse } from './api';

export { default as authService } from './authService';
export type { User, AuthResult, OtpStatus } from './authService';

export { default as productService } from './productService';
export type { Product, ProductFilters } from './productService';

export { default as cartService } from './cartService';
export type { CartItem, CartData } from './cartService';

export { default as orderService } from './orderService';
export type { Order, OrderItem, OrderTimelineEntry, CreateOrderPayload } from './orderService';

export { default as wishlistService } from './wishlistService';
export type { WishlistItem } from './wishlistService';

export { default as categoryService } from './categoryService';
export type { Category } from './categoryService';

export { default as offerService } from './offerService';
export type { Offer, ValidateOfferResult } from './offerService';

export { default as reviewService } from './reviewService';
export type { Review, ReviewStats, ProductReviewsResult } from './reviewService';

export { default as bannerService } from './bannerService';
export type { Banner } from './bannerService';

export { default as addressService } from './addressService';
export type { Address, CreateAddressPayload, UpdateAddressPayload } from './addressService';
