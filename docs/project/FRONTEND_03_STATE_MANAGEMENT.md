# Frontend: State Management with Context API

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** Frontend Developers  
**Related Documents:** [FRONTEND_01_ARCHITECTURE.md](FRONTEND_01_ARCHITECTURE.md), [FRONTEND_02_KEY_COMPONENTS.md](FRONTEND_02_KEY_COMPONENTS.md)

---

## Overview

QuickCart uses **React Context API** for global state management. Four contexts handle authentication, cart, wishlist, and location data across the application.

---

## Context Architecture

```
App Component
├── AuthProvider ────────────── User auth state
│   ├── CartProvider ────────── Shopping cart
│   │   ├── WishlistProvider ─ Saved items
│   │   │   ├── LocationProvider ─ Address data
│   │   │   │   └── Routes & Components
```

**Why Context API?**
- ✅ Built-in to React (no extra dependencies)
- ✅ Simple for medium-sized apps
- ✅ Reduces prop drilling
- ✅ Easy to understand and maintain

---

## 1. AuthContext

**Purpose:** Manages user authentication state

### Features
- User login/logout
- Token management (cookies + localStorage)
- Admin authentication
- Session persistence

### Implementation

```javascript
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from cookies on mount
  useEffect(() => {
    const loadUser = () => {
      const token = getCookie('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setCurrentUser(userData);
    setCookie('token', token, 7); // 7 days
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    deleteCookie('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Usage

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      Welcome, {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

---

## 2. CartContext

**Purpose:** Manages shopping cart state

### Features
- Add/remove items
- Update quantities
- Database sync (logged-in users)
- LocalStorage fallback (guests)
- Cart summary calculations

### Implementation

```javascript
// src/context/CartContext.js
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from database/localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (user?.phone) {
        // Logged-in: fetch from database
        const response = await cartService.getCart(user.phone);
        setCart(transformCartItems(response.cart));
      } else {
        // Guest: load from localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    };
    loadCart();
  }, [user]);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!user?.phone) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user?.phone) {
      // Database operation
      await cartService.addToCart(user.phone, product.id, quantity);
      await reloadCart();
    } else {
      // Local state
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user?.phone) {
      await cartService.removeFromCart(user.phone, productId);
    }
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user?.phone) {
      await cartService.updateQuantity(user.phone, productId, newQuantity);
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = async () => {
    if (user?.phone) {
      await cartService.clearCart(user.phone);
    }
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartItemsCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Usage

```javascript
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const isInCart = cart.some(item => item.id === product.id);
  
  return (
    <div>
      {product.name} - ₹{product.price}
      {isInCart ? (
        <span>In Cart ✓</span>
      ) : (
        <button onClick={handleAddToCart}>Add to Cart</button>
      )}
    </div>
  );
};
```

---

## 3. WishlistContext

**Purpose:** Manages saved products

### Features
- Add/remove from wishlist
- Toggle wishlist (heart icon)
- Database sync
- Check if product is wishlisted

### Implementation

```javascript
// src/context/WishlistContext.js
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      if (user?.phone) {
        const response = await wishlistService.getWishlist(user.phone);
        setWishlist(transformWishlistItems(response.wishlist));
      } else {
        const stored = localStorage.getItem('wishlist');
        if (stored) setWishlist(JSON.parse(stored));
      }
    };
    loadWishlist();
  }, [user]);

  const addToWishlist = async (product) => {
    if (user?.phone) {
      await wishlistService.addToWishlist(user.phone, product.id);
    }
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      return exists ? prev : [...prev, product];
    });
  };

  const removeFromWishlist = async (productId) => {
    if (user?.phone) {
      await wishlistService.removeFromWishlist(user.phone, productId);
    }
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const toggleWishlist = async (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      await removeFromWishlist(product.id);
      return false;
    } else {
      await addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
```

---

## 4. LocationContext

**Purpose:** Manages delivery addresses

### Features
- Current location
- Saved addresses
- Add/edit/delete addresses
- Set default address

### Implementation

```javascript
// src/context/LocationContext.js
export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadAddresses = async () => {
      if (user?.phone) {
        const response = await addressService.getAddresses(user.phone);
        setAddresses(response.addresses);
        
        // Set default address as current
        const defaultAddr = response.addresses.find(a => a.is_default);
        if (defaultAddr) setCurrentLocation(defaultAddr);
      }
    };
    loadAddresses();
  }, [user]);

  const addAddress = async (addressData) => {
    const response = await addressService.addAddress(user.phone, addressData);
    setAddresses(prev => [...prev, response.address]);
  };

  const updateAddress = async (addressId, addressData) => {
    await addressService.updateAddress(addressId, addressData);
    setAddresses(prev =>
      prev.map(addr => addr.id === addressId ? { ...addr, ...addressData } : addr)
    );
  };

  const deleteAddress = async (addressId) => {
    await addressService.deleteAddress(addressId);
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
  };

  const setDefaultAddress = async (addressId) => {
    await addressService.setDefault(addressId);
    setAddresses(prev =>
      prev.map(addr => ({ ...addr, is_default: addr.id === addressId }))
    );
  };

  return (
    <LocationContext.Provider value={{
      currentLocation,
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress
    }}>
      {children}
    </LocationContext.Provider>
  );
};
```

---

## Context Best Practices

### ✅ Do's

1. **Use custom hooks** (`useAuth`, `useCart`)
2. **Keep contexts focused** (single responsibility)
3. **Memoize expensive computations** (useMemo)
4. **Handle loading states**
5. **Error handling** (try-catch)
6. **Validate context usage** (throw error if used outside provider)

### ❌ Don'ts

1. **Don't overuse context** (not all state needs to be global)
2. **Don't put all state in one context**
3. **Don't ignore performance** (unnecessary re-renders)
4. **Don't skip error boundaries**

---

## Performance Optimization

### Split Contexts

```javascript
// ❌ Bad: One massive context
const AppContext = { user, cart, wishlist, location, theme, ... }

// ✅ Good: Focused contexts
<AuthProvider>
  <CartProvider>
    <WishlistProvider>
```

### Memoize Values

```javascript
const cartTotal = useMemo(() => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}, [cart]);
```

### Prevent Unnecessary Renders

```javascript
// Use React.memo for child components
const CartItem = React.memo(({ item, onRemove }) => {
  return <div>...</div>;
});
```

---

## Testing Contexts

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { CartProvider, useCart } from './CartContext';

describe('CartContext', () => {
  it('adds item to cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart({ id: 1, name: 'Product', price: 100 }, 1);
    });
    
    expect(result.current.cart).toHaveLength(1);
  });
});
```

---

**Related Documentation:**
- [FRONTEND_01_ARCHITECTURE.md](FRONTEND_01_ARCHITECTURE.md)
- [FRONTEND_02_KEY_COMPONENTS.md](FRONTEND_02_KEY_COMPONENTS.md)
- [BACKEND_03_AUTHENTICATION_FLOW.md](BACKEND_03_AUTHENTICATION_FLOW.md)
