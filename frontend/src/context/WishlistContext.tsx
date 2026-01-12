'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { Wishlist } from '../types/wishlist';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlist(null);
    }
  }, [isAuthenticated]);

  const refreshWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.get('/wishlist');
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    if (!wishlist) return false;
    return wishlist.products.some((item) => item.product._id === productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/wishlist/${productId}`);

      if (response.data.success) {
        await refreshWishlist();
        toast.success('Added to wishlist!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await api.delete(`/wishlist/${productId}`);

      if (response.data.success) {
        await refreshWishlist();
        toast.success('Removed from wishlist');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
