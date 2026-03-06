import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@utils/constants';
import productService, { Product, ProductFilters } from '@services/productService';

/**
 * Fetch all products with optional filters.
 */
export function useProducts(filters?: ProductFilters) {
  return useQuery<Product[]>({
    queryKey: [...QUERY_KEYS.products, filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single product by ID.
 */
export function useProduct(productId: number) {
  return useQuery<Product>({
    queryKey: QUERY_KEYS.product(productId),
    queryFn: () => productService.getProductById(productId),
    enabled: productId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch products by category name.
 */
export function useProductsByCategory(categoryName: string) {
  return useQuery<Product[]>({
    queryKey: QUERY_KEYS.categoryProducts(categoryName.length),
    queryFn: () => productService.getProductsByCategory(categoryName),
    enabled: categoryName.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch related products.
 */
export function useRelatedProducts(productId: number, limit: number = 4) {
  return useQuery<Product[]>({
    queryKey: QUERY_KEYS.relatedProducts(productId),
    queryFn: () => productService.getRelatedProducts(productId, limit),
    enabled: productId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search products by query string.
 */
export function useSearchProducts(query: string) {
  return useQuery<Product[]>({
    queryKey: QUERY_KEYS.searchProducts(query),
    queryFn: () => productService.searchProducts(query),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}
