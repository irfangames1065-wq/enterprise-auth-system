import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import { Toast } from '../components/Toast';

export const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setToast({ type: 'error', message: 'Please enter your current and new password.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/user/change-password', { currentPassword, newPassword });
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Password update failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Security & Password Management</h2>
            <p className="text-xs text-slate-400">Update your account credentials and security preferences</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        {/* Security Specs Overview */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Active Security Protocols:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400 pl-1">
            <li>Bcrypt Password Salt Factor: 10 rounds</li>
            <li>JWT Access Token expiration: 15 minutes</li>
            <li>HttpOnly Refresh Token expiration: 7 days</li>
            <li>Helmet Security Headers & Express Rate Limiter active</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
