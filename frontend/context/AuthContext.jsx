import React, { createContext, useContext, useState } from 'react';
import { login, registerUser, guestLogin } from '../serviceshttps://what-ef-production.up.railway.app/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const loginFn = async (email, password) => {
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        addToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const guestLoginFn = async (name, email, country) => {
    setLoading(true);
    try {
      const guestUser = await guestLogin(name, email, country);
      if (guestUser) {
        setUser(guestUser);
        localStorage.setItem('user', JSON.stringify(guestUser));
        addToast(`Welcome, Guest ${guestUser.name}!`, 'success');
        return guestUser;
      } else {
        throw new Error('Guest login failed');
      }
    } catch (error) {
      addToast(error.message || 'Guest login failed', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    addToast('Logged out successfully', 'info');
  };

  const register = async (name, email, password, country) => {
    setLoading(true);
    try {
      const newUser = await registerUser(name, email, password, country);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      addToast(`Welcome, ${newUser.name}!`, 'success');
    } catch (error) {
      addToast(error.message || 'Registration failed', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: loginFn, guestLogin: guestLoginFn, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
