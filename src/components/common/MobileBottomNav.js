import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Badge } from 'react-bootstrap';

const MobileBottomNav = ({ onSearchClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();

  // Don't show bottom nav on login page or admin pages
  if (location.pathname === '/login' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item) => {
    if (item.path === '/search') {
      // Trigger search bar in header and scroll to top
      if (onSearchClick) {
        onSearchClick();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(item.path);
    }
  };

  const navItems = [
    {
      path: '/',
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      path: '/search',
      icon: 'fas fa-search',
      label: 'Explore'
    },
    {
      path: '/cart',
      icon: 'fas fa-shopping-cart',
      label: 'Cart',
      badge: getCartItemsCount()
    },
    {
      path: '/account',
      icon: 'fas fa-user',
      label: 'Account'
    }
  ];

  return (
    <div className="mobile-bottom-nav">
      {navItems.map((item, index) => (
        <button
          key={index}
          className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => handleNavClick(item)}
        >
          <div className="mobile-nav-icon-wrapper">
            <i className={item.icon}></i>
            {item.badge > 0 && (
              <Badge 
                bg="danger" 
                className="mobile-nav-badge"
              >
                {item.badge}
              </Badge>
            )}
          </div>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileBottomNav;
