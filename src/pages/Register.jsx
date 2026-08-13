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
          <div className="inline-flex p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 mb-1">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-slate-400">Join Nexus Security Platform</p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5">
                    <div className={`h-full flex-1 rounded-full ${strengthScore >= 1 ? 'bg-rose-500' : 'bg-slate-800'}`} />
                    <div className={`h-full flex-1 rounded-full ${strengthScore >= 3 ? 'bg-amber-500' : 'bg-slate-800'}`} />
                    <div className={`h-full flex-1 rounded-full ${strengthScore >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                  </div>
                  <p className="text-[10px] text-slate-400 text-right font-medium">
                    {strengthScore < 2 ? 'Weak' : strengthScore < 4 ? 'Medium' : 'Strong Password'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
              >
                <option value="user">Standard User</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            {role === 'admin' && (
              <div>
                <label className="text-xs font-semibold text-purple-400 block mb-1.5">Admin Security Secret (Optional for Dev)</label>
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter admin secret"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-purple-800/80 text-white text-sm focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Continue to OTP Verification'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
