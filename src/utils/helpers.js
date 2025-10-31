// Utility functions for the application

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateOrderId = () => {
  return 'QC' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\D/g, ''));
};

export const validatePincode = (pincode) => {
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pincode);
};

export const getImagePlaceholder = (width = 400, height = 400, text = 'Image') => {
  // Create a data URI SVG placeholder instead of using external service
  // Sanitize text to prevent SVG injection and handle special characters
  const sanitizedText = text.replace(/[<>&"']/g, '').substring(0, 20);
  const fontSize = Math.max(12, Math.min(width, height) / 8);
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" 
            fill="#6c757d" text-anchor="middle" dominant-baseline="central">${sanitizedText}</text>
    </svg>
  `;
  
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (error) {
    // Fallback for environments where btoa might fail
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
};

export const getColoredPlaceholder = (width = 80, height = 80, text = 'C', bgColor = '#ffe01b', textColor = '#000000') => {
  // Create a colored placeholder for categories
  const sanitizedText = text.replace(/[<>&"']/g, '').substring(0, 3);
  const fontSize = Math.max(16, Math.min(width, height) / 3);
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${bgColor}" stroke="#dee2e6" stroke-width="1"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"
            fill="${textColor}" text-anchor="middle" dominant-baseline="central">${sanitizedText}</text>
    </svg>
  `;
  
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (error) {
    // Fallback for environments where btoa might fail
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getRandomColor = () => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

// Helper function to get the primary product image from image_url field
export const getProductImage = (product) => {
  if (!product) return '';

  // Try image_url first (database field)
  if (product.image_url) {
    try {
      // Try to parse as JSON array (multiple images)
      const parsedImages = JSON.parse(product.image_url);
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        return parsedImages[0]; // Return first image
      }
    } catch {
      // If not JSON, treat as single image URL
      return product.image_url;
    }
  }

  // Fallback to legacy image field
  if (product.image) {
    return product.image;
  }

  return '';
};

// Helper function to get all product images
export const getProductImages = (product) => {
  if (!product) return [];

  // Try image_url first (database field)
  if (product.image_url) {
    try {
      // Try to parse as JSON array (multiple images)
      const parsedImages = JSON.parse(product.image_url);
      if (Array.isArray(parsedImages)) {
        return parsedImages.filter(url => url && url.trim() !== '');
      }
    } catch {
      // If not JSON, treat as single image URL
      if (product.image_url.trim() !== '') {
        return [product.image_url];
      }
    }
  }

  // Fallback to legacy image field
  if (product.image && product.image.trim() !== '') {
    return [product.image];
  }

  return [];
};