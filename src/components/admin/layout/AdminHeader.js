import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaHome, FaSignOutAlt, FaBell, FaCog } from 'react-icons/fa';

const AdminHeader = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: '#fff', borderBottom: '3px solid #ffe01b' }}>
      <div className="container-fluid px-4">
        {/* Logo matching user header */}
        <div className="navbar-brand mb-0 d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span 
            className="me-2 d-inline-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: '#ffe01b', 
              color: '#000',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              fontSize: '20px'
            }}
          >
            <i className="fas fa-bolt"></i>
          </span>
          <span className="fw-bold fs-4" style={{ color: '#000' }}>
            QuickCart
            <span className="ms-2 badge bg-warning text-dark" style={{ fontSize: '10px', verticalAlign: 'super' }}>
              Admin
            </span>
          </span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          {/* Admin Info */}
          <div className="d-none d-md-block text-end">
            <div className="fw-semibold small" style={{ color: '#333' }}>{currentUser?.name || 'Admin'}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>Administrator</div>
          </div>

          {/* Notifications */}
          <Button
            variant="light"
            size="sm"
            className="position-relative rounded-circle"
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            <FaBell style={{ color: '#666' }} />
            <Badge 
              bg="danger" 
              pill 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '9px' }}
            >
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button
            variant="light"
            size="sm"
            className="rounded-circle d-none d-md-flex"
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            <FaCog style={{ color: '#666' }} />
          </Button>

          {/* Store Button */}
          <Button
            size="sm"
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#ffe01b',
              border: 'none',
              color: '#000',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '6px 16px'
            }}
          >
            <FaHome className="me-1" />
            <span className="d-none d-md-inline">Store</span>
          </Button>

          {/* Logout */}
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleLogout}
            style={{ borderRadius: '8px', fontWeight: '600' }}
          >
            <FaSignOutAlt className="me-1" />
            <span className="d-none d-md-inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;