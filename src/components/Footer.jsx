import React from 'react';
import { Shield, Heart, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-200">Nexus Auth System</span>
          <span>• Production-Ready MERN Stack Architecture</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            256-bit JWT & Bcrypt Encryption
          </span>
          <span>Target Mail: <strong className="text-indigo-400">irfangames1065@gmail.com</strong></span>
        </div>
      </div>
    </footer>
  );
};
