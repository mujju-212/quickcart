import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './StaticPages.css';

const Careers = () => {
  const openings = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      description: 'Join our engineering team to build scalable e-commerce solutions.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'On-site',
      type: 'Full-time',
      description: 'Lead product strategy and development for our grocery platform.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help customers have the best shopping experience possible.'
    },
    {
      title: 'Delivery Operations Manager',
      department: 'Operations',
      location: 'On-site',
      type: 'Full-time',
      description: 'Optimize our delivery network and ensure timely deliveries.'
    }
  ];

  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">Join Our Team</h1>
          <p className="hero-subtitle">Build your career with QuickCart</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Why Join Us */}
        <Row className="mb-5">
          <Col lg={12}>
            <h2 className="section-title">Why Work at QuickCart?</h2>
            <p className="lead">
              We're more than just a grocery delivery service - we're a team of passionate 
              individuals working to make people's lives easier. Join us in our mission to 
              revolutionize online grocery shopping.
            </p>
          </Col>
        </Row>

        {/* Benefits */}
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="benefit-card h-100">
              <Card.Body>
                <div className="benefit-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h4>Work-Life Balance</h4>
                <p>Flexible working hours and remote work options to help you maintain balance.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="benefit-card h-100">
              <Card.Body>
                <div className="benefit-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h4>Learning & Growth</h4>
                <p>Continuous learning opportunities and career development programs.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="benefit-card h-100">
              <Card.Body>
                <div className="benefit-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h4>Health Benefits</h4>
                <p>Comprehensive health insurance and wellness programs for you and your family.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Open Positions */}
        <Row>
          <Col lg={12}>
            <h2 className="section-title">Current Openings</h2>
          </Col>
          {openings.map((job, index) => (
            <Col lg={6} key={index} className="mb-4">
              <Card className="job-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="job-title">{job.title}</h4>
                      <div className="job-meta">
                        <span className="badge bg-primary me-2">{job.department}</span>
                        <span className="badge bg-secondary me-2">{job.type}</span>
                        <span className="text-muted">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="job-description">{job.description}</p>
                  <Button variant="primary" size="sm">
                    Apply Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* No Suitable Position */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="contact-card text-center">
              <Card.Body className="p-5">
                <h3>Don't see the right position?</h3>
                <p className="mb-4">
                  We're always looking for talented individuals. Send us your resume and 
                  we'll reach out when a suitable position opens up.
                </p>
                <Button variant="outline-primary" size="lg">
                  Submit Your Resume
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Careers;
