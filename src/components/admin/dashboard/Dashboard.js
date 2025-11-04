import React, { useState, useRef } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import StatsCards from './StatsCards';
import RecentOrders from './RecentOrders';
import RevenueChart from './RevenueChart';
import CategorySales from './CategorySales';
import PerformanceMetrics from './PerformanceMetrics';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
  const [exporting, setExporting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const dashboardRef = useRef(null);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
  };

  const handleExportReport = async () => {
    setExporting(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      
      const reportDate = new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
      const reportTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Helper function to add header and footer
      const addHeaderFooter = (pageNum, title) => {
        // Header with gradient-like effect
        pdf.setFillColor(255, 224, 27);
        pdf.rect(0, 0, pageWidth, 35, 'F');
        pdf.setFillColor(255, 235, 77);
        pdf.rect(0, 0, pageWidth, 15, 'F');
        
        // Logo/Brand
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('QuickCart', margin, 10);
        
        // Report title
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text('Dashboard Analytics Report', margin, 18);
        
        // Date on right
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        const dateText = `${reportDate} | ${reportTime}`;
        const dateWidth = pdf.getTextWidth(dateText);
        pdf.text(dateText, pageWidth - margin - dateWidth, 10);
        
        // Section title if provided
        if (title) {
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(title, margin, 50);
          
          // Decorative line under title
          pdf.setDrawColor(255, 224, 27);
          pdf.setLineWidth(1);
          pdf.line(margin, 53, margin + 60, 53);
        }
        
        // Footer
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(150, 150, 150);
        pdf.text('QuickCart Admin Dashboard - Confidential', margin, pageHeight - 10);
        
        // Page number
        const pageText = `Page ${pageNum}`;
        const pageTextWidth = pdf.getTextWidth(pageText);
        pdf.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 10);
        
        // Decorative footer line
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      };

      // ==================== COVER PAGE ====================
      let pageNumber = 1;
      
      // Cover page background
      pdf.setFillColor(255, 224, 27);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Main title
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      const titleText = 'QuickCart';
      const titleWidth = pdf.getTextWidth(titleText);
      pdf.text(titleText, (pageWidth - titleWidth) / 2, 80);
      
      // Subtitle
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'normal');
      const subtitleText = 'Dashboard Analytics Report';
      const subtitleWidth = pdf.getTextWidth(subtitleText);
      pdf.text(subtitleText, (pageWidth - subtitleWidth) / 2, 95);
      
      // Date box
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(40, 120, pageWidth - 80, 40, 3, 3, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(60, 60, 60);
      const dateLabel = 'Report Generated On:';
      const dateLabelWidth = pdf.getTextWidth(dateLabel);
      pdf.text(dateLabel, (pageWidth - dateLabelWidth) / 2, 135);
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      const fullDate = `${reportDate} at ${reportTime}`;
      const fullDateWidth = pdf.getTextWidth(fullDate);
      pdf.text(fullDate, (pageWidth - fullDateWidth) / 2, 148);
      
      // Bottom branding
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const brandingText = 'Comprehensive Performance & Sales Analysis';
      const brandingWidth = pdf.getTextWidth(brandingText);
      pdf.text(brandingText, (pageWidth - brandingWidth) / 2, pageHeight - 30);

      // ==================== STATS CARDS PAGE ====================
      const statsElement = document.querySelector('.stats-cards-section');
      if (statsElement) {
        pdf.addPage();
        pageNumber++;
        addHeaderFooter(pageNumber, 'Key Performance Metrics');
        
        const statsCanvas = await html2canvas(statsElement, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        const statsImg = statsCanvas.toDataURL('image/png');
        const statsWidth = pageWidth - (2 * margin);
        const statsHeight = (statsCanvas.height * statsWidth) / statsCanvas.width;
        
        pdf.addImage(statsImg, 'PNG', margin, 60, statsWidth, Math.min(statsHeight, 100));
        
        // Add description
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        const descY = 60 + Math.min(statsHeight, 100) + 10;
        pdf.text('Overview of key business metrics including total revenue, orders, customers, and products.', margin, descY);
      }

      // ==================== REVENUE CHART PAGE ====================
      const revenueElement = document.querySelector('.revenue-chart-section');
      if (revenueElement) {
        pdf.addPage();
        pageNumber++;
        addHeaderFooter(pageNumber, 'Revenue Trends Analysis');
        
        const revenueCanvas = await html2canvas(revenueElement, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        const revenueImg = revenueCanvas.toDataURL('image/png');
        const revenueWidth = pageWidth - (2 * margin);
        const revenueHeight = (revenueCanvas.height * revenueWidth) / revenueCanvas.width;
        
        pdf.addImage(revenueImg, 'PNG', margin, 60, revenueWidth, Math.min(revenueHeight, 140));
        
        // Add insights box
        const insightY = 60 + Math.min(revenueHeight, 140) + 15;
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, insightY, pageWidth - (2 * margin), 25, 2, 2, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Key Insights:', margin + 5, insightY + 8);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text('• Revenue trends show business growth patterns over the selected period', margin + 5, insightY + 15);
        pdf.text('• Track sales performance and identify peak business periods', margin + 5, insightY + 21);
      }

      // ==================== CATEGORY SALES & PERFORMANCE PAGE ====================
      pdf.addPage();
      pageNumber++;
      addHeaderFooter(pageNumber, 'Sales Distribution & Performance');
      
      // Category Sales
      const categoryElement = document.querySelector('.category-sales-section');
      if (categoryElement) {
        const categoryCanvas = await html2canvas(categoryElement, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        const categoryImg = categoryCanvas.toDataURL('image/png');
        const categoryWidth = (pageWidth - (3 * margin)) / 2;
        const categoryHeight = (categoryCanvas.height * categoryWidth) / categoryCanvas.width;
        
        pdf.addImage(categoryImg, 'PNG', margin, 60, categoryWidth, Math.min(categoryHeight, 90));
      }
      
      // Performance Metrics
      const performanceElement = document.querySelector('.performance-metrics-section');
      if (performanceElement) {
        const performanceCanvas = await html2canvas(performanceElement, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        const performanceImg = performanceCanvas.toDataURL('image/png');
        const performanceWidth = (pageWidth - (3 * margin)) / 2;
        const performanceHeight = (performanceCanvas.height * performanceWidth) / performanceCanvas.width;
        
        pdf.addImage(performanceImg, 'PNG', pageWidth / 2 + 5, 60, performanceWidth, Math.min(performanceHeight, 90));
      }
      
      // Add combined insights
      const combinedInsightY = 160;
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(margin, combinedInsightY, pageWidth - (2 * margin), 30, 2, 2, 'F');
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Business Insights:', margin + 5, combinedInsightY + 8);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text('• Category distribution helps identify top-performing product segments', margin + 5, combinedInsightY + 15);
      pdf.text('• Performance metrics track conversion rates and customer engagement', margin + 5, combinedInsightY + 21);
      pdf.text('• Use these insights to optimize inventory and marketing strategies', margin + 5, combinedInsightY + 27);

      // ==================== RECENT ORDERS PAGE ====================
      const ordersElement = document.querySelector('.recent-orders-section');
      if (ordersElement) {
        pdf.addPage();
        pageNumber++;
        addHeaderFooter(pageNumber, 'Recent Orders Overview');
        
        const ordersCanvas = await html2canvas(ordersElement, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        const ordersImg = ordersCanvas.toDataURL('image/png');
        const ordersWidth = pageWidth - (2 * margin);
        const ordersHeight = (ordersCanvas.height * ordersWidth) / ordersCanvas.width;
        
        pdf.addImage(ordersImg, 'PNG', margin, 60, ordersWidth, Math.min(ordersHeight, 150));
        
        // Add order summary box
        const orderSummaryY = 60 + Math.min(ordersHeight, 150) + 15;
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, orderSummaryY, pageWidth - (2 * margin), 20, 2, 2, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Order Management:', margin + 5, orderSummaryY + 8);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text('Latest transactions and order fulfillment status for operational oversight', margin + 5, orderSummaryY + 15);
      }

      // ==================== SUMMARY PAGE ====================
      pdf.addPage();
      pageNumber++;
      addHeaderFooter(pageNumber, 'Report Summary');
      
      // Summary box
      pdf.setFillColor(255, 250, 220);
      pdf.roundedRect(margin, 60, pageWidth - (2 * margin), 80, 3, 3, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Executive Summary', margin + 10, 72);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      const summaryLines = [
        'This comprehensive dashboard report provides a complete overview of QuickCart\'s',
        'business performance metrics. The report includes:',
        '',
        '✓  Key Performance Indicators (Revenue, Orders, Customers, Products)',
        '✓  Revenue Trends and Growth Analysis',
        '✓  Sales Distribution by Product Category',
        '✓  Performance Metrics and Conversion Rates',
        '✓  Recent Order Activity and Status',
        '',
        'Use these insights to make data-driven decisions and optimize business operations.'
      ];
      
      let summaryY = 82;
      summaryLines.forEach(line => {
        pdf.text(line, margin + 10, summaryY);
        summaryY += 6;
      });
      
      // Recommendations box
      pdf.setFillColor(240, 248, 255);
      pdf.roundedRect(margin, 150, pageWidth - (2 * margin), 50, 3, 3, 'F');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Actionable Recommendations', margin + 10, 162);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      const recommendations = [
        '1. Monitor revenue trends weekly to identify growth opportunities',
        '2. Focus marketing efforts on top-performing product categories',
        '3. Analyze customer behavior to improve conversion rates',
        '4. Ensure timely order fulfillment to maintain customer satisfaction',
        '5. Regular review of dashboard metrics for proactive decision-making'
      ];
      
      let recY = 170;
      recommendations.forEach(rec => {
        pdf.text(rec, margin + 10, recY);
        recY += 7;
      });
      
      // Confidentiality notice
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(150, 150, 150);
      pdf.text('This report contains confidential business information. Handle with care.', margin, pageHeight - 25);

      // Save PDF with formatted filename
      const fileName = `QuickCart_Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert('📊 Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

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
            onClick={handleExportReport}
            disabled={exporting}
            style={{
              backgroundColor: exporting ? '#ccc' : '#ffe01b',
              border: 'none',
              color: '#000',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          >
            {exporting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-download me-2"></i>
                Export Report
              </>
            )}
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={handleRefresh}
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
      <div className="stats-cards-section mb-4">
        <StatsCards />
      </div>

      {/* Charts and Analytics */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3 mb-lg-0">
          <div className="revenue-chart-section">
            <RevenueChart />
          </div>
        </Col>
        <Col lg={4}>
          <div className="category-sales-section">
            <CategorySales />
          </div>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <div className="performance-metrics-section mb-4">
        <PerformanceMetrics />
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-section">
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;