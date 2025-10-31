import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dob: currentUser?.dob || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user data in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.phone === currentUser.phone);
      
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...formData
        };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        
        // Update context if updateUser function exists
        if (updateUser) {
          updateUser(users[userIndex]);
        }
      }
      
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">My Profile</h5>
      </Card.Header>
      <Card.Body>
        {success && (
          <Alert variant="success">
            Profile updated successfully!
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled
              title="Phone number cannot be changed"
            />
            <Form.Text className="text-muted">
              Phone number cannot be changed
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            <Form.Text className="text-muted">
              Your date of birth for special birthday offers
            </Form.Text>
          </Form.Group>

          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Profile;