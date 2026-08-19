import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ type: 'error', message: 'Please enter your email and password.' });
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password, rememberMe);

      if (data.requiresOtp) {
        setToast({ type: 'info', message: data.message });
        setTimeout(() => {
          navigate('/verify-otp', { state: { email, otpPreview: data.otpPreview } });
        }, 1200);
      } else {
        setToast({ type: 'success', message: data.message });
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoType) => {
    if (demoType === 'user') {
      setEmail('user@nexus.io');
      setPassword('password123');
    } else {
      setEmail('admin@nexus.io');
      setPassword('adminpass123');
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
          <div className="inline-flex p-3 rounded-2xl border mb-1" style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(168,85,247,0.35)', color: '#a78bfa' }}>
            <Shield className="w-6 h-6" />
          </div>
          <div className="robot-status mx-auto"><span className="dot" />System Online</div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--heading)' }}>Welcome Back</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Authenticate to the MyApp robot core</p>
        </div>

        <div className="robot-panel p-5 sm:p-8 rounded-3xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400/80" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="theme-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Password</label>
                <Link to="/forgot-password" className="text-xs hover:underline" style={{ color: '#a78bfa' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400/80" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="theme-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-transparent text-violet-600 focus:ring-0"
                />
                Remember this device
              </label>
            </div>

            <button type="submit" disabled={loading} className="theme-btn-primary w-full py-3 rounded-xl font-bold text-sm shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <Sparkles className="w-3 h-3 text-amber-400" />
              Quick Demo Access:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button type="button" onClick={() => handleQuickDemo('user')} className="px-3 py-1.5 rounded-lg text-xs transition" style={{ background: 'var(--panel-soft)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                👤 User Demo
              </button>
              <button type="button" onClick={() => handleQuickDemo('admin')} className="px-3 py-1.5 rounded-lg text-xs transition" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(168,85,247,0.35)', color: '#a78bfa' }}>
                👑 Admin Demo
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: '#a78bfa' }}>
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
