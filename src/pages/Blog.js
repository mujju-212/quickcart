import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './StaticPages.css';

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Healthier Grocery Shopping',
      excerpt: 'Learn how to make better choices when shopping for groceries and maintain a healthy lifestyle.',
      category: 'Health & Wellness',
      date: 'November 1, 2025',
      image: 'https://via.placeholder.com/400x250?text=Healthy+Shopping',
      author: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'How to Reduce Food Waste at Home',
      excerpt: 'Practical tips and tricks to minimize food waste and save money while being environmentally conscious.',
      category: 'Sustainability',
      date: 'October 28, 2025',
      image: 'https://via.placeholder.com/400x250?text=Food+Waste',
      author: 'Michael Chen'
    },
    {
      id: 3,
      title: 'Seasonal Produce Guide: November Edition',
      excerpt: 'Discover the best fruits and vegetables in season this month and how to store them properly.',
      category: 'Seasonal Guide',
      date: 'October 25, 2025',
      image: 'https://via.placeholder.com/400x250?text=Seasonal+Produce',
      author: 'Emily Rodriguez'
    },
    {
      id: 4,
      title: 'Quick & Easy Meal Prep Ideas',
      excerpt: 'Save time during busy weekdays with these simple meal preparation strategies.',
      category: 'Cooking Tips',
      date: 'October 20, 2025',
      image: 'https://via.placeholder.com/400x250?text=Meal+Prep',
      author: 'David Kim'
    },
    {
      id: 5,
      title: 'Understanding Food Labels: A Complete Guide',
      excerpt: 'Navigate nutrition labels like a pro and make informed decisions about what you eat.',
      category: 'Education',
      date: 'October 15, 2025',
      image: 'https://via.placeholder.com/400x250?text=Food+Labels',
      author: 'Jennifer Lee'
    },
    {
      id: 6,
      title: 'Budget-Friendly Shopping Strategies',
      excerpt: 'Smart shopping tips to save money without compromising on quality or nutrition.',
      category: 'Money Saving',
      date: 'October 10, 2025',
      image: 'https://via.placeholder.com/400x250?text=Budget+Shopping',
      author: 'Robert Taylor'
    }
  ];

  return (
    <div className="static-page">
      <div className="page-hero">
        <Container>
          <h1 className="hero-title">QuickCart Blog</h1>
          <p className="hero-subtitle">Tips, guides, and stories about healthy living and smart shopping</p>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {blogPosts.map((post) => (
            <Col lg={4} md={6} key={post.id} className="mb-4">
              <Card className="blog-card h-100" style={{ cursor: 'pointer' }}>
                <div className="blog-image-wrapper">
                  <Card.Img 
                    variant="top" 
                    src={post.image} 
                    alt={post.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Badge bg="primary" className="category-badge">
                    {post.category}
                  </Badge>
                </div>
                <Card.Body>
                  <div className="blog-meta mb-2">
                    <small className="text-muted">
                      <i className="far fa-calendar-alt me-2"></i>
                      {post.date}
                    </small>
                    <small className="text-muted ms-3">
                      <i className="far fa-user me-2"></i>
                      {post.author}
                    </small>
                  </div>
                  <Card.Title className="blog-title">{post.title}</Card.Title>
                  <Card.Text className="blog-excerpt">{post.excerpt}</Card.Text>
                  <a href="#" className="read-more-link">
                    Read More <i className="fas fa-arrow-right ms-2"></i>
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Newsletter Subscription */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="newsletter-card">
              <Card.Body className="text-center p-5">
                <i className="fas fa-envelope-open-text newsletter-icon"></i>
                <h3 className="mb-3">Subscribe to Our Newsletter</h3>
                <p className="mb-4">
                  Get the latest articles, tips, and exclusive offers delivered to your inbox.
                </p>
                <div className="newsletter-form d-flex justify-content-center gap-2">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Enter your email"
                    style={{ maxWidth: '400px' }}
                  />
                  <button className="btn btn-primary">
                    Subscribe
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blog;
