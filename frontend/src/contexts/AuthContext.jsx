// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const normalizeUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    id: u._id ? String(u._id) : u.id ? String(u.id) : undefined,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(normalizeUser(res.user));
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(normalizeUser(res.user));
    return res;
  };

  const register = async (name, email, password, role = 'attendee') => {
    const res = await api.post('/api/auth/register', { name, email, password, role });
    setUser(normalizeUser(res.user));
    return res;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
