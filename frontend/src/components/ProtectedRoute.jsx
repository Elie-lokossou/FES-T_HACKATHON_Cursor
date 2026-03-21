import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Redirige vers /connexion si non connecté.
 * Si `roles` est défini, vérifie le rôle utilisateur.
 */
export default function ProtectedRoute({ children, roles }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading && token) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-hidden />
        <p>Chargement de votre session…</p>
      </div>
    );
  }

  if (!token || !user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/connexion?next=${next}`} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
