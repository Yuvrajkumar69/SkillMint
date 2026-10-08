import axios from 'axios';

/**
 * Checks if a JWT token is expired (or malformed).
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    // Buffer by 5 seconds to prevent race conditions near expiry
    return Date.now() >= (payload.exp * 1000) - 5000;
  } catch {
    return true;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT from localStorage if valid
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillmint_token');
    if (token) {
      if (isTokenExpired(token)) {
        // Proactively clear expired token so we never send it to the backend
        localStorage.removeItem('skillmint_token');
        localStorage.removeItem('skillmint_user');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('skillmint_auth_expired'));
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem('skillmint_token');

    // 401 Unauthorized or 403 Forbidden with an expired/invalid token
    if (status === 401 || (status === 403 && isTokenExpired(token))) {
      localStorage.removeItem('skillmint_token');
      localStorage.removeItem('skillmint_user');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('skillmint_auth_expired'));

        const path = window.location.pathname;
        const isAuthPage = path.startsWith('/signin') ||
                           path.startsWith('/signup') ||
                           path.startsWith('/forgot-password') ||
                           path.startsWith('/reset-password');

        if (!isAuthPage) {
          window.location.href = `/signin?redirect=${encodeURIComponent(path)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
