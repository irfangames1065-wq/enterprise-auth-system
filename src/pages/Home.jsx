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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="robot-grid text-center space-y-6 pt-6 relative"
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="robot-status"><span className="dot" />System online</div>
          <div className="robot-badge">Ai core active</div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md" style={{ background: 'var(--brand-primary-soft)', borderColor: 'var(--border-strong)', color: '#a78bfa' }}>
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          Production-Ready AI Authentication Stack
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-0.05em] max-w-5xl mx-auto leading-[0.95]" style={{ color: 'var(--heading)' }}>
          MYAPP ROBOT CORE
          <span className="mt-3 block text-transparent bg-clip-text" style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)' }}>
            Advanced AI Control System
          </span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Enterprise-grade security, intelligent automation, and premium robotic workflow orchestration for modern digital operations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/register" className="theme-btn-primary px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition hover:scale-[1.02] flex items-center gap-2">
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="px-6 py-3.5 rounded-2xl font-semibold text-sm transition theme-btn-secondary">
            Sign In Portal
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <motion.div whileHover={{ y: -5 }} className="robot-panel p-6 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.1)', borderColor: 'rgba(34,211,238,0.25)', color: '#67e8f9' }}>
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--heading)' }}>Dual JWT Security</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            15-minute access keys and secure refresh routing with hardened telemetry links and encrypted session management.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="robot-panel p-6 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(168,85,247,0.3)', color: '#a78bfa' }}>
            <Key className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--heading)' }}>OTP Verification</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Adaptive one-time passes and secure recovery for email delivery to <strong style={{ color: '#a78bfa' }}>irfangames1065@gmail.com</strong>.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="robot-panel p-6 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#34d399' }}>
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--heading)' }}>RBAC Firewall</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Role-based access, admin controls, and live user analytics to preserve secure, scalable access control.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="robot-panel p-8 rounded-3xl max-w-3xl mx-auto w-full"
      >
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border" style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(168,85,247,0.3)', color: '#a78bfa' }}>
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--heading)' }}>Send Message to Email</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Target recipient: <strong style={{ color: '#a78bfa' }}>irfangames1065@gmail.com</strong></p>
            </div>
          </div>
          <div className="robot-status"><span className="dot" />Secure link</div>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>Your Name</label>
              <input type="text" value={msgForm.name} onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })} placeholder="John Doe" className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>Your Email</label>
              <input type="email" value={msgForm.email} onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })} placeholder="you@example.com" className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>Subject</label>
            <input type="text" value={msgForm.subject} onChange={(e) => setMsgForm({ ...msgForm, subject: e.target.value })} placeholder="Inquiry / Feedback" className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>Message</label>
            <textarea rows="3" value={msgForm.message} onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })} placeholder="Write your message here..." className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition resize-none" />
          </div>

          <button type="submit" disabled={sending} className="theme-btn-primary w-full py-3 rounded-xl font-bold text-sm transition disabled:opacity-50">
            {sending ? 'Sending Message...' : 'Dispatch Message to Email'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
