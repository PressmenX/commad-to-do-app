import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authApi } from "../services/authApi";
import { api } from "../services/api";

export interface IUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchAuthenticatedUser(): Promise<IUser | null> {
  try {
    const res = await api.get("/auth/profile");
    return res.data.result || res.data;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;

    void fetchAuthenticatedUser()
      .then((authenticatedUser) => {
        if (isActive) {
          setUser(authenticatedUser);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, pass);
      setUser(res.data || res.result);
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
        login,
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
