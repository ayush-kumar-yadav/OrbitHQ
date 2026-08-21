import {
    createContext,
    useContext,
    useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthReady: boolean;

  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(
  null
);

function readStoredUser(): User | null {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Lazy initializers run synchronously during the first render,
  // so `user`/`accessToken` are already correct before any child
  // (like ProtectedRoute) gets a chance to read them. This avoids
  // the old race where a useEffect restored the token *after*
  // ProtectedRoute had already redirected to /login on refresh.
  const [user, setUser] = useState<User | null>(readStoredUser);

  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken")
  );

  function login(user: User, token: string, refreshToken?: string) {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("user", JSON.stringify(user));

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  setUser(user);
  setAccessToken(token);
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  setUser(null);
  setAccessToken(null);
}
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthReady: true,
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

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}