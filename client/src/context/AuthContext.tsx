"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface UserDecoded {
  id: string;
  email: string;
  role: "USER" | "EMPLOYER" | "ADMIN";
}

interface AuthContextType {
  user: UserDecoded | null;
  token: string | null;
  isAuthenticated: boolean;
  isEmployer: boolean;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDecoded | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<UserDecoded>(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    const cleanToken = newToken.replace("Bearer ", "");
    localStorage.setItem("token", cleanToken);
    try {
      const decoded = jwtDecode<UserDecoded>(cleanToken);
      setUser(decoded);
      setToken(cleanToken);
    } catch {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isEmployer: user?.role === "EMPLOYER",
        isAdmin: user?.role === "ADMIN",
        isUser: user?.role === "USER",
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
