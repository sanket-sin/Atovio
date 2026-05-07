/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User, login, register, logout as authLogout, getCurrentUser } from "./auth-service";
import { isAuthenticated, clearAuthToken } from "./token-manager";

/** Only these routes need a `/api/auth/me` call on load (not the marketing homepage). */
const ROUTES_WITH_SESSION_BOOTSTRAP = ["/dashboard"];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const needsSessionBootstrap = ROUTES_WITH_SESSION_BOOTSTRAP.some((p) =>
      pathname?.startsWith(p)
    );

    if (!needsSessionBootstrap) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        if (isAuthenticated()) {
          try {
            const currentUser = await getCurrentUser();
            if (!cancelled) setUser(currentUser);
          } catch {
            if (!cancelled) clearAuthToken();
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name?: string
  ) => {
    try {
      const response = await register({ email, password, name });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      handleLogout();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
