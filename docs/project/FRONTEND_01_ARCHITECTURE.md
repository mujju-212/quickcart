# QuickCart - Frontend Architecture

## ⚛️ React Application Architecture Guide

This document provides a comprehensive overview of QuickCart's frontend architecture, built with React 18, covering component structure, state management, routing, and performance optimizations.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Component Hierarchy](#component-hierarchy)
4. [State Management](#state-management)
5. [Routing Strategy](#routing-strategy)
6. [Performance Optimization](#performance-optimization)
7. [Code Splitting](#code-splitting)
8. [Build Configuration](#build-configuration)
9. [Design Patterns](#design-patterns)
10. [Best Practices](#best-practices)

---

## 🎯 Architecture Overview

### Frontend Stack

```
┌─────────────────────────────────────────────────────┐
│              QuickCart Frontend Stack               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  React 18.2.0          - UI Library                 │
│  React Router 6.3.0    - Client-side routing        │
│  Context API           - State management           │
│  Bootstrap 5.2.0       - CSS framework              │
│  React Bootstrap 2.5.0 - React components           │
│  Axios/Fetch           - HTTP client                │
│  js-cookie             - Cookie management          │
│  jsPDF                 - PDF generation             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Application Architecture Pattern

QuickCart follows a **Component-Based Architecture** with:
- **Presentational Components**: UI rendering
- **Container Components**: Business logic
- **Context Providers**: Global state
- **Custom Hooks**: Reusable logic
- **Service Layer**: API communication

```
┌───────────────────────────────────────────────────┐
│                  User Interface                   │
├───────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────┐  ┌──────────────┐             │
│  │   Pages      │  │  Components  │             │
│  │              │  │              │             │
│  │ - Home       │  │ - Header     │             │
│  │ - Product    │  │ - Footer     │             │
│  │ - Cart       │  │ - ProductCard│             │
│  │ - Admin      │  │ - CartItem   │             │
│  └──────────────┘  └──────────────┘             │
│         ↓                  ↓                      │
│  ┌─────────────────────────────────────┐         │
│  │      Context Providers               │         │
│  │  - AuthContext (user, login, logout)│         │
│  │  - CartContext (cart, add, remove)  │         │
│  │  - WishlistContext                  │         │
│  │  - LocationContext                  │         │
│  └─────────────────────────────────────┘         │
│         ↓                                         │
│  ┌─────────────────────────────────────┐         │
│  │         Services Layer               │         │
│  │  - cartService                       │         │
│  │  - productService                    │         │
│  │  - orderService                      │         │
│  │  - authService                       │         │
│  └─────────────────────────────────────┘         │
│         ↓                                         │
│  ┌─────────────────────────────────────┐         │
│  │        Backend API                   │         │
│  │    (Flask REST API)                  │         │
│  └─────────────────────────────────────┘         │
│                                                    │
└───────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

### Complete Directory Tree

```
src/
├── App.js                      # Main app component
├── App.css                     # Global styles
├── index.js                    # Entry point
├── index.css                   # Base styles
├── ModernAppWrapper.js         # App wrapper
├── reportWebVitals.js          # Performance monitoring
│
├── assets/                     # Static assets
│   ├── icons/                  # Icon files
│   ├── images/                 # Image files
│   └── styles/                 # Additional styles
│
├── components/                 # Reusable components
│   ├── account/               # Account components
│   │   ├── AddressForm.js
│   │   ├── OrderHistory.js
│   │   └── ProfileForm.js
│   │
│   ├── address/               # Address management
│   │   ├── AddressCard.js
│   │   └── AddressSelector.js
│   │
│   ├── admin/                 # Admin components
│   │   ├── ProductManagement.js
│   │   ├── OrderManagement.js
│   │   ├── CategoryManagement.js
│   │   └── dashboard/
│   │       └── Dashboard.js
│   │
│   ├── auth/                  # Authentication
│   │   ├── LoginForm.js
│   │   └── OTPModal.js
│   │
│   ├── cart/                  # Cart components
│   │   ├── CartItem.js
│   │   ├── CartSummary.js
│   │   └── EmptyCart.js
│   │
│   ├── checkout/              # Checkout flow
│   │   ├── CheckoutForm.js
│   │   ├── PaymentMethod.js
│   │   └── OrderSummary.js
│   │
│   ├── common/                # Shared components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── LoadingSpinner.js
│   │   ├── ErrorBoundary.js
│   │   ├── ProtectedRoute.js
│   │   ├── BackToTop.js
│   │   ├── Banner.js
│   │   └── MobileBottomNav.js
│   │
│   ├── forms/                 # Form components
│   │   ├── Input.js
│   │   ├── Select.js
│   │   └── Button.js
│   │
│   ├── order/                 # Order components
│   │   ├── OrderCard.js
│   │   ├── OrderTimeline.js
│   │   └── OrderDetails.js
│   │
│   ├── product/               # Product components
│   │   ├── ProductCard.js
│   │   ├── ProductGrid.js
│   │   ├── ProductFilter.js
│   │   └── ProductReviews.js
│   │
│   └── search/                # Search components
│       ├── SearchBar.js
│       └── SearchResults.js
│
├── context/                   # Context providers
│   ├── AuthContext.js         # Authentication state
│   ├── CartContext.js         # Cart state
│   ├── WishlistContext.js     # Wishlist state
│   └── LocationContext.js     # Location state
│
├── hooks/                     # Custom hooks
│   ├── useAuth.js            # Auth operations
│   ├── useCart.js            # Cart operations
│   ├── useDebounce.js        # Debounce utility
│   └── useLocalStorage.js    # LocalStorage hook
│
├── pages/                     # Page components
│   ├── Home.js               # Homepage
│   ├── ProductDetails.js     # Product detail page
│   ├── SearchResults.js      # Search results
│   ├── Cart.js               # Shopping cart
│   ├── Checkout.js           # Checkout page
│   ├── Account.js            # User account
│   ├── Login.js              # Login page
│   ├── Admin.js              # Admin dashboard
│   ├── OrderConfirmation.js  # Order success
│   ├── AboutUs.js            # About page
│   ├── ContactUs.js          # Contact page
│   └── PrivacyPolicy.js      # Privacy policy
│
├── services/                  # API services
│   ├── api.js                # Base API config
│   ├── authService.js        # Auth APIs
│   ├── productService.js     # Product APIs
│   ├── cartService.js        # Cart APIs
│   ├── orderService.js       # Order APIs
│   └── userService.js        # User APIs
│
└── utils/                     # Utility functions
    ├── constants.js          # App constants
    ├── helpers.js            # Helper functions
    ├── validators.js         # Input validators
    └── formatters.js         # Data formatters
```

---

## 🏗️ Component Hierarchy

### Root Level Structure

```javascript
// App.js - Root Component
<AuthProvider>
  <CartProvider>
    <WishlistProvider>
      <LocationProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={<Admin />} />
                {/* More routes... */}
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </LocationProvider>
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
```

### Context Provider Hierarchy

```
AuthProvider (outermost)
    ↓
CartProvider (depends on AuthProvider)
    ↓
WishlistProvider (depends on AuthProvider)
    ↓
LocationProvider (independent)
    ↓
Application Components
```

### Layout Component Structure

```javascript
// Layout.js
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin layout (no header/footer)
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <MobileBottomNav />
    </>
  );
}
```

---

## 🔄 State Management

### Context API Usage

QuickCart uses **React Context API** for global state management:

#### 1. AuthContext - Authentication State

**Purpose**: Manage user authentication, login, logout

```javascript
// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from cookies
  useEffect(() => {
    const token = Cookies.get('auth_token');
    const userCookie = Cookies.get('quickcart_user');
    
    if (userCookie && token) {
      setUser(JSON.parse(userCookie));
      setAuthToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (phone, userData, token) => {
    setUser(userData);
    setAuthToken(token);
    
    // Store in cookies (secure)
    Cookies.set('quickcart_user', JSON.stringify(userData), {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    Cookies.set('auth_token', token, {
      expires: 7,
      secure: true,
      sameSite: 'strict'
    });
    
    // Also in localStorage for compatibility
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    Cookies.remove('quickcart_user');
    Cookies.remove('auth_token');
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

**Usage in Components:**
```javascript
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
```

#### 2. CartContext - Shopping Cart State

**Purpose**: Manage cart items, add/remove products

```javascript
// context/CartContext.js
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from database (logged-in users)
  useEffect(() => {
    if (user?.phone) {
      loadCartFromDatabase();
    } else {
      // Guest user - use localStorage
      const storedCart = localStorage.getItem('cart');
      if (storedCart) setCart(JSON.parse(storedCart));
    }
  }, [user]);

  // Sync to localStorage (guest users)
  useEffect(() => {
    if (!user?.phone) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user?.phone) {
      // Logged-in: save to database
      await cartService.addToCart(user.phone, product.id, quantity);
      await loadCartFromDatabase();
    } else {
      // Guest: update local state
      updateLocalCart(product, quantity);
    }
  };

  const removeFromCart = async (productId) => {
    if (user?.phone) {
      await cartService.removeFromCart(user.phone, productId);
      await loadCartFromDatabase();
    } else {
      setCart(prev => prev.filter(item => item.id !== productId));
    }
  };

  const clearCart = async () => {
    if (user?.phone) {
      await cartService.clearCart(user.phone);
    }
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

#### 3. WishlistContext - Wishlist State

**Purpose**: Manage wishlist items

```javascript
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const addToWishlist = async (product) => {
    if (user?.phone) {
      await wishlistService.addToWishlist(user.phone, product.id);
      await loadWishlist();
    } else {
      setWishlist(prev => [...prev, product]);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (user?.phone) {
      await wishlistService.removeFromWishlist(user.phone, productId);
      await loadWishlist();
    } else {
      setWishlist(prev => prev.filter(item => item.id !== productId));
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
```

### State Flow Diagram

```
┌─────────────────────────────────────────────────┐
│              Component Tree                     │
│                                                  │
│  App.js                                         │
│    ↓                                            │
│  AuthProvider → manages user & token           │
│    ↓                                            │
│  CartProvider → manages cart items             │
│    ↓            (depends on user)              │
│  WishlistProvider → manages wishlist           │
│    ↓            (depends on user)              │
│  Pages/Components                               │
│    ↓                                            │
│  useAuth(), useCart(), useWishlist()           │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🛣️ Routing Strategy

### React Router Configuration

```javascript
// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/login" element={<Login />} />
    
    {/* Protected Routes (require authentication) */}
    <Route path="/checkout" element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    } />
    <Route path="/account" element={
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    } />
    <Route path="/order-confirmation/:orderId" element={
      <ProtectedRoute>
        <OrderConfirmation />
      </ProtectedRoute>
    } />
    
    {/* Admin Route */}
    <Route path="/admin" element={<Admin />} />
    
    {/* Static Pages */}
    <Route path="/about" element={<AboutUs />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
  </Routes>
</Router>
```

### Protected Route Implementation

```javascript
// components/common/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
```

### Programmatic Navigation

```javascript
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    // Login logic...
    
    // Redirect to previous page or home
    const from = location.state?.from || '/';
    navigate(from);
  };
}
```

---

## ⚡ Performance Optimization

### 1. Lazy Loading (Code Splitting)

**Implementation:**
```javascript
import React, { lazy, Suspense } from 'react';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Admin = lazy(() => import('./pages/Admin'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
```

**Benefits:**
- Smaller initial bundle size
- Faster initial load time
- Load components on-demand

### 2. React.memo for Component Memoization

```javascript
import React, { memo } from 'react';

const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if product changed
  return prevProps.product.id === nextProps.product.id &&
         prevProps.product.price === nextProps.product.price;
});

export default ProductCard;
```

### 3. useMemo & useCallback Hooks

```javascript
import { useMemo, useCallback } from 'react';

function ProductList({ products, filters }) {
  // Memoize expensive calculations
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (filters.category && p.category_id !== filters.category) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    });
  }, [products, filters]);

  // Memoize callback functions
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
```

### 4. Image Optimization

```javascript
// components/common/OptimizedImage.js
function OptimizedImage({ src, alt, width, height, lazy = true }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      onError={(e) => {
        e.target.src = '/placeholder.jpg'; // Fallback image
      }}
    />
  );
}
```

### 5. Debouncing Search Input

```javascript
import { useState, useEffect } from 'react';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Perform search when debounced term changes
  useEffect(() => {
    if (debouncedTerm) {
      performSearch(debouncedTerm);
    }
  }, [debouncedTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search products..."
    />
  );
}
```

---

## 📦 Code Splitting

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Route-Based Splitting

```javascript
// Automatic code splitting by route
const routes = [
  { path: '/', component: lazy(() => import('./pages/Home')) },
  { path: '/product/:id', component: lazy(() => import('./pages/ProductDetails')) },
  { path: '/cart', component: lazy(() => import('./pages/Cart')) },
  { path: '/admin', component: lazy(() => import('./pages/Admin')) },
];
```

### Component-Based Splitting

```javascript
// Split large components
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));

function ParentComponent() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>Load Component</button>
      
      {showHeavy && (
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

---

## 🔨 Build Configuration

### Create React App Configuration

QuickCart uses Create React App (CRA) with default configuration.

**Build Commands:**
```bash
# Development
npm start           # Start dev server (port 3000)

# Production
npm run build       # Create optimized build
npm run serve       # Serve production build

# Testing
npm test            # Run tests
npm run test:coverage  # Test coverage report
```

### Environment Variables

```bash
# .env (development)
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development

# .env.production
REACT_APP_API_URL=https://api.quickcart.com/api
REACT_APP_ENV=production
```

**Usage:**
```javascript
const API_URL = process.env.REACT_APP_API_URL;
const isProduction = process.env.NODE_ENV === 'production';
```

---

## 🎨 Design Patterns

### 1. Container/Presentational Pattern

```javascript
// Container Component (logic)
function ProductListContainer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return <ProductListView products={products} />;
}

// Presentational Component (UI)
function ProductListView({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Higher-Order Component (HOC) Pattern

```javascript
// HOC for authentication
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;

    return <Component {...props} user={user} />;
  };
}

// Usage
const ProtectedPage = withAuth(AccountPage);
```

### 3. Render Props Pattern

```javascript
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);

  return children({ data, loading });
}

// Usage
<DataFetcher url="/api/products">
  {({ data, loading }) => (
    loading ? <LoadingSpinner /> : <ProductList products={data} />
  )}
</DataFetcher>
```

### 4. Custom Hooks Pattern

```javascript
// Custom hook for API calls
function useAPI(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function ProductPage({ id }) {
  const { data, loading, error } = useAPI(`/api/products/${id}`);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProductDetails product={data} />;
}
```

---

## ✅ Best Practices

### Component Best Practices

✅ **Single Responsibility**: One component, one purpose  
✅ **Small Components**: Keep components under 300 lines  
✅ **Prop Validation**: Use PropTypes or TypeScript  
✅ **Destructure Props**: Clean and readable code  
✅ **Composition over Inheritance**: Compose components  

### State Management Best Practices

✅ **Lift State Up**: Share state at lowest common ancestor  
✅ **Keep State Minimal**: Derive data when possible  
✅ **Context for Global State**: Auth, cart, theme  
✅ **Local State for UI**: Modals, toggles, forms  

### Performance Best Practices

✅ **Lazy Load Routes**: Split code by route  
✅ **Memoize Components**: Use React.memo  
✅ **Optimize Re-renders**: useMemo, useCallback  
✅ **Image Lazy Loading**: Use native lazy loading  
✅ **Debounce Input**: Reduce API calls  

### Code Organization Best Practices

✅ **Consistent File Structure**: Follow conventions  
✅ **Named Exports**: Better for refactoring  
✅ **Absolute Imports**: Use path aliases  
✅ **Separate Concerns**: Logic, UI, styles  

---

## 📚 Related Documentation

- **[Key Components](FRONTEND_02_KEY_COMPONENTS.md)** - Component library
- **[API Documentation](BACKEND_01_API_DOCUMENTATION.md)** - Backend APIs
- **[Authentication Flow](BACKEND_03_AUTHENTICATION_FLOW.md)** - Auth integration
- **[Error Handling](BACKEND_04_ERROR_HANDLING.md)** - Error patterns

---

**Frontend Architecture Version**: 2.0.0  
**Last Updated**: February 2026  

⚛️ **Build Amazing UIs with React!**
