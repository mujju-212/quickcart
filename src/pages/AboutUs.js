import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './StaticPages.css';

const AboutUs = () => {
  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">About QuickCart</h1>
          <p className="hero-subtitle">Your trusted online grocery shopping partner</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Our Story */}
        <Row className="mb-5">
          <Col lg={12}>
            <h2 className="section-title">Our Story</h2>
            <p className="lead">
              Founded in 2024, QuickCart was born from a simple idea: make grocery shopping easier, 
              faster, and more convenient for everyone. We understand the challenges of modern life 
              and strive to save you time while delivering quality products right to your doorstep.
            </p>
            <p>
              What started as a small local grocery delivery service has grown into a comprehensive 
              online marketplace serving thousands of customers. Our commitment to quality, freshness, 
              and customer satisfaction remains at the heart of everything we do.
            </p>
          </Col>
        </Row>

        {/* Our Values */}
        <Row className="mb-5">
          <Col lg={12}>
            <h2 className="section-title">Our Values</h2>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="value-card h-100">
              <Card.Body className="text-center">
                <div className="value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h4>Quality First</h4>
                <p>
                  We source only the freshest products from trusted suppliers to ensure 
                  you get the best quality every time.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="value-card h-100">
              <Card.Body className="text-center">
                <div className="value-icon">
                  <i className="fas fa-shipping-fast"></i>
                </div>
                <h4>Fast Delivery</h4>
                <p>
                  Quick and reliable delivery service to get your groceries to you 
                  when you need them.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="value-card h-100">
              <Card.Body className="text-center">
                <div className="value-icon">
                  <i className="fas fa-user-shield"></i>
                </div>
                <h4>Customer Trust</h4>
                <p>
                  Building lasting relationships through transparency, reliability, 
                  and exceptional customer service.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Our Mission */}
        <Row className="mb-5">
          <Col lg={12}>
            <h2 className="section-title">Our Mission</h2>
            <Card className="mission-card">
              <Card.Body>
                <p className="lead mb-0">
                  To revolutionize grocery shopping by providing a seamless online experience 
                  that combines quality products, competitive prices, and exceptional service. 
                  We aim to be your trusted partner in maintaining a healthy and happy household.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="stats-section text-center">
          <Col md={3} sm={6} className="mb-4">
            <div className="stat-item">
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Happy Customers</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <div className="stat-item">
              <h3 className="stat-number">5,000+</h3>
              <p className="stat-label">Products</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <div className="stat-item">
              <h3 className="stat-number">50+</h3>
              <p className="stat-label">Delivery Areas</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <div className="stat-item">
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Customer Support</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
