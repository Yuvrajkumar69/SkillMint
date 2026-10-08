import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentApi, courseApi } from '../api/services';
import type { CourseCard } from '../types';
import toast from 'react-hot-toast';

// Razorpay global types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill: { name: string; email: string; };
  theme: { color: string; };
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const directCourseId = searchParams.get('courseId') ? Number(searchParams.get('courseId')) : null;

  const { cart, refetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [directCourse, setDirectCourse] = useState<CourseCard | null>(null);
  const [isLoadingDirect, setIsLoadingDirect] = useState<boolean>(!!directCourseId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (directCourseId) {
      setIsLoadingDirect(true);
      courseApi.getById(directCourseId)
        .then((res) => {
          if (res.data?.data) {
            setDirectCourse(res.data.data);
          }
        })
        .catch(() => {
          toast.error('Failed to load selected course for checkout');
        })
        .finally(() => setIsLoadingDirect(false));
    }
  }, [directCourseId]);

  const items: CourseCard[] = directCourse ? [directCourse] : cart;
  const total = items.reduce((sum, c) => sum + (c.discountedPrice || c.originalPrice), 0);

  if (completedOrderNumber) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 bg-[#111827] border border-[#1e293b] rounded-2xl shadow-xl"
        >
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-3xl font-bold text-[#e2e8f0] mb-2">Payment Successful!</h2>
          <p className="text-[#94a3b8] mb-4">
            Order <span className="font-mono text-emerald-400 font-semibold">#{completedOrderNumber}</span> has been confirmed.
          </p>
          <p className="text-sm text-[#64748b] mb-8">
            Your course enrollments are now active. A confirmation email has been sent to <span className="text-[#e2e8f0]">{user?.email}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-courses" className="btn-primary py-3 px-6 flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              View My Courses
            </Link>
            <Link to="/orders" className="px-6 py-3 bg-[#1e293b] text-[#e2e8f0] rounded-xl font-semibold hover:bg-[#334155] transition-colors flex items-center justify-center gap-2">
              View Order History
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoadingDirect) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#1e293b] border-t-[#5C6AC4] animate-spin mx-auto mb-4" />
        <p className="text-[#94a3b8]">Loading checkout details...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#e2e8f0] mb-2">Nothing to checkout</h2>
        <p className="text-[#94a3b8] mb-6">Your checkout item list is currently empty.</p>
        <button onClick={() => navigate('/courses')} className="btn-primary">Browse Courses</button>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Failed to load Razorpay payment gateway. Check your connection.');
        setIsProcessing(false);
        return;
      }

      // Create order on backend (server-side price authority)
      const courseIds = items.map((c) => c.id);
      const res = await paymentApi.createOrder(courseIds);
      const { razorpayOrderId, orderNumber, amount, currency, keyId } = res.data.data;

      // Open Razorpay checkout modal
      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'SkillMint',
        description: `${items.length} Course Purchase`,
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: { color: '#5C6AC4' },
        handler: async (response) => {
          try {
            await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderNumber,
            });
            await refetchCart();
            setCompletedOrderNumber(orderNumber);
            toast.success('🎉 Payment verified! You are now enrolled.');
          } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg || 'Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast('Payment session cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to initiate checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-[#e2e8f0] mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Items */}
        <div>
          <h2 className="text-lg font-semibold text-[#e2e8f0] mb-4">
            Order Items ({items.length}) {directCourse && <span className="text-xs text-[#00D4AA] font-normal ml-2">(Buy Now)</span>}
          </h2>
          <div className="space-y-3 mb-6">
            {items.map((course) => (
              <div key={course.id} className="flex gap-3 p-3 bg-[#111827] border border-[#1e293b] rounded-xl">
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'}
                  alt={course.title}
                  className="w-16 h-11 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#e2e8f0] line-clamp-1">{course.title}</p>
                  <p className="text-xs text-[#64748b]">{course.instructor?.name}</p>
                </div>
                <span className="text-sm font-semibold text-[#e2e8f0] flex-shrink-0">
                  ₹{(course.discountedPrice || course.originalPrice)?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-xs text-[#64748b] p-3 border border-[#1e293b] rounded-lg">
            <Shield size={14} className="text-emerald-400 flex-shrink-0" />
            <span>Your payment is secured by Razorpay with 256-bit SSL encryption. SkillMint never stores your card details.</span>
          </div>
        </div>

        {/* Right: Summary + Pay */}
        <div>
          <div className="p-6 bg-[#111827] border border-[#1e293b] rounded-2xl sticky top-24">
            <h2 className="text-lg font-bold text-[#e2e8f0] mb-4">Payment Summary</h2>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-[#94a3b8]">
                <span>Subtotal ({items.length} {items.length === 1 ? 'course' : 'courses'})</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#94a3b8]">
                <span>Platform Fee</span>
                <span className="text-emerald-400">FREE</span>
              </div>
              <div className="border-t border-[#1e293b] pt-3 flex justify-between font-bold text-base">
                <span className="text-[#e2e8f0]">Total Payable</span>
                <span className="gradient-text text-xl">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
            >
              <CreditCard size={18} />
              {isProcessing ? 'Processing Payment...' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>

            <p className="text-center text-xs text-[#64748b]">
              By completing your purchase you agree to SkillMint's Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
