import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(
  null
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);
  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    setAccessToken(token);
    setUser(JSON.parse(storedUser));
  }
}, []);

  function login(user: User, token: string) {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("user", JSON.stringify(user));

  setUser(user);
  setAccessToken(token);
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  setUser(null);
  setAccessToken(null);
}
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
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