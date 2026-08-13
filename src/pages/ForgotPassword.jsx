import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { Toast } from '../components/Toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewToken, setPreviewToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setToast({ type: 'error', message: 'Please enter your registered email address.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        if (res.data.tokenPreview) {
          setPreviewToken(res.data.tokenPreview);
          setTimeout(() => {
            navigate(`/reset-password?token=${res.data.tokenPreview}&email=${encodeURIComponent(email)}`);
          }, 2000);
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Request failed.' });
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
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your email to receive recovery instructions</p>
        </div>

        {previewToken && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            Dev Reset Token: <strong className="text-white tracking-wider font-bold">{previewToken}</strong>
          </div>
        )}

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Request...' : 'Send Reset Instructions'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Remembered your password?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
