import React from 'react';

export const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses =
    size === 'sm' ? 'w-5 h-5 border-2' : size === 'lg' ? 'w-12 h-12 border-4' : 'w-8 h-8 border-3';

  const spinner = (
    <div className="relative flex items-center justify-center">
      <div className={`${sizeClasses} border-cyan-400/25 border-t-cyan-400 border-r-violet-400 rounded-full animate-spin`} />
      <div className="absolute inset-0 rounded-full border border-violet-400/25 animate-ping" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 backdrop-blur-sm" style={{ background: 'rgba(2, 6, 23, 0.62)' }}>
        {spinner}
        <div className="robot-status"><span className="dot" />Loading Robot Core...</div>
      </div>
    );
  }

  return spinner;
};
