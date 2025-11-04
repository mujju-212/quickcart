import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ProgressBar, Spinner } from 'react-bootstrap';
import analyticsService from '../../../services/analyticsService';

const CategorySales = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, []);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      const response = await analyticsService.getCategoryPerformance();
      console.log('📂 Category Performance Response:', response);
      
      if (response.success && response.data) {
        const categories = response.data;
        console.log('📂 Categories Count:', categories.length);
        console.log('📂 Categories Data:', categories);
        
        const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);
        console.log('💰 Total Category Revenue:', totalRevenue);
        
        // Transform data with percentage and icon
        const iconMap = {
          'Fruits': 'apple-alt',
          'Vegetables': 'carrot',
          'Dairy': 'cheese',
          'Bakery': 'bread-slice',
          'Snacks': 'cookie',
          'Beverages': 'coffee',
          'Personal Care': 'pump-soap',
          'Household': 'home'
        };
        
        const colorMap = ['#28a745', '#ffe01b', '#17a2b8', '#dc3545', '#6f42c1', '#fd7e14'];
        
        const transformed = categories.slice(0, 6).map((cat, index) => ({
          name: cat.name,
          sales: totalRevenue > 0 ? Math.round((cat.revenue / totalRevenue) * 100) : 0,
          revenue: cat.revenue,
          itemsSold: cat.unitsSold,
          orderCount: cat.orderCount,
          productCount: cat.productCount,
          color: colorMap[index % colorMap.length],
          icon: iconMap[cat.name] || iconMap[Object.keys(iconMap).find(key => cat.name.includes(key))] || 'box'
        }));
        
        console.log('📂 Transformed Categories (showing top 6):', transformed);
        setCategoryData(transformed);
      }
    } catch (error) {
      console.error('Error loading category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = categoryData.reduce((sum, cat) => sum + cat.revenue, 0);

  return (
    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '15px' }}>
      <Card.Header 
        className="bg-white border-0"
        style={{ 
          borderRadius: '15px 15px 0 0',
          padding: '20px'
        }}
      >
        <div>
          <h5 className="mb-1" style={{ color: '#333', fontWeight: 'bold' }}>
            <i className="fas fa-chart-pie me-2" style={{ color: '#ffe01b' }}></i>
            Category Performance
          </h5>
          <small className="text-muted">Sales distribution by category</small>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading categories...</p>
          </div>
        ) : categoryData.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
            <p className="text-muted">No category data available</p>
          </div>
        ) : (
          <>
            {categoryData.map((category, index) => (
              <div key={index} className="mb-4">
                <Row className="align-items-center mb-2">
                  <Col xs={7}>
                    <div className="d-flex align-items-center">
                      <div 
                        className="d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: `${category.color}20`,
                          borderRadius: '8px'
                        }}
                      >
                        <i className={`fas fa-${category.icon}`} style={{ color: category.color, fontSize: '14px' }}></i>
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: '#333' }}>
                        {category.name}
                      </span>
                    </div>
                  </Col>
                  <Col xs={5} className="text-end">
                    <div>
                      <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '13px' }}>
                        ₹{(category.revenue / 1000).toFixed(1)}K
                      </span>
                      <span className="ms-2 badge" style={{ 
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {category.sales}%
                      </span>
                    </div>
                  </Col>
                </Row>
                <ProgressBar 
                  now={category.sales} 
                  style={{ 
                    height: '10px', 
                    borderRadius: '10px',
                    backgroundColor: '#f0f0f0'
                  }}
                >
                  <ProgressBar 
                    now={category.sales} 
                    style={{ 
                      backgroundColor: category.color,
                      borderRadius: '10px',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </ProgressBar>
              </div>
            ))}
          </>
        )}
        
        <div className="mt-4 pt-3" style={{ borderTop: '2px solid #f0f0f0' }}>
          <Row className="text-center">
            <Col xs={6} className="border-end">
              <div className="mb-1">
                <i className="fas fa-tags text-warning me-1"></i>
                <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>{categoryData.length}</span>
              </div>
              <small className="text-muted" style={{ fontSize: '11px' }}>Top Categories</small>
            </Col>
            <Col xs={6}>
              <div className="mb-1">
                <i className="fas fa-rupee-sign text-success me-1"></i>
                <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '16px' }}>
                  ₹{(totalRevenue / 1000).toFixed(0)}K
                </span>
              </div>
              <small className="text-muted" style={{ fontSize: '11px' }}>Items Revenue</small>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CategorySales;