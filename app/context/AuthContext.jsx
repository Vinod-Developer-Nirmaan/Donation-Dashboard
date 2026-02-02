'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        localStorage.removeItem('auth-token');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token);
        }
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
