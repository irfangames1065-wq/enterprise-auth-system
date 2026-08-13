import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Mail, Shield, Lock, Key, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 backdrop-blur-2xl relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${isAdmin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Edit Profile
            </Link>
            <Link
              to="/settings"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition"
            >
              Security Settings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Console
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Account Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">Verified Active</p>
          <p className="text-[11px] text-slate-500">OTP email verification complete</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Security Engine</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-white">JWT + Bcrypt</p>
          <p className="text-[11px] text-slate-500">15m Access / 7d Refresh token</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Target Recipient Email</span>
            <Mail className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-indigo-300 truncate">irfangames1065@gmail.com</p>
          <p className="text-[11px] text-slate-500">Nodemailer Gmail SMTP active</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Last Activity</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-white">
            {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just Now'}
          </p>
          <p className="text-[11px] text-slate-500">Session authenticated</p>
        </div>
      </div>

      {/* Account Details & Quick Security Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Profile Account Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">User Identifier</span>
              <span className="font-mono text-slate-300">{user?.id || 'NX-90210'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Role Permissions</span>
              <span className="font-semibold text-purple-300 capitalize">{user?.role} Access</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Email Verification</span>
              <span className="text-emerald-400 font-semibold">Verified ({user?.email})</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Encryption Protocol</span>
              <span className="text-slate-300 font-medium">Bcrypt 10 Rounds Salt</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
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
            <Link
              to="/settings"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <span>Change Password</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/60 text-xs font-semibold text-purple-300 transition"
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
