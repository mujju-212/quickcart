import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import StatsCards from './StatsCards';
import RecentOrders from './RecentOrders';
import RevenueChart from './RevenueChart';
import CategorySales from './CategorySales';
import PerformanceMetrics from './PerformanceMetrics';

const Dashboard = () => {
  return (
    <div>
      {/* Header with Quick Actions */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 style={{ color: '#333', fontWeight: 'bold', marginBottom: '4px' }}>
            <i className="fas fa-chart-line me-2" style={{ color: '#ffe01b' }}></i>
            Dashboard Overview
          </h2>
          <p className="text-muted mb-0">Monitor your store performance and analytics</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            size="sm" 
            style={{
              backgroundColor: '#ffe01b',
              border: 'none',
              color: '#000',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          >
            <i className="fas fa-download me-2"></i>
            Export Report
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            style={{
              borderRadius: '8px',
              fontWeight: '600',
              padding: '8px 16px'
            }}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Analytics */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3 mb-lg-0">
          <RevenueChart />
        </Col>
        <Col lg={4}>
          <CategorySales />
        </Col>
      </Row>

      {/* Performance Metrics */}
      <div className="mb-4">
        <PerformanceMetrics />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
};

export default Dashboard;