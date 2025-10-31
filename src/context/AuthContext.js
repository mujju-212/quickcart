// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null); // 🔒 NEW: JWT token state
  const [loading, setLoading] = useState(true);

  // Initialize user from cookies (faster than localStorage)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // 🔒 SECURITY: Get JWT token from cookie
        const token = Cookies.get('auth_token');
        
        // Try cookie first (faster)
        const userCookie = Cookies.get('quickcart_user');
        if (userCookie) {
          const userData = JSON.parse(userCookie);
          setUser(userData);
          setCurrentUser(userData);
          
          // Set token if available
          if (token) {
            setAuthToken(token);
          }
          
          setLoading(false);
          return;
        }

        // Fallback to localStorage for backward compatibility
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setCurrentUser(userData);
          
          if (storedToken) {
            setAuthToken(storedToken);
          }
          
          // Migrate to cookie
          Cookies.set('quickcart_user', JSON.stringify(userData), COOKIE_OPTIONS);
          if (storedToken) {
            Cookies.set('auth_token', storedToken, COOKIE_OPTIONS);
          }
          localStorage.removeItem('user'); // Clean up
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Memoized login function
  const login = useCallback(async (phone, userData = null, token = null) => {
    try {
      if (userData && token) {
        // 🔒 SECURITY: Store user data and JWT token
        setUser(userData);
        setCurrentUser(userData);
        setAuthToken(token);
        Cookies.set('quickcart_user', JSON.stringify(userData), COOKIE_OPTIONS);
        Cookies.set('auth_token', token, COOKIE_OPTIONS); // 🔒 Store JWT
        return { success: true, user: userData };
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/users/profile?phone=${phone}`);
      const data = await response.json();

      if (data.success && data.user) {
        const userData = data.user;
        setUser(userData);
        setCurrentUser(userData);
        Cookies.set('quickcart_user', JSON.stringify(userData), COOKIE_OPTIONS);
        
        // Show success notification
        showNotification(`Welcome back, ${userData.name}!`, 'success');
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const adminLogin = useCallback((username, password, token = null) => {
    if (username === 'admin' && password === 'admin123') {
      const adminData = {
        id: 1,
        name: 'Admin',
        username: username,
        isAdmin: true
      };
      
      setUser(adminData);
      setCurrentUser(adminData);
      Cookies.set('quickcart_user', JSON.stringify(adminData), COOKIE_OPTIONS);
      
      // 🔒 Store admin JWT token if provided
      if (token) {
        setAuthToken(token);
        Cookies.set('auth_token', token, COOKIE_OPTIONS);
      }
      
      showNotification('Admin login successful!', 'success');
      
      return true;
    }
    return false;
  }, []);

  const registerUser = useCallback(async (phone, name, email, dob = null) => {
    try {
      // 🔒 SECURITY: Call complete-profile endpoint which returns JWT token
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, name, email, dob })
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        // 🔒 Store user and JWT token
        setUser(data.user);
        setCurrentUser(data.user);
        setAuthToken(data.token);
        Cookies.set('quickcart_user', JSON.stringify(data.user), COOKIE_OPTIONS);
        Cookies.set('auth_token', data.token, COOKIE_OPTIONS);
        
        // Also store in localStorage for authService compatibility
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        return { success: true, user: data.user, isNewUser: true };
      } else {
        return { success: false, error: data.error || data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentUser(null);
    setAuthToken(null); // 🔒 Clear token
    Cookies.remove('quickcart_user');
    Cookies.remove('auth_token'); // 🔒 Remove JWT token
    localStorage.removeItem('user'); // Clean up legacy storage
    localStorage.removeItem('currentUser'); // Clean up
    localStorage.removeItem('authToken'); // Clean up
    localStorage.removeItem('isAdmin'); // Clean up admin flag
    
    showNotification('Logged out successfully', 'info');
  }, []);

  const updateUser = useCallback((updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setUser(updatedUser);
    setCurrentUser(updatedUser);
    Cookies.set('quickcart_user', JSON.stringify(updatedUser), COOKIE_OPTIONS);
  }, [currentUser]);

  // Helper function for notifications (optimized)
  const showNotification = (message, type = 'success') => {
    const colors = {
      success: '#26a541',
      info: '#6c757d',
      error: '#dc3545'
    };

    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: ${colors[type]}; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const value = {
    user,
    currentUser, // Add this for compatibility
    authToken, // 🔒 NEW: Expose JWT token
    isAdmin: user?.isAdmin || false, // Add isAdmin computed property
    login,
    adminLogin,
    registerUser,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};