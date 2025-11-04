import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './StaticPages.css';

const Support = () => {
  const supportChannels = [
    {
      icon: 'fas fa-comments',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: 'Available 24/7',
      action: 'Start Chat',
      variant: 'primary'
    },
    {
      icon: 'fas fa-phone-alt',
      title: 'Phone Support',
      description: 'Speak directly with a support agent',
      availability: 'Mon-Sun: 8 AM - 10 PM',
      action: 'Call Now',
      variant: 'success',
      phone: '+1 (800) 123-4567'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      variant: 'info',
      email: 'support@quickcart.com'
    },
    {
      icon: 'fab fa-whatsapp',
      title: 'WhatsApp',
      description: 'Connect with us on WhatsApp',
      availability: 'Available 24/7',
      action: 'Open WhatsApp',
      variant: 'success'
    }
  ];

  const commonIssues = [
    {
      icon: 'fas fa-box',
      title: 'Order Issues',
      description: 'Problems with your order, delivery, or items',
      link: '/help'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'Payment Problems',
      description: 'Issues with payments, refunds, or billing',
      link: '/help'
    },
    {
      icon: 'fas fa-user-circle',
      title: 'Account Help',
      description: 'Login issues, profile updates, or security',
      link: '/help'
    },
    {
      icon: 'fas fa-star',
      title: 'Product Quality',
      description: 'Concerns about product freshness or quality',
      link: '/help'
    }
  ];

  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">Customer Support</h1>
          <p className="hero-subtitle">We're here to help you 24/7</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Support Channels */}
        <Row className="mb-5">
          <Col lg={12}>
            <h2 className="section-title text-center mb-4">How Can We Help You?</h2>
          </Col>
          {supportChannels.map((channel, index) => (
            <Col lg={3} md={6} key={index} className="mb-4">
              <Card className="support-channel-card h-100 text-center">
                <Card.Body className="d-flex flex-column">
                  <div className="support-icon mb-3">
                    <i className={channel.icon}></i>
                  </div>
                  <h4 className="mb-2">{channel.title}</h4>
                  <p className="text-muted mb-2">{channel.description}</p>
                  <p className="small text-muted mb-3">
                    <i className="far fa-clock me-1"></i>
                    {channel.availability}
                  </p>
                  <Button 
                    variant={channel.variant} 
                    className="mt-auto"
                    onClick={() => {
                      if (channel.phone) {
                        window.location.href = `tel:${channel.phone}`;
                      } else if (channel.email) {
                        window.location.href = `mailto:${channel.email}`;
                      }
                    }}
                  >
                    {channel.action}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Common Issues */}
        <Row className="mb-5">
          <Col lg={12}>
            <h2 className="section-title text-center mb-4">Common Issues</h2>
          </Col>
          {commonIssues.map((issue, index) => (
            <Col lg={6} key={index} className="mb-4">
              <Card className="common-issue-card">
                <Card.Body className="d-flex align-items-center">
                  <div className="issue-icon me-3">
                    <i className={issue.icon}></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{issue.title}</h5>
                    <p className="text-muted mb-0 small">{issue.description}</p>
                  </div>
                  <Button variant="outline-primary" size="sm" href={issue.link}>
                    Get Help
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Emergency Support */}
        <Row>
          <Col lg={12}>
            <Card className="emergency-support-card">
              <Card.Body className="text-center p-5">
                <i className="fas fa-exclamation-circle emergency-icon"></i>
                <h3 className="mb-3">Need Urgent Help?</h3>
                <p className="lead mb-4">
                  For urgent order issues or emergencies, call our 24/7 hotline
                </p>
                <h2 className="text-primary mb-4">
                  <i className="fas fa-phone-alt me-2"></i>
                  +1 (800) 123-4567
                </h2>
                <p className="text-muted">
                  Average wait time: Less than 2 minutes
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Self-Service Resources */}
        <Row className="mt-5">
          <Col lg={12}>
            <h2 className="section-title text-center mb-4">Self-Service Resources</h2>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="resource-card text-center h-100">
              <Card.Body>
                <i className="fas fa-question-circle resource-icon"></i>
                <h5>Help Center</h5>
                <p className="text-muted">Browse FAQs and guides</p>
                <Button variant="link" href="/help">Visit Help Center →</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="resource-card text-center h-100">
              <Card.Body>
                <i className="fas fa-video resource-icon"></i>
                <h5>Video Tutorials</h5>
                <p className="text-muted">Watch how-to videos</p>
                <Button variant="link">Watch Tutorials →</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="resource-card text-center h-100">
              <Card.Body>
                <i className="fas fa-users resource-icon"></i>
                <h5>Community Forum</h5>
                <p className="text-muted">Connect with other users</p>
                <Button variant="link">Join Forum →</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Support;
