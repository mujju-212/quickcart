import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    const loadCartFromDatabase = async () => {
      if (user?.phone) {
        setLoading(true);
        try {
          const response = await cartService.getCart(user.phone);
          if (response.success && response.cart) {
            // Transform API response to match local cart format
            const cartItems = response.cart.map(item => ({
              id: item.product_id,
              name: item.name,
              price: item.price,
              originalPrice: item.original_price,
              size: item.size,
              image_url: item.image_url,
              stock: item.stock,
              category_name: item.category_name,
              quantity: item.quantity
            }));
            setCart(cartItems);
          }
        } catch (error) {
          console.error('Error loading cart from database:', error);
          // Fallback to localStorage if database fails
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Guest user - use localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    };

    loadCartFromDatabase();
  }, [user]);

  // Sync to localStorage for guest users (cache)
  useEffect(() => {
    if (!user?.phone) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user?.phone) {
      // Logged in user - save to database
      try {
        const response = await cartService.addToCart(user.phone, product.id, quantity);
        if (response.success) {
          // Reload cart from database
          const cartResponse = await cartService.getCart(user.phone);
          if (cartResponse.success && cartResponse.cart) {
            const cartItems = cartResponse.cart.map(item => ({
              id: item.product_id,
              name: item.name,
              price: item.price,
              originalPrice: item.original_price,
              size: item.size,
              image_url: item.image_url,
              stock: item.stock,
              category_name: item.category_name,
              quantity: item.quantity
            }));
            setCart(cartItems);
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local state
        updateLocalCart(product, quantity);
      }
    } else {
      // Guest user - use local state
      updateLocalCart(product, quantity);
    }
  };

  const updateLocalCart = (product, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = async (productId) => {
    if (user?.phone) {
      // Logged in user - remove from database
      try {
        const response = await cartService.removeFromCart(user.phone, productId);
        if (response.success) {
          setCart(prevCart => prevCart.filter(item => item.id !== productId));
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        // Fallback to local state
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
      }
    } else {
      // Guest user
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user?.phone) {
      // Logged in user - update in database
      try {
        const response = await cartService.updateQuantity(user.phone, productId, newQuantity);
        if (response.success) {
          setCart(prevCart =>
            prevCart.map(item =>
              item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
        // Fallback to local state
        setCart(prevCart =>
          prevCart.map(item =>
            item.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } else {
      // Guest user
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user?.phone) {
      // Logged in user - clear from database
      try {
        await cartService.clearCart(user.phone);
        setCart([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
        setCart([]);
      }
    } else {
      // Guest user
      setCart([]);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};