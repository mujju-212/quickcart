import cacheUtils from '../utils/cacheUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ProductService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isDevelopmentMode = process.env.NODE_ENV === 'development' && 
                             process.env.REACT_APP_USE_MOCK_DATA !== 'false';
    this.backendAvailable = false;
    
    // Clear any old localStorage data to ensure we use API
    this.clearOldData();
  }

  clearOldData() {
    // Remove old localStorage product data to force API usage
    const keysToRemove = ['products', 'categories', 'featuredProducts'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared old ${key} from localStorage`);
      }
    });
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const token = localStorage.getItem('authToken');
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      if (!response.ok) {
        // Try to get error message from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
          console.error('❌ API Error Response:', errorData);
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getAllProducts() {
    return cacheUtils.getOrFetch('products:all', async () => {
      console.log('🌐 Loading products from API...');
      const response = await this.makeRequest('/products');
      this.backendAvailable = true;
      console.log('✅ Products loaded from API:', response.products?.length || 0);
      return response;
    });
  }

  async getAllProductsForAdmin() {
    // For admin panel - include out of stock products
    return cacheUtils.getOrFetch('products:admin:all', async () => {
      console.log('🌐 Loading all products (including out of stock) for admin...');
      const response = await this.makeRequest('/products?include_out_of_stock=true');
      this.backendAvailable = true;
      console.log('✅ All products loaded for admin:', response.products?.length || 0);
      return response;
    });
  }

  async getProductById(id) {
    return cacheUtils.getOrFetch(`product:${id}`, async () => {
      const response = await this.makeRequest(`/products/${id}`);
      return response;
    }, 10 * 60 * 1000); // Cache for 10 minutes
  }

  async getProductsByCategory(categoryId) {
    return cacheUtils.getOrFetch(`products:category:${categoryId}`, async () => {
      const response = await this.makeRequest(`/products?category=${categoryId}`);
      return response.products || [];
    });
  }

  async searchProducts(query) {
    // Don't cache search results as they change frequently
    try {
      const response = await this.makeRequest(`/products/search?q=${encodeURIComponent(query)}`);
      return response.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getAllCategories() {
    return cacheUtils.getOrFetch('categories:all', async () => {
      const response = await this.makeRequest('/categories');
      return response.categories || [];
    });
  }

  async addProduct(productData) {
    try {
      console.log('🆕 Creating product via API:', productData);
      const response = await this.makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      
      this.backendAvailable = true;
      console.log('✅ Product created successfully:', response);
      return response.product;
    } catch (error) {
      console.error('❌ Failed to create product via API:', error);
      this.backendAvailable = false;
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      console.log('🔄 Updating product via API:', id, updatedProduct);
      const response = await this.makeRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedProduct)
      });
      
      this.backendAvailable = true;
      console.log('✅ Product updated successfully:', response);
      return response.product;
    } catch (error) {
      console.error('❌ Failed to update product via API:', error);
      this.backendAvailable = false;
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await this.makeRequest(`/products/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async addCategory(categoryData) {
    try {
      const response = await this.makeRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
      return response.category;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  async updateCategory(id, updatedCategory) {
    try {
      const response = await this.makeRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedCategory)
      });
      return response.category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      await this.makeRequest(`/categories/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async getFeaturedProducts(limit = 20) {
    try {
      const response = await this.makeRequest(`/products?limit=${limit}&featured=true`);
      return response.products || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  async getRelatedProducts(productId, limit = 4) {
    try {
      const response = await this.makeRequest(`/products/${productId}/related?limit=${limit}`);
      return response; // Return full response object
    } catch (error) {
      console.error('Error fetching related products:', error);
      return { success: false, products: [], error: error.message };
    }
  }
}

export default new ProductService();