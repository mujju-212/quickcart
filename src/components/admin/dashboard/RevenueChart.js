import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ButtonGroup, Button, Spinner } from 'react-bootstrap';
import analyticsService from '../../../services/analyticsService';

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenueData();
  }, [timeRange]);

  const loadRevenueData = async () => {
    setLoading(true);
    setRevenueData([]); // Clear previous data before loading new data
    try {
      console.log('Loading revenue data for period:', timeRange);
      const response = await analyticsService.getRevenueChartData(timeRange);
      console.log('Revenue chart response:', response);
      
      if (response.success && response.data) {
        // Transform data for chart
        const chartData = response.data.map(item => {
          // For 7d, format the date. For 30d/90d/1y, use the label as-is (it's already a range)
          let label;
          if (timeRange === '7d') {
            label = new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          } else {
            // Backend sends formatted range labels for 30d/90d/1y
            label = item.date;
          }
          
          return {
            label: label,
            revenue: item.revenue,
            orders: item.orderCount
          };
        });
        console.log('Transformed chart data:', chartData);
        setRevenueData(chartData);
      } else {
        console.error('Revenue chart response not successful:', response);
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setRevenueData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
  const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);
  const avgRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

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
            variant={timeRange === '7d' ? 'warning' : 'outline-secondary'}
            onClick={() => setTimeRange('7d')}
            style={{
              backgroundColor: timeRange === '7d' ? '#ffe01b' : 'transparent',
              border: timeRange === '7d' ? 'none' : '1px solid #dee2e6',
              color: timeRange === '7d' ? '#000' : '#666',
              fontWeight: '600'
            }}
          >
            7D
          </Button>
          <Button
            variant={timeRange === '30d' ? 'warning' : 'outline-secondary'}
            onClick={() => setTimeRange('30d')}
            style={{
              backgroundColor: timeRange === '30d' ? '#ffe01b' : 'transparent',
              border: timeRange === '30d' ? 'none' : '1px solid #dee2e6',
              color: timeRange === '30d' ? '#000' : '#666',
              fontWeight: '600'
            }}
          >
            30D
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading chart data...</p>
          </div>
        ) : revenueData.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
            <p className="text-muted">No revenue data available</p>
          </div>
        ) : (
          <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
            <Row className="h-100 align-items-end">
              {revenueData.map((data, index) => {
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
                    </div>
                    <small className="text-muted fw-bold d-block">{data.label}</small>
                    <small style={{ color: '#28a745', fontWeight: 'bold', fontSize: '10px' }}>
                      ₹{data.revenue > 1000 ? (data.revenue / 1000).toFixed(1) + 'K' : data.revenue.toFixed(0)}
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
        )}
        
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