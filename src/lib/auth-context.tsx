'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AddressType {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  addresses?: AddressType[];
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPin: (pin: string, emailOrPhone?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string, pin?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
  addresses: AddressType[];
  addAddress: (addr: Omit<AddressType, 'id' | 'userId'>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user?.addresses) {
          setAddresses(data.user.addresses);
        }
      }
    } catch (err) {
      console.error('Failed to load user', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = refreshUser;

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to login' };
      }
      setUser(data.user);
      if (data.user.addresses) setAddresses(data.user.addresses);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login error' };
    }
  };

  const loginWithPin = async (pin: string, emailOrPhone?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, emailOrPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Incorrect PIN' };
      }
      setUser(data.user);
      if (data.user.addresses) setAddresses(data.user.addresses);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'PIN login error' };
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string, pin?: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to sign up' };
      }
      setUser(data.user);
      setAddresses([]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setAddresses([]);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const addAddress = async (addr: Omit<AddressType, 'id' | 'userId'>) => {
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addr),
      });
      if (res.ok) {
        const created = await res.json();
        setAddresses((prev) => (created.isDefault ? [created, ...prev.map((a) => ({ ...a, isDefault: false }))] : [...prev, created]));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Add address error', err);
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithPin,
        signup,
        logout,
        refreshUser,
        checkAuth,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
