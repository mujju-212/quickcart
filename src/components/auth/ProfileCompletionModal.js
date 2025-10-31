import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ProfileCompletionModal = ({ show, phone, onComplete, onCancel }) => {
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await registerUser(
        phone,
        formData.name.trim(),
        formData.email.trim() || null,
        formData.dob || null
      );

      if (result.success) {
        onComplete(result.user);
      } else {
        setError(result.error || 'Failed to complete profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onCancel}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          <i className="fas fa-user-circle me-2 text-success"></i>
          Complete Your Profile
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p className="text-muted mb-4">
          Welcome! Please provide your details to complete registration.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Full Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address (Optional)</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <Form.Text className="text-muted">
              We'll use this for order updates and offers
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Date of Birth (Optional)</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            <Form.Text className="text-muted">
              Get special birthday offers!
            </Form.Text>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Complete Registration
                </>
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileCompletionModal;
