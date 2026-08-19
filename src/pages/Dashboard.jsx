import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Mail, Shield, Lock, Key, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-8 rounded-3xl border backdrop-blur-2xl relative overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(168,85,247,0.1), var(--surface))', borderColor: 'rgba(99,102,241,0.18)' }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl shrink-0"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold break-words" style={{ color: 'var(--heading)' }}>Welcome back, {user?.name}!</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${isAdmin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                  {user?.role}
                </span>
              </div>
              <p className="text-xs mt-1 flex items-center gap-1.5 break-all" style={{ color: 'var(--text-muted)' }}>
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl border text-xs font-semibold transition" style={{ background: 'var(--panel-soft)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Edit Profile
            </Link>
            <Link
              to="/settings"
              className="theme-btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition"
            >
              Security Settings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#ffffff' }}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Console
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Account Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">Verified Active</p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>OTP email verification complete</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Security Engine</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold" style={{ color: 'var(--heading)' }}>JWT + Bcrypt</p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>15m Access / 7d Refresh token</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Target Recipient Email</span>
            <Mail className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm font-bold truncate" style={{ color: '#818cf8' }}>irfangames1065@gmail.com</p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Nodemailer Gmail SMTP active</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Last Activity</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold" style={{ color: 'var(--heading)' }}>
            {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just Now'}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Session authenticated</p>
        </div>
      </div>

      {/* Account Details & Quick Security Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 theme-card p-4 sm:p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--heading)' }}>
            <User className="w-4 h-4 text-indigo-400" />
            Profile Account Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl" style={{ background: 'var(--panel-soft)', border: '1px solid var(--border)' }}>
              <span className="block mb-1" style={{ color: 'var(--text-muted)' }}>User Identifier</span>
              <span className="font-mono" style={{ color: 'var(--text)' }}>{user?.id || 'NX-90210'}</span>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--panel-soft)', border: '1px solid var(--border)' }}>
              <span className="block mb-1" style={{ color: 'var(--text-muted)' }}>Role Permissions</span>
              <span className="font-semibold capitalize" style={{ color: '#a78bfa' }}>{user?.role} Access</span>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--panel-soft)', border: '1px solid var(--border)' }}>
              <span className="block mb-1" style={{ color: 'var(--text-muted)' }}>Email Verification</span>
              <span className="text-emerald-400 font-semibold">Verified ({user?.email})</span>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--panel-soft)', border: '1px solid var(--border)' }}>
              <span className="block mb-1" style={{ color: 'var(--text-muted)' }}>Encryption Protocol</span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>Bcrypt 10 Rounds Salt</span>
            </div>
          </div>
        </div>

        <div className="theme-card p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--heading)' }}>
            <Lock className="w-4 h-4 text-purple-400" />
            Quick Actions
          </h3>

          <div className="space-y-2">
            <Link
              to="/profile"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <span>Update Profile & Avatar</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
            <button
              type="button"
              onClick={() => navigate('/settings', { state: { openPasswordModal: true } })}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <span>Change Password</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            {isAdmin && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition" style={{ background: 'rgba(109,40,217,0.08)', border: '1px solid rgba(168,85,247,0.28)', color: '#a78bfa' }}
              >
                <span>Admin User Management</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
