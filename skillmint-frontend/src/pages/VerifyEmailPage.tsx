import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [emailToResend, setEmailToResend] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Your email address has been verified successfully!');
        toast.success('Email verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToResend.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      await api.post('/auth/resend-verification', { email: emailToResend.trim() });
      toast.success('Verification email sent! Check your inbox.');
      setEmailToResend('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111827] border border-[#1e293b] rounded-2xl p-8 shadow-2xl text-center"
      >
        {status === 'loading' && (
          <div className="py-8">
            <Loader2 className="w-12 h-12 text-[#5C6AC4] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying Your Email...</h2>
            <p className="text-sm text-[#94a3b8]">Please wait while we confirm your account token.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Email Verified! 🎉</h2>
            <p className="text-sm text-[#94a3b8] mb-8">{message}</p>
            <Link
              to="/signin"
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
            >
              <span>Sign In to SkillMint</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Verification Failed</h2>
            <p className="text-sm text-[#94a3b8] mb-6">{message}</p>

            <div className="border-t border-[#1e293b] pt-6 mt-6 text-left">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00D4AA]" />
                <span>Resend Verification Email</span>
              </h3>
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={emailToResend}
                  onChange={(e) => setEmailToResend(e.target.value)}
                  className="input"
                />
                <button
                  type="submit"
                  disabled={isResending}
                  className="btn-secondary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  {isResending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Send New Link</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
