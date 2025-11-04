import React, { useState } from 'react';
import { Container, Row, Col, Card, Accordion, Form, InputGroup } from 'react-bootstrap';
import './StaticPages.css';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      category: 'Orders & Delivery',
      icon: 'fas fa-shopping-bag',
      questions: [
        {
          q: 'How do I track my order?',
          a: 'You can track your order from your Account page under "Orders". Click on any order to see real-time tracking information. You\'ll also receive SMS updates about your delivery status.'
        },
        {
          q: 'What are your delivery hours?',
          a: 'We deliver 7 days a week from 8:00 AM to 10:00 PM. You can choose your preferred delivery slot during checkout.'
        },
        {
          q: 'Is there a minimum order value?',
          a: 'Yes, the minimum order value is $20. Orders above $50 qualify for free delivery.'
        },
        {
          q: 'Can I change my delivery address?',
          a: 'Yes, you can change your delivery address before order confirmation. After confirmation, please contact customer support immediately.'
        }
      ]
    },
    {
      category: 'Payments & Pricing',
      icon: 'fas fa-credit-card',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept credit/debit cards, UPI, net banking, and cash on delivery for orders under $100.'
        },
        {
          q: 'Are prices the same as in stores?',
          a: 'Our prices are competitive and often include exclusive online discounts. Check our offers section for current deals.'
        },
        {
          q: 'Do you charge delivery fees?',
          a: 'Delivery is free for orders above $50. For orders below $50, a nominal delivery fee of $3 applies.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, all payments are processed through secure, encrypted channels. We never store your complete card details.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      icon: 'fas fa-undo',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We accept returns for damaged or wrong items within 24 hours of delivery. Fresh produce and perishables must be reported immediately upon delivery.'
        },
        {
          q: 'How do I request a refund?',
          a: 'Contact customer support with your order details and reason for refund. Approved refunds are processed within 5-7 business days.'
        },
        {
          q: 'What if I receive damaged items?',
          a: 'Take photos of the damaged items and contact us immediately. We\'ll arrange a replacement or refund based on availability.'
        },
        {
          q: 'Can I cancel my order?',
          a: 'Yes, you can cancel your order before it\'s dispatched. Once dispatched, cancellation isn\'t possible, but you can refuse delivery for a refund.'
        }
      ]
    },
    {
      category: 'Account & Security',
      icon: 'fas fa-user-shield',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Login/Register" and enter your mobile number. You\'ll receive an OTP to verify and create your account.'
        },
        {
          q: 'I forgot my password. What should I do?',
          a: 'We use OTP-based authentication, so you don\'t need a password. Simply enter your mobile number to receive a new OTP.'
        },
        {
          q: 'How do I update my profile information?',
          a: 'Go to Account > Profile to update your name, email, and other details. Mobile number changes require verification.'
        },
        {
          q: 'Is my personal information safe?',
          a: 'Yes, we follow strict data protection policies and never share your information with third parties without consent.'
        }
      ]
    },
    {
      category: 'Products & Quality',
      icon: 'fas fa-box-open',
      questions: [
        {
          q: 'How do you ensure product freshness?',
          a: 'We source products daily from trusted suppliers and maintain optimal storage conditions. Expiry dates are always checked before dispatch.'
        },
        {
          q: 'Can I request specific items?',
          a: 'Yes, you can add notes during checkout or contact customer support for special requests. We\'ll do our best to accommodate.'
        },
        {
          q: 'What if a product is out of stock?',
          a: 'We\'ll notify you immediately and offer alternatives or remove the item from your order with an adjusted total.'
        },
        {
          q: 'Do you offer organic products?',
          a: 'Yes, we have a dedicated organic section. Filter by "Organic" in the product categories to view all organic options.'
        }
      ]
    }
  ];

  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">Help Center</h1>
          <p className="hero-subtitle">Find answers to common questions</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Search Box */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="search-card">
              <Card.Body className="p-4">
                <InputGroup size="lg">
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Categories */}
        {faqCategories.map((category, catIndex) => (
          <Row key={catIndex} className="mb-5">
            <Col lg={12}>
              <div className="faq-category-header mb-3">
                <i className={`${category.icon} me-3`}></i>
                <h3>{category.category}</h3>
              </div>
              <Accordion>
                {category.questions.map((item, qIndex) => (
                  <Accordion.Item 
                    eventKey={`${catIndex}-${qIndex}`} 
                    key={qIndex}
                    className="faq-item"
                  >
                    <Accordion.Header>{item.q}</Accordion.Header>
                    <Accordion.Body>{item.a}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        ))}

        {/* Still Need Help */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="contact-support-card text-center">
              <Card.Body className="p-5">
                <i className="fas fa-headset support-icon"></i>
                <h3 className="mb-3">Still need help?</h3>
                <p className="mb-4">
                  Our customer support team is available 24/7 to assist you with any questions or concerns.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <a href="/contact" className="btn btn-primary btn-lg">
                    <i className="fas fa-envelope me-2"></i>
                    Contact Support
                  </a>
                  <a href="tel:+18001234567" className="btn btn-outline-primary btn-lg">
                    <i className="fas fa-phone me-2"></i>
                    Call Us
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HelpCenter;
