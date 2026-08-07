import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { setToken as setApiToken, getToken, api } from "../services/api";
import { authApi } from "../services";
import type { User } from "../types";
import { errorMessage } from "../services/api";

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }
    setApiToken(token);
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => {
        setApiToken(null);
        localStorage.removeItem("wp_token");
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setApiToken(res.token);
    localStorage.setItem("wp_token", res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.register({ name, email, password });
    setApiToken(res.token);
    localStorage.setItem("wp_token", res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => undefined);
    setApiToken(null);
    localStorage.removeItem("wp_token");
    setUser(null);
  }, []);

  const updateUser = useCallback((u: User) => setUser(u), []);

  // keep token fresh for api (me)
  useEffect(() => {
    const token = getToken();
    if (token) setApiToken(token);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { errorMessage, api };