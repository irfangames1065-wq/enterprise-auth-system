import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="inline-flex p-4 rounded-3xl bg-rose-600/20 border border-rose-500/30 text-rose-400 mb-2">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <h1 className="text-6xl font-black text-white">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The security endpoint or page you requested does not exist or has been relocated.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Portal Home
        </Link>
      </motion.div>
    </div>
  );
};
