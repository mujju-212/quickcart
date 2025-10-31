import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BannerCarousel.css';

const BannerCarousel = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!banners || banners.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <div className="banner-carousel">
      {/* Banner Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id || index}
          className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
        >
          <img
            src={banner.image_url}
            alt={banner.title}
            className="banner-image"
          />
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <h1 className="banner-title">{banner.title}</h1>
            <p className="banner-subtitle">{banner.subtitle}</p>
            <button 
              className="banner-button"
              onClick={() => navigate('/search')}
            >
              Shop Now
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button 
            className="carousel-nav carousel-nav-prev"
            onClick={handlePrev}
            aria-label="Previous banner"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="carousel-nav carousel-nav-next"
            onClick={handleNext}
            aria-label="Next banner"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* Indicator Dots - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="carousel-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
