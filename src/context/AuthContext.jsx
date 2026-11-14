import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, requestEmailOtp, verifyEmailOtp, resendEmailOtp } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('elan_token'));
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register' or 'otp'
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('elan_token');
      const storedUser = localStorage.getItem('elan_user');
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const freshUser = await getMe();
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('elan_user', JSON.stringify(freshUser));
          }
        } catch (e) {
          console.error('Failed parsing stored user', e);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    if (data?.requiresVerification) {
      if (data.email || data.user?.email) {
        setPendingEmail(data.email || data.user.email);
      }
      return data;
    }
    if (data && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('elan_token', data.token);
      localStorage.setItem('elan_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data;
    }
    throw new Error('Invalid login response');
  };

  const requestOtp = async ({ email, name }) => {
    const data = await requestEmailOtp({ email, name });
    if (data?.email) {
      setPendingEmail(data.email);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    if (data) {
      if (data.email) {
        setPendingEmail(data.email);
      }
      if (!data.requiresVerification && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('elan_token', data.token);
        localStorage.setItem('elan_user', JSON.stringify(data.user));
      }
      return data;
    }
    throw new Error('Invalid registration response');
  };

  const verifyOtp = async ({ email, phone, otp }) => {
    const data = await verifyEmailOtp({ email, phone, otp });
    if (data && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('elan_token', data.token);
      localStorage.setItem('elan_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      setPendingEmail('');
      return data.user;
    }
    throw new Error('Verification failed');
  };

  const resendOtp = async ({ email, phone }) => {
    const data = await resendEmailOtp({ email, phone });
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPendingEmail('');
    localStorage.removeItem('elan_token');
    localStorage.removeItem('elan_user');
  };

  const openAuthModal = (mode = 'login', email = '') => {
    setAuthMode(mode);
    if (email) {
      setPendingEmail(email);
    } else if (mode !== 'otp') {
      setPendingEmail('');
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        pendingEmail,
        setPendingEmail,
        openAuthModal,
        closeAuthModal,
        login,
        requestOtp,
        register,
        verifyOtp,
        resendOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
