"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import fetchClient from "@/lib/utils/axiosFetcher";

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
  login: (userData: UserDecoded, token?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDecoded | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify token with cookies first
        const res = await fetchClient<any>("/api/v1/auth/verifyToken", { method: "POST" });
        if (res.success && res.data) {
          setUser(res.data);
          setToken(localStorage.getItem("token") || "cookie-authenticated");
        } else {
          setUser(null);
        }
      } catch {
        // Fallback to checking localStorage if cookies check fails or is not supported
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          try {
            const decoded = jwtDecode<UserDecoded>(storedToken);
            setUser(decoded);
            setToken(storedToken);
          } catch {
            localStorage.removeItem("token");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData: UserDecoded, newToken?: string) => {
    setUser(userData);
    if (newToken) {
      const cleanToken = newToken.replace("Bearer ", "");
      localStorage.setItem("token", cleanToken);
      setToken(cleanToken);
    } else {
      setToken("cookie-authenticated");
    }
  };

  const logout = async () => {
    try {
      await fetchClient("/api/v1/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      router.push("/login");
    }
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
