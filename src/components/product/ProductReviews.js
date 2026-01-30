import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Modal, Badge, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average_rating: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews || []);
        setStats(data.stats || { average_rating: 0, total_reviews: 0 });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Review submitted successfully!');
        setNewReview({ rating: 5, comment: '' });
        setShowReviewModal(false);
        fetchReviews();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'} ${interactive ? 'cursor-pointer' : ''}`}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
        onClick={interactive ? () => onRatingChange(index + 1) : undefined}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card className="mt-4">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-2 text-muted">Loading reviews...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      
      <Card className="mt-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Customer Reviews</h5>
            <Button 
              variant="outline-primary" 
              onClick={() => {
                if (!user) {
                  setError('Please login to write a review');
                  setTimeout(() => setError(''), 3000);
                  return;
                }
                setShowReviewModal(true);
              }}
            >
              <i className="fas fa-pen me-2"></i>Write Review
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          
          <Row className="mb-4">
            <Col md={4}>
              <div className="text-center">
                <div className="display-4 fw-bold text-warning">
                  {stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'}
                </div>
                <div className="mb-2">{renderStars(Math.round(stats.average_rating || 0))}</div>
                <div className="text-muted">{stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}</div>
              </div>
            </Col>
            <Col md={8}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = Array.isArray(reviews) ? reviews.filter(r => r.rating === star).length : 0;
                const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                
                return (
                  <div key={star} className="d-flex align-items-center mb-1">
                    <span className="me-2">{star}</span>
                    <i className="fas fa-star text-warning me-2"></i>
                    <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-muted small">{count}</span>
                  </div>
                );
              })}
            </Col>
          </Row>

          <div className="reviews-list">
            {!Array.isArray(reviews) || reviews.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-comment-slash fa-3x mb-3"></i>
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <strong>{review.user_name}</strong>
                        {review.verified_purchase && (
                          <Badge bg="success" className="small">
                            <i className="fas fa-check-circle me-1"></i>Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="small text-muted">{formatDate(review.created_at)}</div>
                    </div>
                    <div>{renderStars(review.rating)}</div>
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => {
        setShowReviewModal(false);
        setError('');
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitReview}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Rating <span className="text-danger">*</span></Form.Label>
              <div className="fs-4">
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({ ...newReview, rating })
                )}
                <span className="ms-2 fs-6 text-muted">({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})</span>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Your Review <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product... (minimum 10 characters)"
                required
                minLength={10}
                maxLength={1000}
              />
              <Form.Text className="text-muted">
                {newReview.comment.length}/1000 characters (minimum 10 required)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                setShowReviewModal(false);
                setError('');
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={submitting || newReview.comment.trim().length < 10}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>Submit Review
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProductReviews;
