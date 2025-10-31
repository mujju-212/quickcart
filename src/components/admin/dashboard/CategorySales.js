import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';

const CategorySales = () => {
  const categoryData = [
    { name: 'Fruits & Vegetables', sales: 45, color: '#28a745', revenue: 25000, icon: 'leaf' },
    { name: 'Dairy & Bakery', sales: 30, color: '#ffe01b', revenue: 18000, icon: 'bread-slice' },
    { name: 'Snacks & Beverages', sales: 15, color: '#17a2b8', revenue: 12000, icon: 'cookie' },
    { name: 'Personal Care', sales: 10, color: '#dc3545', revenue: 8000, icon: 'pump-soap' }
  ];

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
        
        <div className="mt-4 pt-3" style={{ borderTop: '2px solid #f0f0f0' }}>
          <Row className="text-center">
            <Col xs={6} className="border-end">
              <div className="mb-1">
                <i className="fas fa-tags text-warning me-1"></i>
                <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>4</span>
              </div>
              <small className="text-muted" style={{ fontSize: '11px' }}>Total Categories</small>
            </Col>
            <Col xs={6}>
              <div className="mb-1">
                <i className="fas fa-rupee-sign text-success me-1"></i>
                <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '16px' }}>
                  ₹{(totalRevenue / 1000).toFixed(0)}K
                </span>
              </div>
              <small className="text-muted" style={{ fontSize: '11px' }}>Total Revenue</small>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CategorySales;