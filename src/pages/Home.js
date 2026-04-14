/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import AppLoadingScreen from '../components/common/AppLoadingScreen';
import useAutoRefresh from '../hooks/useAutoRefresh';
import '../assets/styles/mobile-home.css';

const HOME_MIN_LOADER_MS = 900;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [popularProducts, setPopularProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  const buildProductState = useCallback((productResponse) => {
    if (!productResponse || !Array.isArray(productResponse.products)) {
      return {
        allProducts: [],
        popular: [],
        productsByCategory: {}
      };
    }

    const allProducts = productResponse.products.filter(
      (product) => product.stock > 0 && product.status !== 'out_of_stock'
    );

    const productsByCategory = {};
    allProducts.forEach((product) => {
      const categoryName = product.category_name || product.category || 'Uncategorized';
      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [];
      }
      productsByCategory[categoryName].push(product);
    });

    return {
      allProducts,
      popular: allProducts.slice(0, 12),
      productsByCategory
    };
  }, []);

  // Load all data function
  const loadAllData = useCallback(async () => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    try {
      const [bannersResult, offersResult, productsResult, categoriesResult] = await Promise.allSettled([
        bannerService.getActiveBanners(),
        offersService.getActiveOffers(),
        productService.getAllProducts(),
        categoryService.getActiveCategories(),
      ]);

      const bannersData = bannersResult.status === 'fulfilled' ? bannersResult.value : [];
      const offersData = offersResult.status === 'fulfilled' ? offersResult.value : [];
      const productsResponse = productsResult.status === 'fulfilled' ? productsResult.value : { products: [] };
      const categoriesResponse = categoriesResult.status === 'fulfilled'
        ? categoriesResult.value
        : { categories: [] };

      const { allProducts, popular, productsByCategory } = buildProductState(productsResponse);

      const categoriesList = Array.isArray(categoriesResponse?.categories)
        ? categoriesResponse.categories.filter(
            (category) => (category.products_count || category.product_count || 0) > 0
          )
        : [];

      setBanners(Array.isArray(bannersData) ? bannersData : []);
      setOffers(Array.isArray(offersData) ? offersData : []);
      setProducts(allProducts);
      setPopularProducts(popular);
      setCategoryProducts(productsByCategory);
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      isLoadingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildProductState]);

  // Keep data fresh without hammering the backend.
  useAutoRefresh(loadAllData, 60000, true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const loadStart = Date.now();
      await loadAllData();

      const elapsed = Date.now() - loadStart;
      if (elapsed < HOME_MIN_LOADER_MS) {
        await new Promise((resolve) => {
          setTimeout(resolve, HOME_MIN_LOADER_MS - elapsed);
        });
      }

      setLoading(false);
    };
    
    loadData();

    // Listen for real-time product updates from admin
    const handleProductsUpdate = (event) => {
      const allProducts = Array.isArray(event?.detail?.products) ? event.detail.products : [];
      
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
        loadAllData();
      }
      if (e.key === 'products') {
        loadAllData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    // Also listen for a custom event that we can trigger from the same tab
    const handleCategoriesUpdate = () => {
      loadAllData();
    };
    
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <AppLoadingScreen message="Bringing fresh groceries to your screen" fullScreen={false} />;
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
                <div key={offer.id} className="col-12 col-md-4">
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
              maxProducts={12}
              showSeeAll={true}
            />
          );
        })}
      </Container>
    </div>
  );
};

export default Home;