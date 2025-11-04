import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './CategoryProductSection.css';

const CategoryProductSection = ({ 
  categoryName, 
  products, 
  showSeeAll = true, 
  maxProducts = 12,
  className = "",
  loading = false
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className={`category-products-section my-5 ${className}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title fw-bold mb-0 text-dark">
            {categoryName}
          </h2>
        </div>
        <div className="horizontal-scroll-container">
          <div className="products-scroll-wrapper" ref={scrollContainerRef}>
            {[...Array(maxProducts)].map((_, index) => (
              <div key={index} className="product-scroll-item">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-3">
                    <div className="placeholder-glow">
                      <div className="placeholder bg-light rounded" style={{ height: '120px', width: '100%' }}></div>
                      <div className="placeholder col-8 mt-2"></div>
                      <div className="placeholder col-6 mt-1"></div>
                      <div className="placeholder col-4 mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, maxProducts);

  return (
    <section className={`category-products-section my-5 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title fw-bold mb-0 text-dark">
          {categoryName}
          <span className="text-muted fs-6 fw-normal ms-2">
            ({products.length} items)
          </span>
        </h2>
        {showSeeAll && products.length > maxProducts && (
          <Button 
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/search?category=${encodeURIComponent(categoryName)}`)}
            className="fw-semibold"
          >
            see all
          </Button>
        )}
      </div>
      
      <div className="horizontal-scroll-container">
        {displayProducts.length > 6 && (
          <button 
            className="scroll-btn scroll-btn-left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        
        <div className="products-scroll-wrapper" ref={scrollContainerRef}>
          {displayProducts.map((product) => (
            <div key={product.id} className="product-scroll-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {displayProducts.length > 6 && (
          <button 
            className="scroll-btn scroll-btn-right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoryProductSection;