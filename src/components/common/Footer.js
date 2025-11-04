import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="py-5">
          {/* About Section */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title">QuickCart</h5>
            <p className="footer-text">
              Your one-stop online grocery store delivering fresh products right to your doorstep. 
              Quality products, great prices, fast delivery.
            </p>
            <div className="social-links mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </Col>

          {/* Company Links */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title">Company</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>

          {/* Support Links */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title">Support</h5>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/support">Customer Support</Link></li>
            </ul>
          </Col>

          {/* Legal Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">Legal</h5>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
            </ul>
          </Col>

          {/* Admin Access */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">Admin</h5>
            <ul className="footer-links">
              <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <Row className="footer-bottom py-3">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="mb-0">
              &copy; {currentYear} QuickCart. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0">
              Made with <i className="fas fa-heart text-danger"></i> for better shopping
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;