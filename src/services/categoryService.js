import cacheUtils from '../utils/cacheUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class CategoryService {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Development mode flag - set to true to skip API calls entirely
    this.isDevelopmentMode = process.env.NODE_ENV === 'development' && 
                             process.env.REACT_APP_USE_MOCK_DATA !== 'false';
    this.backendAvailable = false; // Track if backend is available
  }

  clearOldData() {
    // Remove old localStorage category data to ensure we use proper placeholders
    const keysToRemove = ['categories'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared old ${key} from localStorage`);
      }
    });
    
    // Initialize with proper placeholder images
    this.initializeData();
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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Category API request failed:', error);
      throw error;
    }
  }

  initializeData() {
    // Import helper for placeholder images
    const { getColoredPlaceholder } = require('../utils/helpers');
    
    // Initialize with default categories using proper placeholders
    const defaultCategories = [
      {
        id: '1',
        name: 'Fruits & Vegetables',
        image: getColoredPlaceholder('Fruits & Vegetables', '#4CAF50'),
        status: 'active',
        productsCount: 20
      },
      {
        id: '2',
        name: 'Dairy & Breakfast',
        image: getColoredPlaceholder('Dairy & Breakfast', '#FF9800'),
        status: 'active',
        productsCount: 15
      },
      {
        id: '3',
        name: 'Beverages',
        image: getColoredPlaceholder('Beverages', '#2196F3'),
        status: 'active',
        productsCount: 15
      },
      {
        id: '4',
        name: 'Snacks & Munchies',
        image: getColoredPlaceholder('Snacks & Munchies', '#E91E63'),
        status: 'active',
        productsCount: 15
      },
      {
        id: '5',
        name: 'Bakery & Biscuits',
        image: getColoredPlaceholder('Bakery & Biscuits', '#795548'),
        status: 'active',
        productsCount: 10
      },
      {
        id: '6',
        name: 'Personal Care',
        image: getColoredPlaceholder('Personal Care', '#9C27B0'),
        status: 'active',
        productsCount: 10
      },
      {
        id: '7',
        name: 'Home Care',
        image: getColoredPlaceholder('Home Care', '#607D8B'),
        status: 'active',
        productsCount: 10
      },
      {
        id: '8',
        name: 'Baby Care',
        image: getColoredPlaceholder('Baby Care', '#FFEB3B'),
        status: 'active',
        productsCount: 5
      },
      {
        id: '9',
        name: 'Instant & Frozen Food',
        image: getColoredPlaceholder('Instant & Frozen Food', '#00BCD4'),
        status: 'active',
        productsCount: 8
      }
    ];
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }

  initializeWithConstants(constantsCategories) {
    // This method is kept for backwards compatibility but should not override existing data
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories || storedCategories === 'undefined') {
      // Only initialize if no data exists
      localStorage.setItem('categories', JSON.stringify(constantsCategories));
      this.triggerCategoriesUpdate();
    }
    // If data exists, don't override it - preserve user-added categories
  }

  async getAllCategories() {
    try {
      return await cacheUtils.getOrFetch('categories:all', async () => {
        const response = await this.makeRequest('/categories');
        this.backendAvailable = true;
        return response.categories || [];
      }, 60 * 1000);
    } catch (error) {
      this.backendAvailable = false;
      console.error('Failed to load categories:', error);
      return [];
    }
  }

  async getCategoryById(id) {
    try {
      const response = await this.makeRequest(`/categories/${id}`);
      return response.category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  async getActiveCategories() {
    try {
      return await cacheUtils.getOrFetch('categories:active', async () => {
        return this.makeRequest('/categories');
      }, 60 * 1000);
    } catch (error) {
      console.error('Failed to load active categories:', error);
      return { success: false, categories: [], error: error.message };
    }
  }

  async getAllCategoriesAdmin() {
    try {
      console.log('🔐 Calling admin categories API...');
      const response = await this.makeRequest('/categories/admin');
      console.log('✅ Admin categories API response:', response);
      return response; // Return full response object with all categories
    } catch (error) {
      console.error('❌ Error fetching admin categories from API:', error);
      return { success: false, categories: [], error: error.message };
    }
  }

  async createCategory(categoryData) {
    try {
      console.log('🆕 Creating category via API:', categoryData);
      const response = await this.makeRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
      
      this.backendAvailable = true;
      console.log('✅ Category created successfully:', response);
      cacheUtils.invalidatePattern('categories:');
      cacheUtils.invalidatePattern('products:');
      
      // Trigger custom event to notify other components
      this.triggerCategoriesUpdate();
      
      return response.category;
    } catch (error) {
      console.error('❌ Failed to create category via API:', error);
      this.backendAvailable = false;
      throw error;
    }
  }

  async updateCategory(categoryId, updateData) {
    try {
      console.log('🔄 Updating category via API:', categoryId, updateData);
      const response = await this.makeRequest(`/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      this.backendAvailable = true;
      console.log('✅ Category updated successfully:', response);
      cacheUtils.invalidatePattern('categories:');
      cacheUtils.invalidatePattern('products:');
      
      // Trigger custom event to notify other components
      this.triggerCategoriesUpdate();
      
      return response.category;
    } catch (error) {
      console.error('❌ Failed to update category via API:', error);
      this.backendAvailable = false;
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      console.log('🗑️ Deleting category via API:', categoryId);
      const response = await this.makeRequest(`/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      this.backendAvailable = true;
      console.log('✅ Category deleted successfully:', response);
      cacheUtils.invalidatePattern('categories:');
      cacheUtils.invalidatePattern('products:');
      
      // Trigger custom event to notify other components
      this.triggerCategoriesUpdate();
      
      return { success: true, message: response.message };
    } catch (error) {
      console.error('❌ Failed to delete category via API:', error);
      this.backendAvailable = false;
      throw error;
    }
  }

  async updateProductCount(categoryId, count) {
    const categories = await this.getAllCategories();
    const categoryIndex = categories.findIndex(category => category.id === categoryId);
    
    if (categoryIndex !== -1) {
      categories[categoryIndex].productsCount = count;
      localStorage.setItem('categories', JSON.stringify(categories));
      return categories[categoryIndex];
    }
    
    return null;
  }

  generateCategoryId() {
    return 'cat' + Date.now() + Math.random().toString(36).substr(2, 5);
  }

  triggerCategoriesUpdate() {
    // Trigger a custom event to notify components that categories have been updated
    const event = new CustomEvent('categoriesUpdated');
    window.dispatchEvent(event);
  }

  updateProductsCategory(oldCategoryName, newCategoryName) {
    console.log('🔄 updateProductsCategory called:', { oldCategoryName, newCategoryName });
    
    // Update all products that reference the old category name
    const products = localStorage.getItem('products');
    console.log('📦 Products in localStorage:', products ? 'Found' : 'Not found');
    
    if (products) {
      try {
        const productsArray = JSON.parse(products);
        console.log('📦 Total products:', productsArray.length);
        
        const productsToUpdate = productsArray.filter(product => product.category === oldCategoryName);
        console.log('📦 Products matching old category name:', productsToUpdate.length);
        
        const updatedProducts = productsArray.map(product => {
          if (product.category === oldCategoryName) {
            console.log('🔄 Updating product:', product.name, 'from', oldCategoryName, 'to', newCategoryName);
            return { ...product, category: newCategoryName };
          }
          return product;
        });
        
        const updatedCount = updatedProducts.filter(p => p.category === newCategoryName).length;
        console.log('✅ Products now in new category:', updatedCount);
        
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        console.log(`✅ Updated ${updatedCount} products from category "${oldCategoryName}" to "${newCategoryName}"`);
      } catch (error) {
        console.error('❌ Error updating products category:', error);
      }
    }
  }

  async getCategoryStats() {
    const categories = await this.getAllCategories();
    const totalProducts = categories.reduce((sum, category) => sum + (category.productsCount || 0), 0);
    
    return {
      totalCategories: categories.length,
      activeCategories: categories.filter(c => c.status === 'active').length,
      totalProducts,
      averageProductsPerCategory: categories.length > 0 ? Math.round(totalProducts / categories.length) : 0
    };
  }
}

export default new CategoryService();