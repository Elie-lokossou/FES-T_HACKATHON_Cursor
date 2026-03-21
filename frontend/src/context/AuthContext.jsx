import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { API_BASE, STORAGE_TOKEN_KEY } from "../config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_TOKEN_KEY) : ""
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const setToken = useCallback((t) => {
    setTokenState(t);
    if (t) localStorage.setItem(STORAGE_TOKEN_KEY, t);
    else localStorage.removeItem(STORAGE_TOKEN_KEY);
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
  }, [setToken]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("session");
        const me = await res.json();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) {
          setToken("");
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, setToken]);

  const loginWithToken = useCallback(
    (accessToken) => {
      setToken(accessToken);
    },
    [setToken]
  );

  const loadMe = useCallback(async () => {
    if (!token) return null;
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const me = await res.json();
    setUser(me);
    return me;
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      setToken,
      loginWithToken,
      logout,
      loadMe
    }),
    [token, user, loading, setToken, loginWithToken, logout, loadMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
