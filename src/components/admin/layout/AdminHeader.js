import React, { useState, useEffect } from 'react';
import { Button, Badge, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaHome, FaSignOutAlt, FaBell, FaCog, FaShoppingCart, FaCheckCircle, FaTimes } from 'react-icons/fa';
import orderService from '../../../services/orderService';

const AdminHeader = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const orders = await orderService.getAllOrders();
      
      // Get read notification IDs from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      
      if (orders && orders.length > 0) {
        // Get recent pending/confirmed orders from real data
        const recentOrders = orders
          .filter(order => {
            const status = (order.status || '').toLowerCase();
            return status === 'pending' || status === 'confirmed';
          })
          .sort((a, b) => {
            // Sort by created_at or date, most recent first
            const dateA = new Date(a.created_at || a.date || 0);
            const dateB = new Date(b.created_at || b.date || 0);
            return dateB - dateA;
          })
          .slice(0, 5)
          .map(order => {
            const orderTime = new Date(order.created_at || order.date);
            const customerName = order.user_name || order.customer || order.customerName || 'Guest';
            const total = parseFloat(order.total || order.amount || 0);
            const orderId = `order_${order.id}`;
            
            return {
              id: orderId,
              orderId: order.id,
              type: 'order',
              title: `New Order #${order.id}`,
              message: `${customerName} - ₹${total.toFixed(2)}`,
              time: orderTime,
              read: readNotifications.includes(orderId),
              status: order.status
            };
          });
        
        setNotifications(recentOrders);
        // Count only unread notifications
        const unreadNotifs = recentOrders.filter(n => !n.read);
        setUnreadCount(unreadNotifs.length);
      } else {
        // No pending/confirmed orders
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      // On error, clear notifications instead of showing dummy data
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAllAsRead = () => {
    // Mark all current notifications as read
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    const allNotificationIds = notifications.map(n => n.id);
    const updatedReadNotifications = [...new Set([...readNotifications, ...allNotificationIds])];
    localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));
    
    // Update state
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    setShowNotifications(false);
  };

  const handleNotificationClick = (notification) => {
    // Mark this notification as read
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readNotifications.includes(notification.id)) {
      readNotifications.push(notification.id);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      
      // Update state
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    // Navigate to orders tab
    window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'orders' }));
    setShowNotifications(false);
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav 
      className="navbar navbar-expand-lg shadow-sm sticky-top" 
      style={{ 
        backgroundColor: '#fff', 
        borderBottom: '3px solid #ffd60a',
        zIndex: 1050
      }}
    >
      <div className="container-fluid px-4">
        {/* Logo */}
        <div 
          className="navbar-brand mb-0 d-flex align-items-center" 
          style={{ cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          <div
            className="me-2 d-inline-flex align-items-center justify-content-center"
            style={{ 
              background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
              color: '#1a1a1a',
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              fontSize: '22px',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
          >
            <i className="fas fa-bolt"></i>
          </div>
          <div>
            <span className="fw-bold fs-4" style={{ color: '#000' }}>
              QuickCart
            </span>
            <span 
              className="ms-2 badge" 
              style={{ 
                fontSize: '10px', 
                verticalAlign: 'super',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: '6px'
              }}
            >
              ADMIN
            </span>
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          {/* Admin Info */}
          <div className="d-none d-lg-block text-end me-3">
            <div className="fw-semibold" style={{ color: '#333', fontSize: '14px' }}>
              {currentUser?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              Administrator
            </div>
          </div>

          {/* Notifications Dropdown */}
          <Dropdown show={showNotifications} onToggle={setShowNotifications} align="end">
            <Dropdown.Toggle
              as={Button}
              variant="light"
              className="position-relative border-0"
              style={{ 
                width: '44px', 
                height: '44px', 
                padding: 0,
                borderRadius: '10px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <FaBell style={{ color: '#666', fontSize: '18px' }} />
              {unreadCount > 0 && (
                <Badge 
                  bg="danger" 
                  pill 
                  className="position-absolute"
                  style={{ 
                    fontSize: '9px',
                    top: '5px',
                    right: '5px',
                    padding: '3px 6px'
                  }}
                >
                  {unreadCount}
                </Badge>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu 
              style={{ 
                width: '350px', 
                maxHeight: '400px', 
                overflowY: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                border: '1px solid #e0e0e0'
              }}
            >
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Notifications</h6>
                {unreadCount > 0 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-decoration-none p-0"
                    onClick={markAllAsRead}
                    style={{ fontSize: '12px' }}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <FaCheckCircle size={40} className="mb-2" style={{ opacity: 0.3 }} />
                  <p className="mb-0">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleNotificationClick(notif)}
                    className="border-bottom"
                    style={{ 
                      padding: '12px 16px',
                      backgroundColor: notif.read ? '#fff' : '#fff9e6'
                    }}
                  >
                    <div className="d-flex align-items-start gap-2">
                      <div 
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: notif.status === 'pending' ? '#fff3cd' : '#d1ecf1',
                          color: notif.status === 'pending' ? '#856404' : '#0c5460'
                        }}
                      >
                        <FaShoppingCart />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold" style={{ fontSize: '13px' }}>
                          {notif.title}
                        </div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>
                          {notif.message}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {getRelativeTime(notif.time)}
                        </div>
                      </div>
                    </div>
                  </Dropdown.Item>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Settings Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="light"
              className="d-none d-md-flex border-0"
              style={{ 
                width: '44px', 
                height: '44px', 
                padding: 0,
                borderRadius: '10px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <FaCog style={{ color: '#666', fontSize: '18px' }} />
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ borderRadius: '10px', minWidth: '200px' }}>
              <Dropdown.Item onClick={() => window.dispatchEvent(new CustomEvent('switchAdminTab', { detail: 'settings' }))}>
                <FaCog className="me-2" />
                Account Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => loadNotifications()}>
                <FaBell className="me-2" />
                Refresh Notifications
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Divider */}
          <div className="d-none d-md-block" style={{ 
            width: '1px', 
            height: '30px', 
            backgroundColor: '#e0e0e0',
            margin: '0 8px'
          }}></div>

          {/* Store Button */}
          <Button
            size="sm"
            onClick={() => navigate('/')}
            className="d-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)',
              border: 'none',
              color: '#1a1a1a',
              fontWeight: '600',
              borderRadius: '10px',
              padding: '10px 20px',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
          >
            <FaHome />
            <span className="d-none d-md-inline">Store</span>
          </Button>

          {/* Logout */}
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleLogout}
            className="d-flex align-items-center gap-2"
            style={{ 
              borderRadius: '10px', 
              fontWeight: '600',
              borderWidth: '2px',
              padding: '10px 20px'
            }}
          >
            <FaSignOutAlt />
            <span className="d-none d-md-inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;