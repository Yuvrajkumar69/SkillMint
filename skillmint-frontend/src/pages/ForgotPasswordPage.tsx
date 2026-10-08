import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/services';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email'); return; }
    setError('');
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch {
      // Always show success to prevent email enumeration
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #5C6AC4, transparent)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-8 shadow-2xl">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
                  <GraduationCap size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#e2e8f0]">Forgot your password?</h1>
                <p className="text-[#64748b] mt-1 text-sm">No worries. Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="you@example.com"
                      className={`input pl-10 ${error ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending reset link...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-emerald-500/15 border border-emerald-500/30">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-2">Check your inbox</h2>
              <p className="text-[#64748b] text-sm leading-relaxed mb-6">
                If an account exists for <strong className="text-[#94a3b8]">{email}</strong>, we've sent a password reset link. It expires in 30 minutes.
              </p>
              <p className="text-xs text-[#475569]">Didn't receive it? Check your spam folder.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/signin" className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors">
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
