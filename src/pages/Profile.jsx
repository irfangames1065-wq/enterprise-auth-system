import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Toast } from '../components/Toast';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
];

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || PRESET_AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setToast({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/user/profile', { name, avatar });
      if (res.data?.success) {
        updateUserProfile(res.data.user);
        setToast({ type: 'success', message: res.data.message });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-card p-4 sm:p-8 rounded-3xl space-y-6"
      >
        <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--heading)' }}>Profile Customization</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage your avatar and personal display details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview & Presets */}
          <div className="space-y-3">
            <label className="text-xs font-semibold block" style={{ color: 'var(--text-muted)' }}>Avatar Selection</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={avatar}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl"
              />
              <div className="flex flex-wrap gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition ${avatar === url ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address (Read Only)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl text-sm cursor-not-allowed opacity-80"
              style={{ background: 'var(--panel-soft)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="theme-btn-primary w-full py-3 rounded-xl font-bold text-sm shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
