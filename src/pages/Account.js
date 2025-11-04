import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Addresses from '../components/account/Addresses';
import Wishlist from '../components/account/Wishlist';
import Orders from '../components/account/Orders';
import { getImagePlaceholder, getProductImage } from '../utils/helpers';

const Account = () => {
  const { currentUser, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders', 'addresses', 'wishlist'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    // Load orders from API
    loadOrders();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  // Redirect to login if not authenticated
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'preparing': return 'warning';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-check-circle me-2"></i>
        ${product.name} moved to cart!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const handleRemoveFromWishlist = (productId, productName) => {
    removeFromWishlist(productId);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #dc3545; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-heart-broken me-2"></i>
        ${productName} removed from wishlist
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const OrderTimeline = ({ timeline }) => (
    <div className="order-timeline mt-3">
      {timeline && timeline.map((step, index) => (
        <div key={index} className={`timeline-item ${step.completed ? 'completed' : ''}`}>
          <div className={`timeline-icon ${step.completed ? 'completed' : 'pending'}`}>
            <i className={`fas fa-${step.completed ? 'check' : 'clock'}`}></i>
          </div>
          <div className="flex-grow-1">
            <div className="fw-semibold">{step.status}</div>
            <div className="text-muted small">{step.time}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Container className="py-5">
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <div 
                className="text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ 
                  width: '80px', 
                  height: '80px',
                  backgroundColor: '#ffe01b',
                  color: '#000'
                }}
              >
                <i className="fas fa-user fa-2x"></i>
              </div>
              <h5>{currentUser?.name}</h5>
              <p className="text-muted">{currentUser?.phone}</p>
            </Card.Body>
            
            <Nav variant="pills" className="flex-column p-3">
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'profile'}
                  onClick={() => handleTabChange('profile')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-user me-2"></i>
                  My Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'orders'}
                  onClick={() => handleTabChange('orders')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-shopping-bag me-2"></i>
                  My Orders
                  {orders.length > 0 && (
                    <Badge bg="primary" className="ms-auto">{orders.length}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'addresses'}
                  onClick={() => handleTabChange('addresses')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Saved Addresses
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'wishlist'}
                  onClick={() => handleTabChange('wishlist')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-heart me-2"></i>
                  Wishlist
                  {wishlist.length > 0 && (
                    <Badge bg="danger" className="ms-auto">{wishlist.length}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Card.Footer>
              <button className="btn btn-outline-danger w-100" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={9}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-user me-2"></i>
                  My Profile
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" defaultValue={currentUser?.name} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-control" defaultValue={currentUser?.phone} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" defaultValue={currentUser?.email} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" />
                    </div>
                  </Col>
                </Row>
                <button 
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
                >
                  Update Profile
                </button>
              </Card.Body>
            </Card>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Orders orders={orders} />
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <Addresses />
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <Wishlist />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Account;