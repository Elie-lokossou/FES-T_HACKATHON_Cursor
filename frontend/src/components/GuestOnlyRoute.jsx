import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Pages connexion / inscription : redirige vers /app si déjà connecté. */
export default function GuestOnlyRoute({ children }) {
  const { token, user, loading } = useAuth();

  if (loading && token) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-hidden />
        <p>Vérification de la session…</p>
      </div>
    );
  }

  if (token && user) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
