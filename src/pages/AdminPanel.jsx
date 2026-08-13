import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, UserCheck, ShieldAlert, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { Toast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);

      if (usersRes.data?.success) setUsers(usersRes.data.users);
      if (statsRes.data?.success) setStats(statsRes.data.stats);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to load admin metrics.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setActionLoading(true);
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchAdminData();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Role update failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setActionLoading(true);
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchAdminData();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'User deletion failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">System Admin Console</h1>
            <p className="text-xs text-slate-400">Role-Based User Management & Analytics</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {/* Analytics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Total System Users</span>
            <p className="text-2xl font-black text-white">{stats.totalUsers}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Verified Accounts</span>
            <p className="text-2xl font-black text-emerald-400">{stats.verifiedUsers}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Admin Controllers</span>
            <p className="text-2xl font-black text-purple-400">{stats.adminCount}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Target SMTP Email</span>
            <p className="text-xs font-bold text-indigo-300 truncate mt-1">irfangames1065@gmail.com</p>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Registered Users Management ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id || u.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {u.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium">Unverified</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(u._id || u.id, u.role)}
                        disabled={actionLoading}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 transition"
                      >
                        Set as {u.role === 'admin' ? 'User' : 'Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id || u.id)}
                        disabled={actionLoading}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-400 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
