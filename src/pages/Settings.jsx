import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Shield, KeyRound, CheckCircle2, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import api from '../api/axios';
import { Toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(location.state?.openPasswordModal === true);

  useEffect(() => {
    if (location.state?.openPasswordModal) {
      setShowPasswordModal(true);
    }
  }, [location.state]);

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setToast({ type: 'error', message: 'Please complete all password fields.' });
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
      const res = await api.put('/user/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message || 'Password updated successfully.' });
        resetPasswordForm();
        setShowPasswordModal(false);
        navigate('/settings', { replace: true, state: {} });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Password update failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Security & Password Management</h2>
              <p className="text-xs text-slate-400">Update your account credentials and security preferences</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Protection
            </div>
            <p className="text-lg font-bold text-white">JWT + Bcrypt</p>
            <p className="mt-2 text-xs text-slate-400">Access tokens and password hashing remain active and verified for this account.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Session
            </div>
            <p className="text-lg font-bold text-white">Authenticated</p>
            <p className="mt-2 text-xs text-slate-400">Signed in as {user?.email || 'your account'} with a valid access token.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Risk
            </div>
            <p className="text-lg font-bold text-white">Low</p>
            <p className="mt-2 text-xs text-slate-400">Use strong passwords, verify current credentials before changing them, and keep sessions private.</p>
          </div>
        </div>

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

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Change Password</h3>
                    <p className="text-xs text-slate-400">Authenticated as {user?.email || 'your account'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    navigate('/settings', { replace: true, state: {} });
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Close password change" 
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 pt-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
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
                    placeholder="Enter a new password"
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
                    placeholder="Re-enter your new password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetPasswordForm();
                      setShowPasswordModal(false);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
