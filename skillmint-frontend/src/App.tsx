import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import MyCoursesPage from './pages/MyCoursesPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import LearnPage from './pages/LearnPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return user?.role === 'ADMIN' ? <>{children}</> : <Navigate to="/" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-[#1e293b] border-t-[#5C6AC4] animate-spin" />
      <span className="text-sm text-[#64748b]">Loading...</span>
    </div>
  );
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          {/* Guest only */}
          <Route path="/signin" element={<GuestRoute><SignInPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="//reset-password" element={<ResetPasswordPage />} />
          {/* Protected */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/learn/:courseId" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <WishlistProvider>
            <CartProvider>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#111827',
                    color: '#e2e8f0',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    fontSize: '14px',
                  },
                  success: { iconTheme: { primary: '#00D4AA', secondary: '#111827' } },
                  error: { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
                }}
              />
            </CartProvider>
          </WishlistProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
