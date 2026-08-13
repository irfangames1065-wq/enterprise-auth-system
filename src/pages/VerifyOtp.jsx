import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import api from '../api/axios';

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  const initialEmail = location.state?.email || '';
  const otpPreview = location.state?.otpPreview || null;

  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(600); // 10 mins countdown
  const [toast, setToast] = useState(null);

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (otpPreview) {
      const codeStr = otpPreview.toString();
      if (codeStr.length === 6) {
        setOtpDigits(codeStr.split(''));
      }
    }
  }, [otpPreview]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits([...digits, '', '', '', '', ''].slice(0, 6));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 6) {
      setToast({ type: 'error', message: 'Please enter the complete 6-digit OTP code.' });
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(email, fullOtp);
      setToast({ type: 'success', message: data.message });
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Invalid OTP verification code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setToast({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', { email });
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        setTimer(600);
        if (res.data.otpPreview) {
          setOtpDigits(res.data.otpPreview.toString().split(''));
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to resend OTP.' });
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-1">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Security OTP Verification</h2>
          <p className="text-xs text-slate-400">Enter the 6-digit code sent to your email</p>
        </div>

        {otpPreview && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Dev OTP Code Preview: <strong className="text-white tracking-widest text-base font-bold">{otpPreview}</strong>
          </div>
        )}

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Verification Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-3 text-center">6-Digit Security OTP Code</label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-xl font-bold bg-slate-950/90 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Code expires in: <strong className="text-indigo-400">{formatTimer(timer)}</strong></span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-indigo-400 font-semibold hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying Code...' : 'Verify OTP & Enter Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
