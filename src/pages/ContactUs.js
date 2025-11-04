import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './StaticPages.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">We'd love to hear from you</p>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {/* Contact Information */}
          <Col lg={4} className="mb-4">
            <Card className="contact-info-card h-100">
              <Card.Body>
                <h3 className="mb-4">Get in Touch</h3>
                
                <div className="contact-item mb-4">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h5>Address</h5>
                    <p className="text-muted mb-0">
                      123 Market Street<br />
                      Shopping District<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="contact-item mb-4">
                  <div className="contact-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h5>Phone</h5>
                    <p className="text-muted mb-0">
                      Customer Service: +1 (800) 123-4567<br />
                      Business: +1 (800) 123-4568
                    </p>
                  </div>
                </div>

                <div className="contact-item mb-4">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h5>Email</h5>
                    <p className="text-muted mb-0">
                      Support: support@quickcart.com<br />
                      Business: business@quickcart.com
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h5>Working Hours</h5>
                    <p className="text-muted mb-0">
                      Monday - Friday: 8:00 AM - 8:00 PM<br />
                      Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Form */}
          <Col lg={8} className="mb-4">
            <Card className="contact-form-card">
              <Card.Body className="p-4">
                <h3 className="mb-4">Send us a Message</h3>
                
                {showSuccess && (
                  <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                    <i className="fas fa-check-circle me-2"></i>
                    Thank you for contacting us! We'll get back to you soon.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Subject *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this about?"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" size="lg">
                    <i className="fas fa-paper-plane me-2"></i>
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Quick Links */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="faq-quick-links">
              <Card.Body className="text-center p-4">
                <h4 className="mb-3">Looking for quick answers?</h4>
                <p className="mb-4">Check out our Help Center for instant solutions to common questions.</p>
                <Button variant="outline-primary" href="/help">
                  Visit Help Center
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
