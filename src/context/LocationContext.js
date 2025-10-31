import React, { createContext, useContext, useState, useEffect } from 'react';
import addressService from '../services/addressService';
import { useAuth } from './AuthContext';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState('Nagawara, Bengaluru');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load addresses from database when user logs in
  useEffect(() => {
    const loadAddresses = async () => {
      if (user?.phone) {
        setLoading(true);
        try {
          const response = await addressService.getUserAddresses(user.phone);
          if (response.success && response.addresses) {
            // Transform backend addresses to match frontend format
            const formattedAddresses = response.addresses.map(addr => ({
              id: addr.id,
              name: addr.address_line_1,
              phone: addr.phone,
              house: addr.address_line_1,
              area: addr.address_line_2 || '',
              city: addr.city,
              state: addr.state,
              pincode: addr.postal_code,
              type: addr.address_type,
              isDefault: addr.is_default
            }));
            setAddresses(formattedAddresses);
          }
        } catch (error) {
          console.error('Error loading addresses from database:', error);
          // Fallback to localStorage
          const storedAddresses = localStorage.getItem('addresses');
          if (storedAddresses) {
            setAddresses(JSON.parse(storedAddresses));
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Guest user - use localStorage
        const storedAddresses = localStorage.getItem('addresses');
        if (storedAddresses) {
          setAddresses(JSON.parse(storedAddresses));
        }
      }
    };

    loadAddresses();
  }, [user]);

  // Sync to localStorage for guest users
  useEffect(() => {
    if (!user?.phone) {
      localStorage.setItem('addresses', JSON.stringify(addresses));
    }
  }, [addresses, user]);

  const updateLocation = (location) => {
    setCurrentLocation(location);
    localStorage.setItem('currentLocation', location);
  };

  const addAddress = async (address) => {
    if (user?.phone) {
      // Logged-in user - save to database
      try {
        const addressData = {
          address_line_1: address.house || address.name,
          address_line_2: address.area,
          city: address.city,
          state: address.state || 'Karnataka',
          postal_code: address.pincode,
          address_type: address.type || 'home'
        };

        const response = await addressService.addAddress(user.phone, addressData);
        
        if (response.success && response.address) {
          const newAddress = {
            id: response.address.id,
            name: response.address.address_line_1,
            phone: response.address.phone,
            house: response.address.address_line_1,
            area: response.address.address_line_2 || '',
            city: response.address.city,
            state: response.address.state,
            pincode: response.address.postal_code,
            type: response.address.address_type,
            isDefault: response.address.is_default
          };
          setAddresses(prev => [...prev, newAddress]);
          return newAddress;
        }
      } catch (error) {
        console.error('Error adding address to database:', error);
        // Fallback to localStorage
      }
    }
    
    // Guest user or fallback - use localStorage
    const newAddress = {
      id: Date.now(),
      ...address
    };
    setAddresses(prev => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = async (id, updatedAddress) => {
    if (user?.phone) {
      // Logged-in user - update in database
      try {
        const addressData = {
          address_line_1: updatedAddress.house || updatedAddress.name,
          address_line_2: updatedAddress.area,
          city: updatedAddress.city,
          state: updatedAddress.state || 'Karnataka',
          postal_code: updatedAddress.pincode,
          address_type: updatedAddress.type || 'home'
        };

        const response = await addressService.updateAddress(id, addressData);
        
        if (response.success) {
          setAddresses(prev =>
            prev.map(addr =>
              addr.id === id ? { ...addr, ...updatedAddress } : addr
            )
          );
          return;
        }
      } catch (error) {
        console.error('Error updating address in database:', error);
        // Fallback to local state update
      }
    }
    
    // Guest user or fallback - update in state
    setAddresses(prev => 
      prev.map(addr => 
        addr.id === id ? { ...addr, ...updatedAddress } : addr
      )
    );
  };

  const deleteAddress = async (id) => {
    if (user?.phone) {
      // Logged-in user - delete from database
      try {
        const response = await addressService.deleteAddress(id);
        
        if (response.success) {
          setAddresses(prev => prev.filter(addr => addr.id !== id));
          return;
        }
      } catch (error) {
        console.error('Error deleting address from database:', error);
        // Fallback to local deletion
      }
    }
    
    // Guest user or fallback - delete from state
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const value = {
    currentLocation,
    addresses,
    loading,
    updateLocation,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};