import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const tone =
    type === 'success'
      ? { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16,185,129,0.45)', icon: '#34d399', text: '#d1fae5' }
      : type === 'error'
      ? { bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244,63,94,0.45)', icon: '#fb7185', text: '#ffe4e6' }
      : { bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99,102,241,0.45)', icon: '#a78bfa', text: '#e0e7ff' };

  const icon =
    type === 'success' ? (
      <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: tone.icon }} />
    ) : type === 'error' ? (
      <AlertCircle className="w-5 h-5 shrink-0" style={{ color: tone.icon }} />
    ) : (
      <Info className="w-5 h-5 shrink-0" style={{ color: tone.icon }} />
    );

  return (
    <div className="fixed top-20 right-4 z-[100] max-w-[min(92vw,28rem)] pointer-events-none sm:right-5 sm:top-20">
      <div
        className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl"
        style={{ background: tone.bg, borderColor: tone.border, boxShadow: '0 20px 45px rgba(15, 23, 42, 0.35)' }}
      >
        {icon}
        <p className="text-sm font-medium pr-2 break-words" style={{ color: tone.text }}>{message}</p>
        <button onClick={onClose} className="p-1 rounded-lg transition shrink-0" style={{ color: tone.text }}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
