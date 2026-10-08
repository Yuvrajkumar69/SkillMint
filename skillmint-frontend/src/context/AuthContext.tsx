import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User, JwtResponse } from '../types';
import { isTokenExpired } from '../api/axiosInstance';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: JwtResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextType extends AuthState {
  login: (jwt: JwtResponse) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          id: action.payload.id,
          fullName: action.payload.fullName,
          email: action.payload.email,
          role: action.payload.role as User['role'],
          createdAt: new Date().toISOString(),
        },
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate from localStorage on mount (validating token expiration)
  useEffect(() => {
    const token = localStorage.getItem('skillmint_token');
    const userStr = localStorage.getItem('skillmint_user');
    if (token && userStr) {
      if (isTokenExpired(token)) {
        localStorage.removeItem('skillmint_token');
        localStorage.removeItem('skillmint_user');
        dispatch({ type: 'LOGOUT' });
      } else {
        try {
          const user = JSON.parse(userStr);
          dispatch({ type: 'LOGIN', payload: { ...user, token } });
        } catch {
          localStorage.removeItem('skillmint_token');
          localStorage.removeItem('skillmint_user');
          dispatch({ type: 'LOGOUT' });
        }
      }
    } else {
      localStorage.removeItem('skillmint_token');
      localStorage.removeItem('skillmint_user');
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Synchronize state when auth expires anywhere in the app
  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch({ type: 'LOGOUT' });
    };
    window.addEventListener('skillmint_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('skillmint_auth_expired', handleAuthExpired);
  }, []);

  const login = (jwt: JwtResponse) => {
    localStorage.setItem('skillmint_token', jwt.token);
    localStorage.setItem('skillmint_user', JSON.stringify({
      id: jwt.id,
      fullName: jwt.fullName,
      email: jwt.email,
      role: jwt.role,
    }));
    dispatch({ type: 'LOGIN', payload: jwt });
  };

  const logout = () => {
    localStorage.removeItem('skillmint_token');
    localStorage.removeItem('skillmint_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data: Partial<User>) => {
    const stored = localStorage.getItem('skillmint_user');
    if (stored) {
      localStorage.setItem('skillmint_user', JSON.stringify({ ...JSON.parse(stored), ...data }));
    }
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
