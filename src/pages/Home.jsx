import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Mail, CheckCircle2, ArrowRight, Zap, Users, Code, Server } from 'lucide-react';
import api from '../api/axios';
import { Toast } from '../components/Toast';

export const Home = () => {
  const [msgForm, setMsgForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const name = msgForm.name.trim();
    const email = msgForm.email.trim();
    const subject = msgForm.subject.trim();
    const message = msgForm.message.trim();

    if (!name || !email || !subject || !message) {
      setToast({ type: 'error', message: 'Please fill in your name, email, subject, and message.' });
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/send-message', {
        senderName: name,
        senderEmail: email,
        subject,
        message
      });

      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        setMsgForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to dispatch email.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 pt-6"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Production-Ready MERN Authentication Architecture
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Enterprise Security & Modern Authentication Platform
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Powered by React 18, Vite, Tailwind CSS, Node.js, Express, and MongoDB. Feature-complete with JWT tokens, OTP verification, bcrypt hashing, and role-based access controls.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/register"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition hover:scale-105 flex items-center gap-2"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm transition hover:bg-slate-850"
          >
            Sign In Portal
          </Link>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Dual JWT Tokens</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            15-minute Access Tokens paired with 7-day HttpOnly Refresh Tokens and secure automatic token rotation.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">OTP & Password Reset</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nodemailer integration targeting <strong>irfangames1065@gmail.com</strong> with HTML templates and interactive demo fallbacks.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Role-Based Auth (RBAC)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Granular user and admin route guards, system metrics panel, and user account management features.
          </p>
        </motion.div>
      </div>

      {/* Direct Email Dispatch Card */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-2xl backdrop-blur-2xl max-w-3xl mx-auto w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Send Message to Email</h3>
            <p className="text-xs text-slate-400">Target Recipient: <strong className="text-indigo-300">irfangames1065@gmail.com</strong></p>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Your Name</label>
              <input
                type="text"
                value={msgForm.name}
                onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Your Email</label>
              <input
                type="email"
                value={msgForm.email}
                onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Subject</label>
            <input
              type="text"
              value={msgForm.subject}
              onChange={(e) => setMsgForm({ ...msgForm, subject: e.target.value })}
              placeholder="Inquiry / Feedback"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Message</label>
            <textarea
              rows="3"
              value={msgForm.message}
              onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
              placeholder="Write your message here... it will be sent directly to irfangames1065@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-indigo-500/20"
          >
            {sending ? 'Sending Message...' : 'Dispatch Message to Email'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
