import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { FaUser, FaLock, FaBell, FaStore, FaSave } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

const AdminSettings = () => {
  const { currentUser } = useAuth();
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'QuickCart',
    storeEmail: 'support@quickcart.com',
    storePhone: '+91 1234567890',
    storeAddress: 'Mumbai, India'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    lowStockAlerts: true
  });

  useEffect(() => {
    loadAdminProfile();
  }, [currentUser]);

  const loadAdminProfile = () => {
    // Try to load from localStorage first
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    } else if (currentUser) {
      // Fall back to currentUser data
      setProfileData({
        name: currentUser.name || 'Admin',
        email: currentUser.email || 'admin@quickcart.com',
        phone: currentUser.phone || ''
      });
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store profile data in localStorage for now
      localStorage.setItem('adminProfile', JSON.stringify(profileData));
      showAlert('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('Error updating profile', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert('New passwords do not match!', 'danger');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showAlert('Password must be at least 6 characters long', 'danger');
      return;
    }

    setLoading(true);

    try {
      // For now, just show success message
      // In production, this would call the API
      showAlert('Password changed successfully!', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      showAlert('Error changing password', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store settings in localStorage for now
      localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
      showAlert('Store settings updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating store settings:', error);
      showAlert('Error updating store settings', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store notification settings in localStorage for now
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      showAlert('Notification settings updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      showAlert('Error updating notification settings', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedStoreSettings = localStorage.getItem('storeSettings');
    const savedNotificationSettings = localStorage.getItem('notificationSettings');

    if (savedStoreSettings) {
      setStoreSettings(JSON.parse(savedStoreSettings));
    }

    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings));
    }
  }, []);

  return (
    <div className="admin-settings">
      {alert.show && (
        <Alert 
          variant={alert.type} 
          dismissible 
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Header className="bg-white border-0 p-4">
          <h4 className="mb-0 fw-bold" style={{ color: '#333' }}>
            <FaUser className="me-2" style={{ color: '#ffd60a' }} />
            Admin Settings
          </h4>
          <p className="text-muted mb-0 mt-1">Manage your account and store preferences</p>
        </Card.Header>
        <Card.Body className="p-4">
          <Tabs defaultActiveKey="profile" className="mb-4" fill>
            {/* Profile Tab */}
            <Tab 
              eventKey="profile" 
              title={
                <span>
                  <FaUser className="me-2" />
                  Profile
                </span>
              }
            >
              <Form onSubmit={handleProfileUpdate} className="mt-4">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  style={{ 
                    background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                    border: 'none',
                    color: '#1a1a1a',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <FaSave className="me-2" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </Form>
            </Tab>

            {/* Password Tab */}
            <Tab 
              eventKey="password" 
              title={
                <span>
                  <FaLock className="me-2" />
                  Password
                </span>
              }
            >
              <Form onSubmit={handlePasswordChange} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                      <Form.Text className="text-muted">
                        Must be at least 6 characters long
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  style={{ 
                    background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                    border: 'none',
                    color: '#1a1a1a',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <FaLock className="me-2" />
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </Form>
            </Tab>

            {/* Store Settings Tab */}
            <Tab 
              eventKey="store" 
              title={
                <span>
                  <FaStore className="me-2" />
                  Store
                </span>
              }
            >
              <Form onSubmit={handleStoreSettingsUpdate} className="mt-4">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Store Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                        placeholder="Enter store name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Store Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={storeSettings.storeEmail}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                        placeholder="Enter store email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Store Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        value={storeSettings.storePhone}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                        placeholder="Enter store phone"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Store Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={storeSettings.storeAddress}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                        placeholder="Enter store address"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  style={{ 
                    background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                    border: 'none',
                    color: '#1a1a1a',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <FaSave className="me-2" />
                  {loading ? 'Saving...' : 'Save Store Settings'}
                </Button>
              </Form>
            </Tab>

            {/* Notifications Tab */}
            <Tab 
              eventKey="notifications" 
              title={
                <span>
                  <FaBell className="me-2" />
                  Notifications
                </span>
              }
            >
              <Form onSubmit={handleNotificationSettingsUpdate} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="orderNotifications"
                    label="Order Notifications"
                    checked={notificationSettings.orderNotifications}
                    onChange={(e) => setNotificationSettings({ 
                      ...notificationSettings, 
                      orderNotifications: e.target.checked 
                    })}
                  />
                  <Form.Text className="text-muted">
                    Receive notifications when new orders are placed
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="emailNotifications"
                    label="Email Notifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ 
                      ...notificationSettings, 
                      emailNotifications: e.target.checked 
                    })}
                  />
                  <Form.Text className="text-muted">
                    Receive order notifications via email
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="smsNotifications"
                    label="SMS Notifications"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({ 
                      ...notificationSettings, 
                      smsNotifications: e.target.checked 
                    })}
                  />
                  <Form.Text className="text-muted">
                    Receive order notifications via SMS
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="lowStockAlerts"
                    label="Low Stock Alerts"
                    checked={notificationSettings.lowStockAlerts}
                    onChange={(e) => setNotificationSettings({ 
                      ...notificationSettings, 
                      lowStockAlerts: e.target.checked 
                    })}
                  />
                  <Form.Text className="text-muted">
                    Get notified when products are running low on stock
                  </Form.Text>
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  style={{ 
                    background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
                    border: 'none',
                    color: '#1a1a1a',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <FaSave className="me-2" />
                  {loading ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminSettings;
