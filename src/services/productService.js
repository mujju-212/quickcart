const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ProductService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const response = await this.makeRequest('/products');
      return response; // Return full response object
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, products: [], error: error.message };
    }
  }

  async getProductById(id) {
    try {
      const response = await this.makeRequest(`/products/${id}`);
      return response; // Return full response object
    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, product: null, error: error.message };
    }
  }

  async getProductsByCategory(categoryId) {
    try {
      const response = await this.makeRequest(`/products?category=${categoryId}`);
      return response.products || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async searchProducts(query) {
    try {
      const response = await this.makeRequest(`/products/search?q=${encodeURIComponent(query)}`);
      return response.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getAllCategories() {
    try {
      const response = await this.makeRequest('/categories');
      return response.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async addProduct(productData) {
    try {
      const response = await this.makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      return response.product;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const response = await this.makeRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedProduct)
      });
      return response.product;
    } catch (error) {
      console.error('Error updating product:', error);
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