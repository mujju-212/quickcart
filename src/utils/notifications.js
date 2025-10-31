/**
 * Utility functions for displaying notifications
 */

export const showNotification = (message, type = 'success', duration = 3000) => {
  const notification = document.createElement('div');
  
  // Color mapping for different notification types
  const colors = {
    success: '#26a541',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    wishlist: '#dc3545',
    remove: '#6c757d'
  };

  // Icon mapping for different notification types
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
    wishlist: 'fas fa-heart',
    remove: 'fas fa-heart',
    location: 'fas fa-map-marker-alt',
    cart: 'fas fa-shopping-cart'
  };

  const backgroundColor = colors[type] || colors.success;
  const icon = icons[type] || icons.success;

  notification.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: ${backgroundColor}; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1055; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideInRight 0.3s ease-out;">
      <i class="${icon} me-2"></i>
      ${message}
    </div>
  `;

  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, duration);

  return notification;
};

// Convenience functions for common notification types
export const showSuccessNotification = (message, duration) => 
  showNotification(message, 'success', duration);

export const showErrorNotification = (message, duration) => 
  showNotification(message, 'error', duration);

export const showWarningNotification = (message, duration) => 
  showNotification(message, 'warning', duration);

export const showInfoNotification = (message, duration) => 
  showNotification(message, 'info', duration);

export const showWishlistNotification = (productName, added, duration) => {
  const message = added ? `Added ${productName} to wishlist!` : `Removed ${productName} from wishlist!`;
  const type = added ? 'wishlist' : 'remove';
  return showNotification(message, type, duration);
};

export const showCartNotification = (productName, quantity = 1, duration) => {
  const message = quantity > 1 
    ? `${quantity} x ${productName} added to cart!`
    : `${productName} added to cart!`;
  return showNotification(message, 'success', duration);
};

export const showLocationNotification = (location, duration) => 
  showNotification(`Location updated to ${location}`, 'info', duration);