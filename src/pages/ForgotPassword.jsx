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
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--heading)' }}>Reset Password</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enter your email to receive recovery instructions</p>
        </div>

        {previewToken && (
          <div className="p-3 rounded-xl border text-xs text-center flex items-center justify-center gap-2" style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.25)', color: '#818cf8' }}>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            Dev Reset Token: <strong className="tracking-wider font-bold" style={{ color: 'var(--heading)' }}>{previewToken}</strong>
          </div>
        )}

        <div className="theme-card p-5 sm:p-8 rounded-3xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-indigo-400/80" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="theme-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="theme-btn-primary w-full py-3 rounded-xl font-bold text-sm shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Request...' : 'Send Reset Instructions'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#818cf8' }}>
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
