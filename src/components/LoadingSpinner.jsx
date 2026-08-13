import React from 'react';

export const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses =
    size === 'sm' ? 'w-5 h-5 border-2' : size === 'lg' ? 'w-12 h-12 border-4' : 'w-8 h-8 border-3';

  const spinner = (
    <div
      className={`${sizeClasses} border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
        {spinner}
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading Nexus System...</p>
      </div>
    );
  }

  return spinner;
};
