import React, { createContext, useContext, useState, useEffect } from 'react';
import wishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load wishlist from database when user logs in
  useEffect(() => {
    const loadWishlistFromDatabase = async () => {
      if (user?.phone) {
        setLoading(true);
        try {
          const response = await wishlistService.getWishlist(user.phone);
          if (response.success && response.wishlist) {
            // Transform API response to match local wishlist format
            const wishlistItems = response.wishlist.map(item => ({
              id: item.product_id,
              name: item.name,
              price: item.price,
              originalPrice: item.original_price,
              size: item.size,
              image_url: item.image_url,
              stock: item.stock,
              category_name: item.category_name,
              description: item.description
            }));
            setWishlist(wishlistItems);
          }
        } catch (error) {
          console.error('Error loading wishlist from database:', error);
          // Fallback to localStorage if database fails
          const storedWishlist = localStorage.getItem('wishlist');
          if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Guest user - use localStorage
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }
      }
    };

    loadWishlistFromDatabase();
  }, [user]);

  // Sync to localStorage for guest users (cache)
  useEffect(() => {
    if (!user?.phone) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = async (product) => {
    if (user?.phone) {
      // Logged in user - save to database
      try {
        const response = await wishlistService.addToWishlist(user.phone, product.id);
        if (response.success && !response.already_exists) {
          setWishlist(prevWishlist => {
            const exists = prevWishlist.find(item => item.id === product.id);
            if (!exists) {
              return [...prevWishlist, product];
            }
            return prevWishlist;
          });
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        // Fallback to local state
        setWishlist(prevWishlist => {
          const exists = prevWishlist.find(item => item.id === product.id);
          if (!exists) {
            return [...prevWishlist, product];
          }
          return prevWishlist;
        });
      }
    } else {
      // Guest user - use local state
      setWishlist(prevWishlist => {
        const exists = prevWishlist.find(item => item.id === product.id);
        if (!exists) {
          return [...prevWishlist, product];
        }
        return prevWishlist;
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (user?.phone) {
      // Logged in user - remove from database
      try {
        const response = await wishlistService.removeFromWishlist(user.phone, productId);
        if (response.success) {
          setWishlist(prevWishlist => 
            prevWishlist.filter(item => item.id !== productId)
          );
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        // Fallback to local state
        setWishlist(prevWishlist => 
          prevWishlist.filter(item => item.id !== productId)
        );
      }
    } else {
      // Guest user
      setWishlist(prevWishlist => 
        prevWishlist.filter(item => item.id !== productId)
      );
    }
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

  const clearWishlist = async () => {
    if (user?.phone) {
      // Logged in user - clear from database
      try {
        await wishlistService.clearWishlist(user.phone);
        setWishlist([]);
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        setWishlist([]);
      }
    } else {
      // Guest user
      setWishlist([]);
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};