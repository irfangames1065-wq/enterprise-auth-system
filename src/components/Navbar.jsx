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
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors"
      style={{ background: 'rgba(9,16,27,0.58)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-w-0 gap-2">
          <Link to="/" className="flex items-center gap-2 group min-w-0 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform border border-cyan-400/30">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex items-center min-w-0 gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight leading-none" style={{ color: 'var(--heading)' }}>
                MyApp
              </span>
              <span className="robot-badge">PRO</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition" style={{ color: 'var(--text-muted)' }}>
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-sm font-medium transition" style={{ color: 'var(--text-muted)' }}>
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium transition flex items-center gap-1" style={{ color: '#a78bfa' }}>
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition"
              style={{ background: 'var(--panel-soft)', borderColor: 'var(--border)', color: 'var(--text)' }}
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                {isDark ? 'On' : 'Off'}
              </span>
              <span className="relative flex h-7 w-12 items-center rounded-full border border-cyan-400/40 bg-slate-900/80 p-1">
                <span
                  className={`inline-block h-5 w-5 rounded-full transition-all ${isDark ? 'translate-x-5 bg-cyan-400' : 'translate-x-0 bg-violet-400'}`}
                />
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition"
                  style={{ background: 'var(--panel-soft)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-lg object-cover border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold line-clamp-1" style={{ color: 'var(--heading)' }}>{user?.name}</p>
                    <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border p-1.5 z-50 shadow-2xl" style={{ background: 'var(--surface-strong)', borderColor: 'var(--border)' }}>
                    <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--heading)' }}>{user?.email}</p>
                    </div>

                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition" style={{ color: 'var(--text)' }}>
                      <User className="w-4 h-4 text-indigo-500" />
                      My Profile
                    </Link>

                    <button type="button" onClick={() => { setDropdownOpen(false); navigate('/settings'); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition text-left" style={{ color: 'var(--text)' }}>
                      <Settings className="w-4 h-4 text-violet-500" />
                      Security Settings
                    </button>

                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition" style={{ color: '#a78bfa' }}>
                        <Lock className="w-4 h-4 text-violet-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition mt-1 border-t text-left" style={{ color: '#f87171', borderColor: 'var(--border)' }}>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold rounded-xl transition" style={{ color: 'var(--text)', background: 'var(--panel-soft)', border: '1px solid var(--border)' }}>
                  Sign In
                </Link>
                <Link to="/register" className="theme-btn-primary px-4 py-2 text-sm font-semibold rounded-xl transition">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button onClick={toggleTheme} className="p-2 rounded-xl border" style={{ background: 'var(--panel-soft)', borderColor: 'var(--border)', color: 'var(--text)' }} aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-500" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl border" style={{ background: 'var(--panel-soft)', borderColor: 'var(--border)', color: 'var(--text)' }} aria-label="Toggle mobile menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b p-4 space-y-3" style={{ background: 'var(--surface-strong)', borderColor: 'var(--border)' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5" style={{ color: 'var(--text)' }}>Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5" style={{ color: 'var(--text)' }}>Dashboard</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5" style={{ color: 'var(--text)' }}>Profile</Link>
              <button type="button" onClick={() => { setMobileMenuOpen(false); navigate('/settings'); }} className="block w-full text-left text-sm font-medium py-1.5" style={{ color: 'var(--text)' }}>Settings</button>
              {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5" style={{ color: '#a78bfa' }}>Admin Panel</Link>}
              <button onClick={handleLogout} className="w-full text-left text-sm font-medium py-1.5" style={{ color: '#f87171' }}>Sign Out</button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-2 text-sm font-semibold rounded-xl" style={{ background: 'var(--panel-soft)', border: '1px solid var(--border)', color: 'var(--text)' }}>Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="theme-btn-primary w-full text-center px-4 py-2 text-sm font-semibold rounded-xl">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
