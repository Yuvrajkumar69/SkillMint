import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CourseCard } from '../types';
import { cartApi } from '../api/services';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CourseCard[];
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (courseId: number) => Promise<void>;
  removeFromCart: (courseId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (courseId: number) => boolean;
  refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CourseCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      refetchCart();
    } else {
      setCart([]);
      setError(null);
    }
  }, [isAuthenticated, user?.id]);

  const refetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await cartApi.get();
      setCart(res.data.data || []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch cart items';
      setError(msg);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (courseId: number) => {
    try {
      await cartApi.add(courseId);
      await refetchCart();
    } catch (err) {
      await refetchCart();
      throw err;
    }
  };

  const removeFromCart = async (courseId: number) => {
    try {
      await cartApi.remove(courseId);
      await refetchCart();
    } catch (err) {
      await refetchCart();
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      await refetchCart();
    } catch (err) {
      await refetchCart();
      throw err;
    }
  };

  const isInCart = (courseId: number) => cart.some((c) => c.id === courseId);

  return (
    <CartContext.Provider value={{
      cart, cartCount: cart.length, isLoading, error,
      addToCart, removeFromCart, clearCart, isInCart, refetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
