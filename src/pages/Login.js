import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import ProfileCompletionModal from '../components/auth/ProfileCompletionModal';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [currentIdentifier, setCurrentIdentifier] = useState(''); // Store phone or email

  const { login, registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    } else if (resendTimer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (loginMethod === 'phone') {
      if (phone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      setCurrentIdentifier(phone);
    } else {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      setCurrentIdentifier(email);
    }

    setLoading(true);
    
    try {
      const result = loginMethod === 'phone' 
        ? await authService.sendOTP(phone)
        : await authService.sendEmailOTP(email);
      
      if (result.success) {
        setShowOtpModal(true);
        setOtpSent(true);
        setResendTimer(60); // 60 seconds before resend is allowed
        
        // Only show OTP in development mode if backend explicitly sends it
        if (result.development_mode && result.otp) {
          console.log(`🔔 Development Mode - OTP: ${result.otp}`);
        }
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const result = loginMethod === 'phone'
        ? await authService.verifyOTPAndLogin(phone, otp)
        : await authService.verifyEmailOTPAndLogin(email, otp);
      
      if (result.success) {
        // 🔒 SECURITY: Check for JWT token from backend
        if (result.token && result.user) {
          // Existing user with JWT token - log them in
          const identifier = loginMethod === 'phone' ? phone : email;
          await login(identifier, result.user, result.token);
          setShowOtpModal(false);
          
          // Redirect to home page
          navigate('/', { replace: true });
        } else if (result.isNewUser || !result.token) {
          // New user or no token - show profile completion modal
          setShowOtpModal(false);
          setShowProfileModal(true);
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setLoading(true);
    
    try {
      const result = loginMethod === 'phone'
        ? await authService.sendOTP(phone)
        : await authService.sendEmailOTP(email);
      
      if (result.success) {
        setResendTimer(60);
        
        // Only show OTP in development mode if backend explicitly sends it
        if (result.development_mode && result.otp) {
          console.log(`🔔 Development Mode - New OTP: ${result.otp}`);
        }
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async (user) => {
    setShowProfileModal(false);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-check-circle me-2"></i>
        Welcome, ${user.name}! Your account has been created.
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
    
    // Redirect to home page
    navigate('/', { replace: true });
  };

  const handleProfileCancel = () => {
    setShowProfileModal(false);
    setShowOtpModal(false);
    setPhone('');
    setOtp('');
  };

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h3>Login to QuickCart</h3>
                  <p className="text-muted">
                    Get groceries delivered in 10 minutes
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Login Method Toggle */}
                <div className="mb-4">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${loginMethod === 'phone' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setLoginMethod('phone');
                        setError('');
                      }}
                    >
                      <i className="fas fa-mobile-alt me-2"></i>
                      Phone
                    </button>
                    <button
                      type="button"
                      className={`btn ${loginMethod === 'email' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setLoginMethod('email');
                        setError('');
                      }}
                    >
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </button>
                  </div>
                </div>

                <Form onSubmit={handleSendOtp}>
                  {loginMethod === 'phone' ? (
                    <Form.Group className="mb-4">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter your 10-digit phone number"
                        maxLength="10"
                        required
                      />
                      <Form.Text className="text-muted">
                        We'll send you an OTP via SMS
                      </Form.Text>
                    </Form.Group>
                  ) : (
                    <Form.Group className="mb-4">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                      <Form.Text className="text-muted">
                        We'll send you an OTP via email
                      </Form.Text>
                    </Form.Group>
                  )}

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </Form>

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <i className="fas fa-shield-alt me-2"></i>
                    <strong>Secure OTP Authentication</strong><br/>
                    {loginMethod === 'phone' 
                      ? 'Enter your phone number to receive a one-time password via SMS'
                      : 'Enter your email to receive a one-time password'
                    }
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center mb-3">
            {loginMethod === 'phone' ? (
              <>Enter the OTP sent to <strong>+91 {phone}</strong></>
            ) : (
              <>Enter the OTP sent to <strong>{email}</strong></>
            )}
          </p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleVerifyOtp}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="text-center fs-4 py-3"
                style={{ letterSpacing: '0.5rem' }}
                required
              />
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 mb-3"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </Form>

          <div className="text-center">
            <div className="d-flex justify-content-between align-items-center">
              <Button 
                variant="link" 
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                  setError('');
                }}
                className="text-decoration-none"
              >
                Change {loginMethod === 'phone' ? 'Phone' : 'Email'}
              </Button>
              
              <Button 
                variant="link" 
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className="text-decoration-none"
              >
                {resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  'Resend OTP'
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Profile Completion Modal for New Users */}
      <ProfileCompletionModal
        show={showProfileModal}
        phone={loginMethod === 'phone' ? phone : ''}
        email={loginMethod === 'email' ? email : ''}
        onComplete={handleProfileComplete}
        onCancel={handleProfileCancel}
      />
    </>
  );
};

export default Login;