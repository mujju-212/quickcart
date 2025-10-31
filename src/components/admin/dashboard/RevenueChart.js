import React, { useState } from 'react';
import { Card, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState('6months');

  // Mock data for revenue trend
  const revenueData = {
    '6months': [
      { month: 'Jan', revenue: 15000, orders: 45 },
      { month: 'Feb', revenue: 18000, orders: 52 },
      { month: 'Mar', revenue: 22000, orders: 68 },
      { month: 'Apr', revenue: 19000, orders: 58 },
      { month: 'May', revenue: 25000, orders: 75 },
      { month: 'Jun', revenue: 28000, orders: 82 }
    ],
    '3months': [
      { month: 'Apr', revenue: 19000, orders: 58 },
      { month: 'May', revenue: 25000, orders: 75 },
      { month: 'Jun', revenue: 28000, orders: 82 }
    ]
  };

  const currentData = revenueData[timeRange];
  const maxRevenue = Math.max(...currentData.map(d => d.revenue));
  const totalRevenue = currentData.reduce((sum, data) => sum + data.revenue, 0);
  const avgRevenue = totalRevenue / currentData.length;

  return (
    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '15px' }}>
      <Card.Header 
        className="bg-white border-0 d-flex justify-content-between align-items-center"
        style={{ 
          borderRadius: '15px 15px 0 0',
          padding: '20px'
        }}
      >
        <div>
          <h5 className="mb-1" style={{ color: '#333', fontWeight: 'bold' }}>
            <i className="fas fa-chart-line me-2" style={{ color: '#ffe01b' }}></i>
            Revenue Trend
          </h5>
          <small className="text-muted">Sales performance over time</small>
        </div>
        <ButtonGroup size="sm">
          <Button
            variant={timeRange === '3months' ? 'warning' : 'outline-secondary'}
            onClick={() => setTimeRange('3months')}
            style={{
              backgroundColor: timeRange === '3months' ? '#ffe01b' : 'transparent',
              border: timeRange === '3months' ? 'none' : '1px solid #dee2e6',
              color: timeRange === '3months' ? '#000' : '#666',
              fontWeight: '600'
            }}
          >
            3M
          </Button>
          <Button
            variant={timeRange === '6months' ? 'warning' : 'outline-secondary'}
            onClick={() => setTimeRange('6months')}
            style={{
              backgroundColor: timeRange === '6months' ? '#ffe01b' : 'transparent',
              border: timeRange === '6months' ? 'none' : '1px solid #dee2e6',
              color: timeRange === '6months' ? '#000' : '#666',
              fontWeight: '600'
            }}
          >
            6M
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body>
        <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
          <Row className="h-100 align-items-end">
            {currentData.map((data, index) => {
              const height = (data.revenue / maxRevenue) * 230;
              return (
                <Col key={index} className="text-center position-relative">
                  <div 
                    className="chart-bar mx-auto mb-2 position-relative"
                    style={{
                      height: `${height}px`,
                      width: '40px',
                      background: 'linear-gradient(180deg, #ffe01b 0%, #ffd700 100%)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(255,224,27,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(180deg, #ffd700 0%, #ffcd00 100%)';
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 4px 16px rgba(255,224,27,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(180deg, #ffe01b 0%, #ffd700 100%)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 2px 8px rgba(255,224,27,0.3)';
                    }}
                    title={`₹${data.revenue.toLocaleString()}\n${data.orders} orders`}
                  >
                    {/* Tooltip on hover */}
                    <div 
                      className="position-absolute"
                      style={{
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '8px',
                        opacity: 0,
                        transition: 'opacity 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = 1}
                    >
                      <div 
                        className="bg-dark text-white px-2 py-1 rounded"
                        style={{ fontSize: '10px', whiteSpace: 'nowrap' }}
                      >
                        ₹{data.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <small className="text-muted fw-bold d-block">{data.month}</small>
                  <small style={{ color: '#28a745', fontWeight: 'bold', fontSize: '10px' }}>
                    ₹{(data.revenue / 1000).toFixed(0)}K
                  </small>
                  <br/>
                  <small className="text-muted" style={{ fontSize: '9px' }}>
                    {data.orders} orders
                  </small>
                </Col>
              );
            })}
          </Row>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 pt-3 border-top">
          <Row className="text-center">
            <Col>
              <div className="mb-1">
                <i className="fas fa-rupee-sign text-success me-1"></i>
                <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>
                  ₹{totalRevenue.toLocaleString()}
                </span>
              </div>
              <small className="text-muted">Total Revenue</small>
            </Col>
            <Col>
              <div className="mb-1">
                <i className="fas fa-chart-bar text-primary me-1"></i>
                <span style={{ color: '#17a2b8', fontWeight: 'bold', fontSize: '18px' }}>
                  ₹{avgRevenue.toLocaleString()}
                </span>
              </div>
              <small className="text-muted">Average</small>
            </Col>
            <Col>
              <div className="mb-1">
                <i className="fas fa-arrow-up text-warning me-1"></i>
                <span style={{ color: '#ffe01b', fontWeight: 'bold', fontSize: '18px' }}>
                  +18.5%
                </span>
              </div>
              <small className="text-muted">Growth</small>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RevenueChart;