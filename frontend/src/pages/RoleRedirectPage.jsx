import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirectPage() {
  const { user } = useAuth();
  if (!user) return null;
  switch (user.role) {
    case "admin":
      return <Navigate to="/app/admin/parcours" replace />;
    case "mentor":
      return <Navigate to="/app/mentor" replace />;
    default:
      return <Navigate to="/app/mentee" replace />;
  }
}
