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
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--heading)' }}>Security OTP Verification</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enter the 6-digit code sent to your email</p>
        </div>

        {otpPreview && (
          <div className="p-3 rounded-xl border text-xs text-center flex items-center justify-center gap-2" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.28)', color: '#fbbf24' }}>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Dev OTP Code Preview: <strong className="tracking-widest text-base font-bold" style={{ color: 'var(--heading)' }}>{otpPreview}</strong>
          </div>
        )}

        <div className="theme-card p-5 sm:p-8 rounded-3xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Verification Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="theme-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-3 text-center" style={{ color: 'var(--text-muted)' }}>6-Digit Security OTP Code</label>
              <div className="flex gap-2 justify-center overflow-x-auto pb-1" onPaste={handlePaste}>
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
                    className="theme-input w-11 h-12 text-center text-xl font-bold rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Code expires in: <strong style={{ color: '#818cf8' }}>{formatTimer(timer)}</strong></span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold hover:underline flex items-center gap-1 disabled:opacity-50" style={{ color: '#818cf8' }}
              >
                <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="theme-btn-primary w-full py-3 rounded-xl font-bold text-sm shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
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
