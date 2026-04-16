'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  loggedIn: boolean;
  checkingAuth: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  checkingAuth: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => setLoggedIn(res.ok))
      .catch(() => setLoggedIn(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, checkingAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
