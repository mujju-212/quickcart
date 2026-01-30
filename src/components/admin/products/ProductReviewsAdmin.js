import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const ProductReviewsAdmin = ({ show, onHide, productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (show && productId) {
      fetchReviews();
      fetchStats();
    }
  }, [show, productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('auth_token') || localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/reviews/admin/all?product_id=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews || []);
      } else {
        setError(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const token = Cookies.get('auth_token') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reviews/admin/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Review deleted successfully');
        fetchReviews();
        fetchStats();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      const token = Cookies.get('auth_token') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reviews/admin/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Review ${newStatus} successfully`);
        fetchReviews();
        fetchStats();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update review status');
      }
    } catch (err) {
      console.error('Error updating review status:', err);
      setError('Failed to update review status');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
      />
    ));
  };

  const getStatusBadge = (status) => {
    const badges = {
      'approved': <Badge bg="success">Approved</Badge>,
      'pending': <Badge bg="warning">Pending</Badge>,
      'rejected': <Badge bg="danger">Rejected</Badge>
    };
    return badges[status] || <Badge bg="secondary">{status}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-star me-2 text-warning"></i>
          Product Reviews - {productName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {/* Review Stats */}
        {stats && (
          <div className="mb-4 p-3 bg-light rounded">
            <h6 className="mb-3">Review Statistics</h6>
            <div className="row">
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h3 text-warning mb-0">{stats.average_rating.toFixed(1)}</div>
                  <small className="text-muted">Average Rating</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h3 mb-0">{stats.total_reviews}</div>
                  <small className="text-muted">Total Reviews</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h3 mb-0">{stats.verified_purchases}</div>
                  <small className="text-muted">Verified Purchases</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="small">
                    <div>5⭐: {stats.rating_distribution['5']}</div>
                    <div>4⭐: {stats.rating_distribution['4']}</div>
                    <div>3⭐: {stats.rating_distribution['3']}</div>
                    <div>2⭐: {stats.rating_distribution['2']}</div>
                    <div>1⭐: {stats.rating_distribution['1']}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="fas fa-comment-slash fa-3x mb-3"></i>
            <p>No reviews for this product yet</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>User</th>
                  <th style={{ width: '120px' }}>Rating</th>
                  <th>Comment</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '150px' }}>Date</th>
                  <th style={{ width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id}>
                    <td>{review.id}</td>
                    <td>
                      <div>{review.user_name}</div>
                      <small className="text-muted">{review.user_phone}</small>
                      {review.verified_purchase && (
                        <div>
                          <Badge bg="success" className="mt-1">
                            <i className="fas fa-check-circle me-1"></i>
                            Verified
                          </Badge>
                        </div>
                      )}
                    </td>
                    <td>
                      <div>{renderStars(review.rating)}</div>
                      <small className="text-muted">({review.rating}/5)</small>
                    </td>
                    <td>
                      <div 
                        style={{ 
                          maxWidth: '300px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={review.comment}
                      >
                        {review.comment}
                      </div>
                    </td>
                    <td>{getStatusBadge(review.status)}</td>
                    <td>
                      <small>{formatDate(review.created_at)}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {review.status !== 'approved' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusChange(review.id, 'approved')}
                            title="Approve"
                          >
                            <i className="fas fa-check"></i>
                          </Button>
                        )}
                        {review.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleStatusChange(review.id, 'rejected')}
                            title="Reject"
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteReview(review.id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductReviewsAdmin;
