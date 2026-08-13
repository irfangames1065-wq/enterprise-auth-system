import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Sun, Moon, LogOut, User, Settings, Lock, Menu, X, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Nexus
              </span>
              <span className="text-xs text-indigo-400 font-semibold ml-1.5 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* User Dropdown or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 transition"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      My Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                    >
                      <Settings className="w-4 h-4 text-purple-400" />
                      Security Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-purple-300 hover:bg-purple-950/40 rounded-xl transition"
                      >
                        <Lock className="w-4 h-4 text-purple-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/40 rounded-xl transition mt-1 border-t border-slate-800/60"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 py-1.5"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-300 py-1.5"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-300 py-1.5"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-300 py-1.5"
              >
                Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-purple-400 py-1.5"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-medium text-rose-400 py-1.5"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-900 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
