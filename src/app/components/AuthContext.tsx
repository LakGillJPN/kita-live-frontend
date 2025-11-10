"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: User | null;
  loadingAdmin: boolean;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  isAdminAuthenticated: boolean;
}

interface UserAuthContextType {
  user: User | null;
  loadingUser: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  isUserAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);
const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Admin state
  const [admin, setAdmin] = useState<User | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Initialize from storage
    try {
      const adminRaw = typeof window !== 'undefined' ? localStorage.getItem('adminAuth') : null;
      if (adminRaw) setAdmin(JSON.parse(adminRaw));
    } catch {
      setAdmin(null);
    } finally {
      setLoadingAdmin(false);
    }

    try {
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : null;
      if (userRaw) setUser(JSON.parse(userRaw));
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/v1/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const newAdmin: User = { email, role: 'admin' };
        setAdmin(newAdmin);
        try { localStorage.setItem('adminAuth', JSON.stringify(newAdmin)); } catch {}
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login failed:', error);
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminAuth');
      }
    } catch (error) {
      console.error('Admin logout failed:', error);
    } finally {
      setAdmin(null);
      router.push('/admin/login');
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const newUser: User = { email, role: 'user' };
        setUser(newUser);
        try { localStorage.setItem('userAuth', JSON.stringify(newUser)); } catch {}
        return true;
      }
      return false;
    } catch (error) {
      console.error('User login failed:', error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userAuth');
      }
    } catch (error) {
      console.error('User logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      loadingAdmin,
      loginAdmin,
      logoutAdmin,
      isAdminAuthenticated: !!admin,
    }}>
      <UserAuthContext.Provider value={{
        user,
        loadingUser,
        loginUser,
        logoutUser,
        isUserAuthenticated: !!user,
      }}>
        {children}
      </UserAuthContext.Provider>
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within an AuthProvider');
  }
  return context;
}
