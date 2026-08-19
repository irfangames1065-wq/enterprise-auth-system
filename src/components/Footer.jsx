import React from 'react';
import { Shield, Heart, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t py-8 mt-auto" style={{ background: 'rgba(11, 17, 29, 0.48)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center md:justify-start">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border" style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(168,85,247,0.35)', color: '#a78bfa' }}>
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--heading)' }}>MyApp Robot Core</span>
          <span className="break-words">• AI control system</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
          <span className="flex items-center gap-1.5 justify-center" style={{ color: 'var(--text-muted)' }}>
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Secure telemetry link
          </span>
          <span className="break-all">Target Mail: <strong style={{ color: '#a78bfa' }}>irfangames1065@gmail.com</strong></span>
        </div>
      </div>
    </footer>
  );
};
