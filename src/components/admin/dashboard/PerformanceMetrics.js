import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import analyticsService from '../../../services/analyticsService';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsService.getPerformanceMetrics();
      console.log('Performance Metrics Response:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        console.log('Performance Metrics Data:', data);
        
        const transformedMetrics = [
          {
            title: 'Today\'s Orders',
            value: data.todayOrders.value,
            change: `${data.todayOrders.change >= 0 ? '+' : ''}${data.todayOrders.change}%`,
            trend: data.todayOrders.trend,
            color: '#28a745'
          },
          {
            title: 'Average Order Value',
            value: `₹${data.avgOrderValue.value}`,
            change: `${data.avgOrderValue.change >= 0 ? '+' : ''}${data.avgOrderValue.change}%`,
            trend: data.avgOrderValue.trend,
            color: '#28a745'
          },
          {
            title: 'Delivery Time',
            value: `${data.avgDeliveryTime.value} min`,
            change: data.avgDeliveryTime.change !== 0 ? `${data.avgDeliveryTime.change} min` : '-',
            trend: data.avgDeliveryTime.trend,
            color: '#28a745'
          },
          {
            title: 'Return Rate',
            value: `${data.returnRate.value}%`,
            change: data.returnRate.change !== 0 ? `${data.returnRate.change >= 0 ? '+' : ''}${data.returnRate.change}%` : '-',
            trend: data.returnRate.trend,
            color: '#28a745'
          },
          {
            title: 'Active Users',
            value: data.activeUsers.value,
            change: `${data.activeUsers.change >= 0 ? '+' : ''}${data.activeUsers.change}%`,
            trend: data.activeUsers.trend,
            color: '#28a745'
          }
        ];
        
        setMetrics(transformedMetrics);
      } else {
        console.error('Performance metrics response not successful:', response);
        setError(response.message || 'Failed to load metrics');
      }
    } catch (error) {
      console.error('Error loading performance metrics:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FaArrowUp size={12} />;
      case 'down':
        return <FaArrowDown size={12} />;
      default:
        return <FaMinus size={12} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return '#28a745';
      case 'down':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <Card.Header 
        className="bg-white border-0"
        style={{ 
          borderRadius: '15px 15px 0 0',
          padding: '20px'
        }}
      >
        <div>
          <h5 className="mb-1" style={{ color: '#333', fontWeight: 'bold' }}>
            <i className="fas fa-tachometer-alt me-2" style={{ color: '#ffe01b' }}></i>
            Performance Metrics
          </h5>
          <small className="text-muted">Real-time business indicators</small>
        </div>
      </Card.Header>
      <Card.Body className="p-3">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted">Loading metrics...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <p className="text-danger mb-2">{error}</p>
            <small className="text-muted">Check browser console and backend logs for details</small>
            <br />
            <button 
              className="btn btn-sm btn-warning mt-3"
              onClick={loadMetrics}
            >
              <i className="fas fa-refresh me-2"></i>
              Retry
            </button>
          </div>
        ) : metrics.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-exclamation-circle fa-3x text-muted mb-3"></i>
            <p className="text-muted">No metrics data available</p>
            <small className="text-muted">Check browser console for errors</small>
          </div>
        ) : (
          <Row className="g-3">
            {metrics.map((metric, index) => (
              <Col xs={12} sm={6} md={4} lg={4} xl key={index}>
                <div 
                  className="metric-card p-3 h-100" 
                  style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px',
                    border: '2px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ffe01b';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <small 
                      className="text-muted d-block mb-2" 
                      style={{ 
                        fontSize: '12px', 
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {metric.title}
                    </small>
                    <h3 
                      className="mb-2" 
                      style={{ 
                        color: '#333', 
                        fontWeight: 'bold', 
                        fontSize: '1.75rem',
                        lineHeight: '1'
                      }}
                    >
                      {metric.value}
                    </h3>
                  </div>
                  <div>
                    <Badge 
                      className="d-inline-flex align-items-center gap-1"
                      style={{ 
                        color: getTrendColor(metric.trend),
                        backgroundColor: `${getTrendColor(metric.trend)}15`,
                        border: `1px solid ${getTrendColor(metric.trend)}30`,
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '5px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      {getTrendIcon(metric.trend)}
                      <span className="ms-1">{metric.change}</span>
                    </Badge>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default PerformanceMetrics;