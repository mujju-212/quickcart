import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaShoppingCart, FaBoxes, FaUsers, FaChartLine } from 'react-icons/fa';

const StatsCards = () => {
  const dashboardStats = {
    totalOrders: 248,
    totalProducts: 1250,
    totalUsers: 2847,
    totalRevenue: 125000
  };

  const statsData = [
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders.toLocaleString(),
      icon: FaShoppingCart,
      color: '#ffe01b',
      bgColor: '#fffbe6',
      growth: '+12.5%',
      growthUp: true,
      subtitle: 'This month'
    },
    {
      title: 'Total Products',
      value: dashboardStats.totalProducts.toLocaleString(),
      icon: FaBoxes,
      color: '#28a745',
      bgColor: '#e8f5e9',
      growth: '+8.2%',
      growthUp: true,
      subtitle: 'In stock'
    },
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers.toLocaleString(),
      icon: FaUsers,
      color: '#17a2b8',
      bgColor: '#e0f7fa',
      growth: '+15.3%',
      growthUp: true,
      subtitle: 'Active users'
    },
    {
      title: 'Total Revenue',
      value: `₹${(dashboardStats.totalRevenue / 1000).toFixed(0)}K`,
      icon: FaChartLine,
      color: '#dc3545',
      bgColor: '#ffebee',
      growth: '+18.7%',
      growthUp: true,
      subtitle: 'This month'
    }
  ];

  return (
    <Row className="mb-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Col md={6} lg={3} key={index} className="mb-3">
            <Card 
              className="shadow-sm border-0 h-100 stats-card" 
              style={{ 
                borderRadius: '15px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div 
                style={{ 
                  height: '5px', 
                  backgroundColor: stat.color,
                  borderRadius: '15px 15px 0 0'
                }}
              />
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{ 
                      backgroundColor: stat.bgColor,
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px'
                    }}
                  >
                    <IconComponent size={24} style={{ color: stat.color }} />
                  </div>
                  <span 
                    className="badge d-flex align-items-center gap-1"
                    style={{ 
                      backgroundColor: stat.growthUp ? '#d4edda' : '#f8d7da',
                      color: stat.growthUp ? '#155724' : '#721c24',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '4px 8px'
                    }}
                  >
                    <i className={`fas fa-arrow-${stat.growthUp ? 'up' : 'down'}`}></i>
                    {stat.growth}
                  </span>
                </div>
                <h2 style={{ color: '#333', fontWeight: 'bold', fontSize: '2.2rem', margin: 0 }}>
                  {stat.value}
                </h2>
                <p className="text-muted mb-1 mt-2" style={{ fontSize: '14px', fontWeight: '600' }}>
                  {stat.title}
                </p>
                <small className="text-muted" style={{ fontSize: '12px' }}>
                  <i className="fas fa-calendar-alt me-1"></i>
                  {stat.subtitle}
                </small>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default StatsCards;