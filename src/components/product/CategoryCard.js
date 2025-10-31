// src/components/product/CategoryCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getColoredPlaceholder } from '../../utils/helpers';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  // Debug logging
  console.log('🎯 CategoryCard rendering:', {
    name: category.name,
    image_url: category.image_url,
    image: category.image,
    hasImageUrl: !!category.image_url,
    hasImage: !!category.image,
    finalImageSrc: category.image_url || category.image,
    fullCategory: category
  });

  const handleCategoryClick = () => {
    navigate(`/search?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <Card 
      className="text-center h-100 category-card shadow-sm border-0 overflow-hidden"
      onClick={handleCategoryClick}
      style={{ 
        cursor: 'pointer', 
        transition: 'all 0.2s ease',
        minHeight: '160px',
        borderRadius: '16px',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
    >
      {/* Full-size background image */}
      <div 
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '160px'
        }}
      >
        <img 
          src={category.image_url || category.image} 
          alt={category.name}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onLoad={(e) => {
            console.log('✅ Image loaded successfully for:', category.name, 'URL:', e.target.src);
          }}
          onError={(e) => {
            console.log('❌ Image failed to load for:', category.name);
            console.log('   - Original URL:', category.image_url || category.image);
            console.log('   - Failed URL:', e.target.src);
            console.log('   - Error event:', e);
            
            // Try to load the image again with a direct fetch to see what the error is
            if (category.image_url) {
              fetch(category.image_url)
                .then(response => {
                  console.log('   - Fetch test status:', response.status, response.statusText);
                  if (!response.ok) {
                    console.log('   - Fetch failed with status:', response.status);
                  }
                })
                .catch(fetchError => {
                  console.log('   - Fetch error:', fetchError.message);
                });
            }
            
            e.target.src = getColoredPlaceholder(300, 300, category.name.charAt(0), '#ffe01b', '#000000');
          }}
        />
        
        {/* Gradient overlay for text readability */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            padding: '30px 10px 12px 10px',
            zIndex: 1
          }}
        >
          <Card.Title 
            className="mb-0 text-center" 
            style={{ 
              fontSize: '0.9rem',
              fontWeight: '700',
              lineHeight: '1.3',
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '0.3px'
            }}
          >
            {category.name}
          </Card.Title>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;