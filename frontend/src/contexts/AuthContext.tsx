import { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "RESTORE_SESSION"; payload: AuthState };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case "RESTORE_SESSION":
      return action.payload;
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 컴포넌트 마운트 시 localStorage에서 세션 복원
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("auth");
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        dispatch({ type: "RESTORE_SESSION", payload: parsedAuth });
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
    }
  }, []);

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(state));
  }, [state]);

  const login = (user: User, token: string) => {
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
