import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (accessToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Auth check failed, clearing session.');
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    const res = await api.post('/auth/login', { email, password, rememberMe });
    if (res.data?.success) {
      const { user, accessToken, refreshToken } = res.data;
      setUser(user);
      setAccessToken(accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    }
    return res.data;
  };

  const register = async (name, email, password, role = 'user', adminSecret = '') => {
    const res = await api.post('/auth/register', { name, email, password, role, adminSecret });
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    if (res.data?.success) {
      const { user, accessToken, refreshToken } = res.data;
      setUser(user);
      setAccessToken(accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated: !!user && !!accessToken,
        isAdmin: user?.role === 'admin',
        login,
        register,
        verifyOtp,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
