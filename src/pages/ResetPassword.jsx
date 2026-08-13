import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { Toast } from '../components/Toast';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !token || !newPassword) {
      setToast({ type: 'error', message: 'All fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, token, newPassword });
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Password reset failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 mb-1">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Set New Password</h2>
          <p className="text-xs text-slate-400">Enter your reset token and new credentials</p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Reset Token / OTP</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token or OTP code"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Return to{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
