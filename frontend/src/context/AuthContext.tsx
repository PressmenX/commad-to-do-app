import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { authApi } from "../services/authApi";
import { api } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

export interface IUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  sessionStatus: "authenticated" | "unauthenticated" | "unknown";
  retrySessionCheck: () => void;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type SessionCheckResult =
  | { status: "authenticated"; user: IUser }
  | { status: "unauthenticated" | "unknown"; user: null };

async function fetchAuthenticatedUser(): Promise<SessionCheckResult> {
  try {
    const res = await api.get("/auth/profile");
    return {
      status: "authenticated",
      user: res.data.result || res.data,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "status" in error.response &&
      error.response.status === 401
    ) {
      return { status: "unauthenticated", user: null };
    }
    return { status: "unknown", user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionStatus, setSessionStatus] = useState<
    "authenticated" | "unauthenticated" | "unknown"
  >("unknown");
  const queryClient = useQueryClient();
  const isMounted = useRef(false);
  const isCheckingSession = useRef(false);
  const sessionStatusRef = useRef(sessionStatus);

  useEffect(() => {
    sessionStatusRef.current = sessionStatus;
  }, [sessionStatus]);

  const checkSession = useCallback(async () => {
    if (isCheckingSession.current) return;
    isCheckingSession.current = true;
    setIsLoading(true);

    try {
      const result = await fetchAuthenticatedUser();
      if (!isMounted.current) return;
      setUser(result.user);
      setSessionStatus(result.status);
    } finally {
      isCheckingSession.current = false;
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    void checkSession();

    const handleUnauthorized = () => {
      setUser(null);
      setSessionStatus("unauthenticated");
      queryClient.clear();
    };
    const handleOnline = () => {
      if (sessionStatusRef.current === "unknown") void checkSession();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    window.addEventListener("online", handleOnline);
    return () => {
      isMounted.current = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      window.removeEventListener("online", handleOnline);
    };
  }, [checkSession, queryClient]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, pass);
      setUser(res.data || res.result);
      setSessionStatus("authenticated");
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setSessionStatus("unauthenticated");
      queryClient.clear();
    } catch (err) {
      console.error("Logout failed", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        sessionStatus,
        retrySessionCheck: () => void checkSession(),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
