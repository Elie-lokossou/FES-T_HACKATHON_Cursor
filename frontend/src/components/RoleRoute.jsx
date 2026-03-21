import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Redirige vers /app si le rôle n'est pas autorisé. */
export default function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return null;
  if (!roles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }
  return children;
}
