// src/pages/Cart.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import offersService from '../services/offersService';

const Cart = () => {
  const { cart, getCartTotal, getCartItemsCount } = useCart();
  const { user, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 99 ? 0 : 29;
  const handlingFee = 5;
  
  // Calculate discount
  let discount = 0;
  let freeDelivery = false;
  
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount_amount) {
        discount = Math.min(discount, parseFloat(appliedCoupon.max_discount_amount));
      }
    } else if (appliedCoupon.discount_type === 'fixed') {
      discount = Math.min(parseFloat(appliedCoupon.discount_value), subtotal);
    } else if (appliedCoupon.discount_type === 'free_delivery') {
      freeDelivery = true;
    }
  }
  
  const finalDeliveryFee = freeDelivery ? 0 : deliveryFee;
  const total = subtotal - discount + finalDeliveryFee + handlingFee;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const result = await offersService.validateOffer(couponCode.toUpperCase(), subtotal);
      
      if (result.valid) {
        setAppliedCoupon(result.offer);
        setCouponSuccess(result.message);
        setCouponError('');
      } else {
        setCouponError(result.message);
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError(error.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  };

  const handleProceedToCheckout = () => {
    if (!user && !currentUser) {
      // Save current location and redirect to login
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    // Pass coupon data to checkout
    navigate('/checkout', { 
      state: { 
        appliedCoupon,
        discount,
        freeDelivery 
      } 
    });
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Add some items to get started</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
          >
            <i className="fas fa-shopping-cart me-2"></i>
            Start Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-shopping-cart me-2"></i>
                Shopping Cart ({getCartItemsCount()} items)
              </h5>
            </Card.Header>
            <Card.Body>
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
            <Card.Header>
              <h6 className="mb-0">Order Summary</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({getCartItemsCount()} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {/* Coupon Section */}
              <div className="my-3">
                <label className="form-label small fw-bold mb-2">
                  <i className="fas fa-ticket-alt me-2"></i>
                  Have a Coupon?
                </label>
                
                {!appliedCoupon ? (
                  <>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        disabled={couponLoading}
                      />
                      <Button 
                        variant="outline-primary"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        style={{ 
                          borderColor: '#f8cb46',
                          color: '#333',
                          backgroundColor: '#f8cb46'
                        }}
                      >
                        {couponLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </InputGroup>
                    
                    {couponError && (
                      <Alert variant="danger" className="small py-2 mb-0">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {couponError}
                      </Alert>
                    )}
                  </>
                ) : (
                  <div className="d-flex align-items-center justify-content-between p-2 bg-success bg-opacity-10 border border-success rounded">
                    <div className="flex-grow-1">
                      <div className="text-success fw-bold small">
                        <i className="fas fa-check-circle me-1"></i>
                        {appliedCoupon.code} Applied
                      </div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>
                        {couponSuccess}
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-danger p-0 ms-2"
                      onClick={handleRemoveCoupon}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Discount Display */}
              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee {freeDelivery && <small className="text-success">(FREE)</small>}</span>
                <span className={freeDelivery ? 'text-decoration-line-through text-muted' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Handling Fee</span>
                <span>₹{handlingFee}</span>
              </div>
              
              {subtotal < 99 && (
                <Alert variant="info" className="small py-2 mt-3">
                  <i className="fas fa-info-circle me-1"></i>
                  Add ₹{99 - subtotal} more for FREE delivery!
                </Alert>
              )}
              
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-success">₹{total.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="text-center mt-2">
                  <small className="text-success fw-bold">
                    🎉 You saved ₹{discount.toFixed(2)}!
                  </small>
                </div>
              )}
              
              <Button 
                variant="primary" 
                className="w-100 mt-3"
                onClick={handleProceedToCheckout}
                style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000', fontWeight: '600' }}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </Button>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Safe and secure checkout
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;