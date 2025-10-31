import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import categoryService from '../services/categoryService';
import productService from '../services/productService';
import bannerService from '../services/bannerService';
import offersService from '../services/offersService';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import CategoryGrid from '../components/product/CategoryGrid';
import CategoryProductSection from '../components/product/CategoryProductSection';
import BannerCarousel from '../components/common/BannerCarousel';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [popularProducts, setPopularProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        console.log('🎨 Loading banners from API...');
        const bannersData = await bannerService.getActiveBanners();
        console.log('🎨 Banners loaded:', bannersData);
        setBanners(bannersData);
      } catch (error) {
        console.error('❌ Error loading banners:', error);
        setBanners([]);
      }
    };

    const loadOffers = async () => {
      try {
        console.log('🎁 Loading offers from API...');
        const offersData = await offersService.getActiveOffers();
        console.log('🎁 Offers loaded:', offersData);
        setOffers(offersData);
      } catch (error) {
        console.error('❌ Error loading offers:', error);
        setOffers([]);
      }
    };

    const loadCategories = async () => {
      try {
        console.log('🏠 Home page loading categories...');
        
        // Test direct API call for debugging
        try {
          const directResponse = await fetch('http://localhost:5001/api/categories');
          const directData = await directResponse.json();
          console.log('🔍 Direct API test:', directData);
        } catch (directError) {
          console.log('⚠️ Direct API test failed:', directError.message);
        }
        
        // DON'T initialize localStorage - we want to use API data
        // Force clear any existing localStorage data to ensure API is used
        localStorage.removeItem('categories');
        
        const response = await categoryService.getActiveCategories();
        console.log('📂 Categories response:', response);
        console.log('📂 Categories response type:', typeof response);
        console.log('📂 Categories array:', response?.categories);
        
        if (response && response.categories) {
          setCategories(response.categories);
          console.log('📂 Categories loaded successfully:', response.categories.length);
          console.log('📂 First category sample:', response.categories[0]);
        } else {
          console.error('❌ Invalid categories response:', response);
          setCategories([]);
        }
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        setCategories([]);
      }
    };

    const loadProducts = async () => {
      try {
        console.log('🏠 Home page loading products...');
        const response = await productService.getAllProducts();
        console.log('📦 Products response:', response);
        
        if (response && response.products && Array.isArray(response.products)) {
          const allProducts = response.products;
          console.log('📦 Products loaded:', allProducts.length);
          
          // Set all products
          setProducts(allProducts);
          
          // Create popular products (first 12 products)
          setPopularProducts(allProducts.slice(0, 12));
          
          // Group products by category
          const productsByCategory = {};
          allProducts.forEach(product => {
            const categoryName = product.category_name || product.category || 'Uncategorized';
            if (!productsByCategory[categoryName]) {
              productsByCategory[categoryName] = [];
            }
            productsByCategory[categoryName].push(product);
          });
          
          setCategoryProducts(productsByCategory);
          console.log('📦 Products grouped by category:', Object.keys(productsByCategory));
        } else {
          console.error('❌ Invalid products response:', response);
          setProducts([]);
          setPopularProducts([]);
          setCategoryProducts({});
        }
      } catch (error) {
        console.error('❌ Error loading products:', error);
        setProducts([]);
        setPopularProducts([]);
        setCategoryProducts({});
      }
    };

    // Add debugging function to window for manual testing
    window.testCategoriesAPI = async () => {
      try {
        console.log('🧪 Manual API test started...');
        const response = await fetch('http://localhost:5001/api/categories');
        const data = await response.json();
        console.log('🧪 Manual API test result:', data);
        return data;
      } catch (error) {
        console.log('🧪 Manual API test failed:', error);
        return null;
      }
    };

    // Clear localStorage to force API usage
    console.log('🗑️ Clearing localStorage to force API calls...');
    localStorage.removeItem('categories');

    // Initial load
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadBanners(), loadOffers(), loadCategories(), loadProducts()]);
      setLoading(false);
    };
    
    loadData();

    // Listen for real-time product updates from admin
    const handleProductsUpdate = (event) => {
      console.log('🔄 Home: Products updated from admin', event.detail.products.length);
      const allProducts = event.detail.products;
      
      // Update all products
      setProducts(allProducts);
      
      // Update popular products
      setPopularProducts(allProducts.slice(0, 12));
      
      // Re-group products by category
      const productsByCategory = {};
      allProducts.forEach(product => {
        if (!productsByCategory[product.category]) {
          productsByCategory[product.category] = [];
        }
        productsByCategory[product.category].push(product);
      });
      
      setCategoryProducts(productsByCategory);
    };

    // Listen for localStorage changes (when categories are updated from admin)
    const handleStorageChange = (e) => {
      if (e.key === 'categories') {
        console.log('📢 Categories updated, refreshing...');
        loadCategories();
      }
      if (e.key === 'products') {
        console.log('📢 Products updated, refreshing...');
        loadProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    // Also listen for a custom event that we can trigger from the same tab
    const handleCategoriesUpdate = () => {
      console.log('📢 Categories updated (same tab), refreshing...');
      loadCategories();
    };
    
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="home-page">
      <Container>
        {/* Banner Carousel */}
        <BannerCarousel banners={banners} />
        {/* Categories Section */}
        <section className="categories-section my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title fw-bold mb-0">Shop by Category</h2>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/search?category=all')}
            >
              View All
            </button>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* Special Offers Section */}
        <section className="offers-section my-5">
          <h2 className="section-title fw-bold mb-4">Special Offers</h2>
          <div className="row g-3">
            {offers && offers.length > 0 ? (
              offers.map((offer) => (
                <div key={offer.id} className="col-md-4">
                  <div className="card h-100 border-0 position-relative overflow-hidden" style={{ cursor: 'pointer' }}>
                    <img 
                      src={offer.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop&q=80'} 
                      alt={offer.title}
                      className="card-img-top"
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                    <div className="card-img-overlay d-flex flex-column justify-content-end text-white p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)' }}>
                      <h5 className="card-title fw-bold mb-2">{offer.title}</h5>
                      <h3 className="fw-bold text-warning mb-2">
                        {offer.discount_type === 'percentage' 
                          ? `${offer.discount_value}% OFF` 
                          : offer.discount_type === 'fixed'
                          ? `₹${offer.discount_value} OFF`
                          : 'FREE DELIVERY'}
                      </h3>
                      <p className="card-text small mb-3">{offer.description}</p>
                      <button 
                        className="btn btn-light fw-bold"
                        style={{ 
                          width: 'fit-content',
                          padding: '10px 28px',
                          backgroundColor: 'white',
                          color: '#333',
                          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                          border: '2px solid #f8cb46',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f8cb46';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 5px 15px rgba(248, 203, 70, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
                        }}
                        onClick={() => navigate('/search')}
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-4">
                <p className="text-muted">No active offers at the moment</p>
              </div>
            )}
          </div>
        </section>

        {/* Popular Products Section */}
        <CategoryProductSection
          categoryName="Popular Products"
          products={popularProducts}
          maxProducts={12}
          showSeeAll={true}
          className="popular-products-section"
        />

        {/* Category-wise Product Sections */}
        {categories.filter(category => category.status === 'active').map((category) => {
          const categoryProductsList = categoryProducts[category.name] || [];
          
          if (categoryProductsList.length === 0) {
            return null;
          }

          return (
            <CategoryProductSection
              key={category.id}
              categoryName={category.name}
              products={categoryProductsList}
              maxProducts={6}
              showSeeAll={true}
            />
          );
        })}
      </Container>
    </div>
  );
};

export default Home;