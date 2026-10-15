import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bnb_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.checkSession()
        .then((res) => {
          if (res?.logged_in) {
            setAdmin(res.admin);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await api.login({ username, password });
    if (res.success && res.token) {
      localStorage.setItem('bnb_admin_token', res.token);
      setToken(res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      if (token) await api.logout();
    } catch {}
    localStorage.removeItem('bnb_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
