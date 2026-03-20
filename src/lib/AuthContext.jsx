// @ts-nocheck
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../lib/api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    
    // 🐛 FIX 1: Catch the sneaky "undefined" string bug and kick to login
    if (!token || token === 'undefined' || token === 'null') {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Ensure they don't get stuck spinning on the dashboard
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return;
    }

    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      
      const response = await api.get('/users/me/');
      
      // 🐛 FIX 2: Safely grab the user data whether it's wrapped in an Axios response or not
      const userData = response.data ? response.data : response;
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // 🐛 FIX 3: If auth fails on the dashboard, kick them back to login instead of spinning!
      if (window.location.pathname !== '/login') {
          window.location.href = '/login';
      }
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const login = async (username, password) => {
    try {
      setAuthError(null);
      
      // ✅ FULL RENDER URL ADDED HERE!
      const response = await fetch('https://farmflow-api-s521.onrender.com/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
          throw new Error("Invalid username or password");
      }

      const data = await response.json();

      // 🐛 FIX 4: Support both `access` and `access_token` naming conventions
      const accessToken = data.access || data.access_token;
      const refreshToken = data.refresh || data.refresh_token;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      await checkUserAuth();
      window.location.href = '/'; 

    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      login, 
      logout,
      navigateToLogin,
      refreshAuth: checkUserAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};