import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength logic
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setToast({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (password.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password, role, adminSecret);

      setToast({ type: 'success', message: data.message });
      setTimeout(() => {
        navigate('/verify-otp', {
          state: { email, otpPreview: data.otpPreview }
        });
      }, 1200);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Registration failed.' });
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
          <div className="inline-flex p-3 rounded-2xl border mb-1" style={{ background: 'rgba(34,211,238,0.12)', borderColor: 'rgba(34,211,238,0.35)', color: '#67e8f9' }}>
            <Shield className="w-6 h-6" />
          </div>
          <div className="robot-status mx-auto"><span className="dot" />New AI Node</div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--heading)' }}>Create Account</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Register to the MyApp command network</p>
        </div>

        <div className="robot-panel p-5 sm:p-8 rounded-3xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400/80" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="theme-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400/80" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="theme-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400/80" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="theme-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5">
                    <div className={`h-full flex-1 rounded-full ${strengthScore >= 1 ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <div className={`h-full flex-1 rounded-full ${strengthScore >= 3 ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <div className={`h-full flex-1 rounded-full ${strengthScore >= 4 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  </div>
                  <p className="text-[10px] text-right font-medium" style={{ color: 'var(--text-muted)' }}>
                    {strengthScore < 2 ? 'Weak' : strengthScore < 4 ? 'Medium' : 'Strong Password'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition"
              >
                <option value="user">Standard User</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            {role === 'admin' && (
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#a78bfa' }}>Admin Security Secret</label>
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter admin secret"
                  className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-violet-500 focus:outline-none transition"
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="theme-btn-primary w-full py-3 rounded-xl font-bold text-sm shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Creating Account...' : 'Continue to OTP Verification'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#a78bfa' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
