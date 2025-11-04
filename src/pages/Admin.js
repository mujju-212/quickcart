import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { FaTachometerAlt } from 'react-icons/fa';

// Import admin components
import AdminLayout from '../components/admin/layout/AdminLayout';
import Dashboard from '../components/admin/dashboard/Dashboard';
import OrderManagement from '../components/admin/OrderManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import ProductManagement from '../components/admin/ProductManagement';
import OffersManagement from '../components/admin/offers/OffersManagement';
import BannerManagement from '../components/admin/banners/BannerManagement';
import Users from '../components/admin/users/Users';
import AdminSettings from '../components/admin/settings/AdminSettings';

const Admin = () => {
  const { logout, isAdmin, currentUser, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Listen for tab switch events from notifications
  useEffect(() => {
    const handleTabSwitch = (event) => {
      setActiveTab(event.detail);
    };
    
    window.addEventListener('switchAdminTab', handleTabSwitch);
    return () => window.removeEventListener('switchAdminTab', handleTabSwitch);
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // 🔒 SECURITY: Call backend admin login to get JWT token
      const result = await authService.adminLogin(credentials.username, credentials.password);
      
      if (result.success && result.token && result.user) {
        // Store admin data with JWT token in AuthContext
        adminLogin(credentials.username, credentials.password, result.token);
      } else {
        setError(result.message || 'Invalid admin credentials. Use username: admin, password: admin123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render login form if not authenticated
  if (!isAdmin) {
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <Container>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <Card className="shadow-lg border-0" style={{ 
                borderRadius: '20px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
                  padding: '3rem 2rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <div style={{
                      background: '#ffd700',
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 style={{ color: '#ffffff', fontWeight: 'bold', margin: 0, fontSize: '1.8rem' }}>
                      QuickCart
                    </h2>
                  </div>
                  <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.95rem' }}>
                    Admin Dashboard
                  </p>
                </div>

                <Card.Body className="p-5">
                  {error && (
                    <Alert 
                      variant="danger" 
                      style={{ 
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#fee',
                        color: '#c33'
                      }}
                    >
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleAdminLogin}>
                    <Form.Group className="mb-4">
                      <Form.Label style={{ 
                        color: '#2c2c2c', 
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        marginBottom: '0.75rem'
                      }}>
                        <i className="fas fa-user me-2" style={{ color: '#ffd700' }}></i>
                        Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          username: e.target.value
                        })}
                        placeholder="Enter your admin username"
                        required
                        style={{ 
                          borderRadius: '12px', 
                          border: '2px solid #e5e7eb', 
                          padding: '14px 18px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#ffd700'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ 
                        color: '#2c2c2c', 
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        marginBottom: '0.75rem'
                      }}>
                        <i className="fas fa-lock me-2" style={{ color: '#ffd700' }}></i>
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          password: e.target.value
                        })}
                        placeholder="Enter your admin password"
                        required
                        style={{ 
                          borderRadius: '12px', 
                          border: '2px solid #e5e7eb', 
                          padding: '14px 18px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#ffd700'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="w-100"
                      disabled={loading}
                      style={{ 
                        background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        padding: '14px', 
                        fontWeight: '700',
                        fontSize: '1rem',
                        color: '#1a1a1a',
                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        marginBottom: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In to Dashboard
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ffd700'}
                        onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Store
                      </button>
                    </div>
                  </Form>

                  <div className="text-center mt-3">
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/')}
                      className="text-decoration-none"
                      style={{ color: '#ffd60a', fontWeight: '500' }}
                    >
                      Back to Store
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Render component based on active tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'products':
        return <ProductManagement />;
      case 'offers':
        return <OffersManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'users':
        return <Users />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <Dashboard />;
    }
  };

  // Render admin dashboard with layout
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveComponent()}
    </AdminLayout>
  );
};

export default Admin;