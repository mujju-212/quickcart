import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Badge, Form, Dropdown, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LocationModal from './LocationModal';
import categoryService from '../../services/categoryService';

const Header = ({ searchTrigger }) => {
  const { cart, getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Nagawara, Bengaluru');
  const [categories, setCategories] = useState([]);
  
  // Mobile-specific states
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locations = [
            'Koramangala, Bengaluru',
            'Indiranagar, Bengaluru', 
            'Whitefield, Bengaluru',
            'HSR Layout, Bengaluru',
            'Electronic City, Bengaluru'
          ];
          
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          setCurrentLocation(randomLocation);
          
          // Show notification
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1055; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <i class="fas fa-map-marker-alt me-2"></i>
              Location updated to ${randomLocation}
            </div>
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 3000);
        },
        (error) => {
          console.error('Error getting location:', error);
          setShowLocationModal(true);
        }
      );
    } else {
      setShowLocationModal(true);
    }
  };

  // Function to navigate to specific account tabs
  const navigateToAccountTab = (tab) => {
    navigate(`/account?tab=${tab}`);
  };

  // Handle search trigger from bottom nav
  useEffect(() => {
    if (searchTrigger) {
      setShowSearchBar(true);
    }
  }, [searchTrigger]);

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom" sticky="top">
        <Container fluid className="px-2">
          {/* MOBILE HEADER - Only visible on mobile */}
          <div className="d-lg-none d-flex align-items-center w-100">
            {/* Hamburger Menu */}
            <Button
              variant="link"
              className="p-2"
              onClick={() => setShowSidebar(true)}
              style={{ fontSize: '20px', color: '#1a1a1a', textDecoration: 'none', minWidth: 'auto', flexShrink: 0 }}
            >
              <i className="fas fa-bars"></i>
            </Button>

            {/* Logo + Text */}
            <Link to="/" className="d-flex align-items-center text-decoration-none mb-0 p-0 me-2" style={{ flexShrink: 0 }}>
              <div
                className="d-inline-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                  color: '#1a1a1a',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
                  marginRight: '8px'
                }}
              >
                <i className="fas fa-bolt"></i>
              </div>
              <span className="fw-bold d-none d-sm-inline" style={{ fontSize: '18px', color: '#000' }}>
                QuickCart
              </span>
            </Link>

            {/* Mobile Search Bar */}
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              {!showSearchBar ? (
                <div
                  onClick={() => setShowSearchBar(true)}
                  style={{
                    background: '#f5f5f5',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    minHeight: '36px'
                  }}
                >
                  <i className="fas fa-search" style={{ color: '#999', fontSize: '14px', flexShrink: 0 }}></i>
                  <span style={{ 
                    color: '#999', 
                    fontSize: '14px', 
                    marginLeft: '8px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Search...
                  </span>
                </div>
              ) : (
                <Form onSubmit={handleSearch} className="w-100">
                  <div className="position-relative">
                    <Form.Control
                      type="search"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      style={{
                        borderRadius: '20px',
                        fontSize: '14px',
                        paddingLeft: '38px',
                        paddingRight: '40px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        border: '2px solid #ffd700',
                        height: '36px'
                      }}
                      onBlur={() => {
                        if (!searchQuery) {
                          setTimeout(() => setShowSearchBar(false), 200);
                        }
                      }}
                    />
                    <i className="fas fa-search position-absolute" style={{ 
                      left: '14px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#999',
                      fontSize: '13px',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}></i>
                    {searchQuery && (
                      <Button
                        variant="link"
                        className="position-absolute"
                        style={{
                          right: '4px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '4px 8px',
                          fontSize: '14px',
                          color: '#666'
                        }}
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchBar(false);
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </div>

            {/* Mobile Location Icon */}
            <Dropdown className="ms-2" style={{ flexShrink: 0 }}>
              <Dropdown.Toggle 
                variant="link" 
                className="p-2 text-decoration-none border-0"
                style={{
                  fontSize: '18px',
                  minWidth: 'auto'
                }}
              >
                <i className="fas fa-map-marker-alt" style={{ color: '#ffd700' }}></i>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={detectLocation}>
                  <i className="fas fa-location-arrow me-2"></i>
                  Detect My Location
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowLocationModal(true)}>
                  <i className="fas fa-search me-2"></i>
                  Search Location
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Recent Locations</Dropdown.Header>
                <Dropdown.Item onClick={() => setCurrentLocation('Koramangala, Bengaluru')}>
                  Koramangala, Bengaluru
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentLocation('Indiranagar, Bengaluru')}>
                  Indiranagar, Bengaluru
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* DESKTOP HEADER - Only visible on desktop */}
          <div className="d-none d-lg-block w-100">
            <Container>
              <div className="d-flex align-items-center">
                {/* Logo with modern gradient theme */}
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-3" style={{ color: '#000' }}>
                  <span 
                    className="me-2 d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                      color: '#1a1a1a',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      fontSize: '20px',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    <i className="fas fa-bolt"></i>
                  </span>
                  QuickCart
                </Navbar.Brand>

                {/* Location Selector */}
                <div className="ms-3">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" className="border-0">
                      <div className="text-start">
                        <div className="fw-semibold small">Delivery in 10 minutes</div>
                        <div className="text-muted small">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {currentLocation}
                          <i className="fas fa-chevron-down ms-1"></i>
                        </div>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={detectLocation}>
                        <i className="fas fa-location-arrow me-2"></i>
                        Detect My Location
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setShowLocationModal(true)}>
                        <i className="fas fa-search me-2"></i>
                        Search Location
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Header>Recent Locations</Dropdown.Header>
                      <Dropdown.Item onClick={() => setCurrentLocation('Koramangala, Bengaluru')}>
                        Koramangala, Bengaluru
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setCurrentLocation('Indiranagar, Bengaluru')}>
                        Indiranagar, Bengaluru
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
            {/* Search Bar */}
            <Form className="d-flex mx-auto" style={{ maxWidth: '500px', width: '100%' }} onSubmit={handleSearch}>
              <div className="position-relative w-100">
                <Form.Control
                  type="search"
                  placeholder="Search for groceries, snacks & more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pe-5"
                  style={{ borderRadius: '25px' }}
                />
                <Button
                  variant="link"
                  type="submit"
                  className="position-absolute end-0 top-50 translate-middle-y border-0"
                  style={{ zIndex: 5 }}
                >
                  <i className="fas fa-search text-muted"></i>
                </Button>
              </div>
            </Form>

            {/* Navigation Items */}
            <Nav className="ms-auto align-items-center">
              {/* Quick Categories */}
              <Dropdown className="d-none d-lg-block me-3">
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  size="sm"
                  style={{ borderColor: '#ffe01b', color: '#000' }}
                >
                  <i className="fas fa-th-large me-1"></i>
                  Categories
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Dropdown.Item 
                        key={category.id}
                        onClick={() => navigate(`/search?category=${encodeURIComponent(category.name)}`)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '8px 16px',
                          gap: '12px'
                        }}
                      >
                        <img 
                          src={category.image_url || category.image} 
                          alt={category.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.textContent = `📦 ${category.name}`;
                          }}
                        />
                        <span style={{ fontSize: '14px' }}>{category.name}</span>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>Loading categories...</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* User Account */}
              {user ? (
                <Dropdown className="me-3">
                  <Dropdown.Toggle variant="outline-secondary" className="border-0">
                    <i className="fas fa-user me-1"></i>
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    {/* Account - Goes to Profile tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('profile')}>
                      <i className="fas fa-user me-2"></i>
                      My Account
                    </Dropdown.Item>
                    
                    {/* Orders - Goes to Orders tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('orders')}>
                      <i className="fas fa-shopping-bag me-2"></i>
                      My Orders
                    </Dropdown.Item>
                    
                    {/* Wishlist - Goes to Wishlist tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('wishlist')}>
                      <i className="fas fa-heart me-2"></i>
                      Wishlist
                    </Dropdown.Item>
                    
                    {/* Addresses - Goes to Addresses tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('addresses')}>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Addresses
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    {/* Logout */}
                    <Dropdown.Item onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button 
                  variant="outline-secondary" 
                  className="me-3" 
                  onClick={() => navigate('/login')}
                  style={{ borderColor: '#ffe01b', color: '#000' }}
                >
                  <i className="fas fa-user me-1"></i>
                  Login
                </Button>
              )}

              {/* Cart */}
              <Button
                className="position-relative"
                onClick={() => navigate('/cart')}
                style={{ 
                  backgroundColor: '#ffe01b', 
                  borderColor: '#ffe01b', 
                  color: '#000',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-shopping-cart me-1"></i>
                Cart
                {getCartItemsCount() > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle rounded-pill"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
            </Nav>
          </Navbar.Collapse>
              </div>
            </Container>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Sidebar - Detailed Version */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" style={{ width: '280px' }}>
        <Offcanvas.Header closeButton style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <div
                className="d-inline-flex align-items-center justify-content-center me-2"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                  color: '#1a1a1a',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                }}
              >
                <i className="fas fa-bolt"></i>
              </div>
              <span className="fw-bold fs-5">QuickCart</span>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            {/* User Profile Section */}
            {user && (
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                  padding: '20px',
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      fontSize: '24px',
                      color: '#ffd700'
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '16px' }}>{user.name}</div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>{user.phone}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <Nav className="flex-column">
              {/* Home */}
              <Nav.Link 
                onClick={() => { navigate('/'); setShowSidebar(false); }}
                className="d-flex align-items-center py-3 px-4"
                style={{ borderBottom: '1px solid #f3f4f6' }}
              >
                <i className="fas fa-home me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                <span className="fw-500">Home</span>
              </Nav.Link>

              {/* Shop by Categories */}
              <div className="px-4 py-2 bg-light">
                <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  Shop by Categories
                </small>
              </div>
              
              {categories && categories.length > 0 ? (
                categories.slice(0, 8).map((category) => (
                  <Nav.Link
                    key={category.id}
                    onClick={() => { 
                      navigate(`/search?category=${category.id}`); 
                      setShowSidebar(false); 
                    }}
                    className="d-flex align-items-center py-2 px-4"
                    style={{ borderBottom: '1px solid #f9fafb' }}
                  >
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        objectFit: 'cover',
                        borderRadius: '6px',
                        marginRight: '12px'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/28?text=' + category.name.charAt(0);
                      }}
                    />
                    <span style={{ fontSize: '14px' }}>{category.name}</span>
                  </Nav.Link>
                ))
              ) : (
                <div className="px-4 py-2 text-muted" style={{ fontSize: '13px' }}>
                  <i className="fas fa-spinner fa-spin me-2"></i>Loading categories...
                </div>
              )}

              {categories && categories.length > 8 && (
                <Nav.Link
                  onClick={() => { navigate('/search?category=all'); setShowSidebar(false); }}
                  className="d-flex align-items-center py-2 px-4 text-primary"
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                  <i className="fas fa-th me-3" style={{ width: '28px', textAlign: 'center' }}></i>
                  <span style={{ fontSize: '14px' }}>View All Categories</span>
                  <i className="fas fa-arrow-right ms-auto"></i>
                </Nav.Link>
              )}

              {/* Account Section */}
              {user && (
                <>
                  <div className="px-4 py-2 bg-light mt-2">
                    <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      My Account
                    </small>
                  </div>
                  
                  <Nav.Link 
                    onClick={() => { navigateToAccountTab('profile'); setShowSidebar(false); }}
                    className="d-flex align-items-center py-3 px-4"
                    style={{ borderBottom: '1px solid #f9fafb' }}
                  >
                    <i className="fas fa-user-circle me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                    <span className="fw-500">My Profile</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => { navigateToAccountTab('orders'); setShowSidebar(false); }}
                    className="d-flex align-items-center py-3 px-4"
                    style={{ borderBottom: '1px solid #f9fafb' }}
                  >
                    <i className="fas fa-shopping-bag me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                    <span className="fw-500">My Orders</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => { navigateToAccountTab('wishlist'); setShowSidebar(false); }}
                    className="d-flex align-items-center py-3 px-4"
                    style={{ borderBottom: '1px solid #f9fafb' }}
                  >
                    <i className="fas fa-heart me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                    <span className="fw-500">Wishlist</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => { navigateToAccountTab('addresses'); setShowSidebar(false); }}
                    className="d-flex align-items-center py-3 px-4"
                    style={{ borderBottom: '1px solid #f9fafb' }}
                  >
                    <i className="fas fa-map-marker-alt me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                    <span className="fw-500">Saved Addresses</span>
                  </Nav.Link>
                </>
              )}

              {/* Quick Links */}
              <div className="px-4 py-2 bg-light mt-2">
                <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  Quick Links
                </small>
              </div>

              <Nav.Link 
                onClick={() => { navigate('/cart'); setShowSidebar(false); }}
                className="d-flex align-items-center py-3 px-4"
                style={{ borderBottom: '1px solid #f9fafb' }}
              >
                <i className="fas fa-shopping-cart me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                <span className="fw-500">Cart</span>
                {getCartItemsCount() > 0 && (
                  <Badge bg="danger" className="ms-auto">{getCartItemsCount()}</Badge>
                )}
              </Nav.Link>

              {/* Help & Support */}
              <div className="px-4 py-2 bg-light mt-2">
                <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  Help & Support
                </small>
              </div>

              <Nav.Link 
                className="d-flex align-items-center py-3 px-4"
                style={{ borderBottom: '1px solid #f9fafb' }}
              >
                <i className="fas fa-headset me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                <span className="fw-500">Customer Support</span>
              </Nav.Link>

              <Nav.Link 
                className="d-flex align-items-center py-3 px-4"
                style={{ borderBottom: '1px solid #f9fafb' }}
              >
                <i className="fas fa-info-circle me-3" style={{ width: '20px', color: '#ffd700' }}></i>
                <span className="fw-500">About Us</span>
              </Nav.Link>

              {/* Login/Logout */}
              <div className="p-4">
                {user ? (
                  <Button
                    variant="outline-danger"
                    className="w-100 d-flex align-items-center justify-content-center py-2"
                    onClick={() => { logout(); setShowSidebar(false); }}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-100 d-flex align-items-center justify-content-center py-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                      border: 'none',
                      color: '#1a1a1a',
                      fontWeight: '600'
                    }}
                    onClick={() => { navigate('/login'); setShowSidebar(false); }}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </Nav>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Location Modal */}
      <LocationModal
        show={showLocationModal}
        onHide={() => setShowLocationModal(false)}
        onLocationSelect={setCurrentLocation}
        currentLocation={currentLocation}
      />
    </>
  );
};

export default Header;