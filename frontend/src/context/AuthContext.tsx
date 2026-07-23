import { createContext, useContext, useState, type ReactNode } from "react";
import { login as apiLogin, logout as apiLogout, getStoredUsername } from "../api/auth";

interface AuthContextValue {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => getStoredUsername());

  const login = async (u: string, password: string) => {
    await apiLogin(u, password);
    setUsername(u);
  };

  const logout = () => {
    apiLogout();
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!username, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
