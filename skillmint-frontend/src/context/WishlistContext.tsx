import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CourseCard } from '../types';
import { wishlistApi } from '../api/services';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: CourseCard[];
  wishlistCount: number;
  isLoading: boolean;
  error: string | null;
  toggleWishlist: (courseId: number) => Promise<boolean>;
  isInWishlist: (courseId: number) => boolean;
  refetchWishlist: () => Promise<void>;
  removeFromWishlist: (courseId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<CourseCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      refetchWishlist();
    } else {
      setWishlist([]);
      setError(null);
    }
  }, [isAuthenticated, user?.id]);

  const refetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await wishlistApi.get();
      setWishlist(res.data.data || []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch wishlist';
      setError(msg);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (courseId: number): Promise<boolean> => {
    try {
      const res = await wishlistApi.toggle(courseId);
      const added = !!res.data.data?.added;
      await refetchWishlist();
      return added;
    } catch (err) {
      await refetchWishlist();
      throw err;
    }
  };

  const removeFromWishlist = async (courseId: number) => {
    await toggleWishlist(courseId);
  };

  const isInWishlist = (courseId: number) => {
    return wishlist.some((c) => c.id === courseId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isLoading,
        error,
        toggleWishlist,
        isInWishlist,
        refetchWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
