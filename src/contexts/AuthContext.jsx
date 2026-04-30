import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { get, post, setToken, getToken, setOnUnauthorized } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    try { await post('/auth/logout'); } catch {}
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    const savedToken = getToken();
    if (!savedToken) {
      setLoading(false);
      return;
    }
    get('/auth/me')
      .then((u) => {
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        setToken(null);
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    const data = await post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    const data = await post('/auth/register', { name, email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const updateProfile = useCallback(async (data) => {
    const updated = await put('/auth/me', data);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, error, login, register, logout, updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
