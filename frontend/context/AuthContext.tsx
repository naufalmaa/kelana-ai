"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import {
  getAuthToken,
  getStoredUser,
  loginApi,
  registerApi,
  removeAuthToken,
  removeStoredUser,
  getMeApi,
} from "@/services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  // Modal state
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register", onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  onAuthSuccessCallback: (() => void) | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState<(() => void) | null>(null);

  // Revalidate session token with backend on mount
  useEffect(() => {
    const savedToken = getAuthToken();

    if (savedToken) {
      getMeApi(savedToken)
        .then((fetchedUser) => {
          setUser(fetchedUser);
        })
        .catch(() => {
          // If token expired or invalid, clear
          removeAuthToken();
          removeStoredUser();
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await loginApi(credentials);
      setToken(res.access_token);
      setUser(res.user);
      setIsAuthModalOpen(false);

      if (onAuthSuccessCallback) {
        onAuthSuccessCallback();
        setOnAuthSuccessCallback(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onAuthSuccessCallback]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      await registerApi(credentials);
      // Auto-login after registration
      await login({
        email: credentials.email,
        password: credentials.password,
      });
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    removeAuthToken();
    removeStoredUser();
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  const openAuthModal = useCallback((mode: "login" | "register" = "login", onSuccess?: () => void) => {
    setAuthModalMode(mode);
    if (onSuccess) {
      setOnAuthSuccessCallback(() => onSuccess);
    } else {
      setOnAuthSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setOnAuthSuccessCallback(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        onAuthSuccessCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
