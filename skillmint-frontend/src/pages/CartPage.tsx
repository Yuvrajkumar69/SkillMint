import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart, ArrowRight, BookOpen } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CourseCardComponent from '../components/CourseCard';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, cartCount, removeFromCart, isLoading, error, refetchCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, c) => sum + (c.discountedPrice || c.originalPrice), 0);

  const handleRemove = async (courseId: number, title: string) => {
    await removeFromCart(courseId);
    toast.success(`Removed "${title}" from cart`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">Shopping Cart</h1>
        <p className="text-[#64748b] mb-8">Loading your cart...</p>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[#111827] rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">Shopping Cart</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center bg-[#111827] border border-red-500/20 rounded-2xl p-8 mt-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">Unable to load cart</h2>
          <p className="text-[#94a3b8] mb-6 text-sm max-w-md">{error}</p>
          <button onClick={() => refetchCart()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">Shopping Cart</h1>
      <p className="text-[#64748b] mb-8">{cartCount} course{cartCount !== 1 ? 's' : ''} in cart</p>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-[#1e293b] bg-[#111827]">
            <ShoppingCart size={32} className="text-[#2d3748]" />
          </div>
          <h2 className="text-xl font-bold text-[#94a3b8] mb-2">Your cart is empty</h2>
          <p className="text-[#64748b] mb-6 text-sm">Add some courses to get started</p>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-4 p-4 bg-[#111827] border border-[#1e293b] rounded-xl hover:border-[#2d3748] transition-all"
              >
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format'}
                  alt={course.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format';
                    }
                  }}
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/courses/${course.id}`} className="font-semibold text-[#e2e8f0] hover:text-white text-sm line-clamp-1 transition-colors">
                    {course.title}
                  </Link>
                  <p className="text-xs text-[#64748b] mt-0.5">{course.instructor?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-[#e2e8f0]">₹{(course.discountedPrice || course.originalPrice)?.toLocaleString('en-IN')}</span>
                    {course.discountedPrice > 0 && course.discountedPrice < course.originalPrice && (
                      <span className="text-xs text-[#475569] line-through">₹{course.originalPrice?.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(course.id, course.title)}
                  className="p-2 text-[#475569] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 p-6 bg-[#111827] border border-[#1e293b] rounded-2xl">
              <h2 className="text-lg font-bold text-[#e2e8f0] mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.map((c) => (
                  <div key={c.id} className="flex justify-between text-sm">
                    <span className="text-[#94a3b8] truncate max-w-[160px]">{c.title}</span>
                    <span className="text-[#e2e8f0] font-medium flex-shrink-0 ml-2">₹{(c.discountedPrice || c.originalPrice)?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-[#1e293b] pt-3 flex justify-between font-bold">
                  <span className="text-[#e2e8f0]">Total</span>
                  <span className="gradient-text text-lg">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-3.5 mb-3"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/courses" className="btn-ghost w-full justify-center text-sm">
                <BookOpen size={15} />
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
