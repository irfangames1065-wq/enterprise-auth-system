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

  const bgStyle =
    type === 'success'
      ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
      : type === 'error'
      ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
      : 'bg-indigo-950/90 border-indigo-500/40 text-indigo-200';

  const icon =
    type === 'success' ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
    ) : type === 'error' ? (
      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
    ) : (
      <Info className="w-5 h-5 text-indigo-400 shrink-0" />
    );

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce-short max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${bgStyle}`}
      >
        {icon}
        <p className="text-sm font-medium pr-2">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
