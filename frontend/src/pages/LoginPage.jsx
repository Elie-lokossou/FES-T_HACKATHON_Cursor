import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginWithToken } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const next = searchParams.get("next") || "/app";
  const [email, setEmail] = useState("mentee@mentor.bj");
  const [password, setPassword] = useState("MenteePass123");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      await loginWithToken(data.access_token);
      navigate(next.startsWith("/") ? next : "/app", { replace: true });
    } catch {
      setError("Identifiants incorrects ou serveur indisponible.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">
          ← Retour à l’accueil
        </Link>
        <h1>Connexion</h1>
        <p className="auth-lead">
          Accédez à votre espace mentorat sécurisé (JWT).
        </p>
        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="auth-alt">
          Pas encore de compte ?{" "}
          <Link to="/inscription">Créer un profil</Link>
        </p>
      </div>
    </div>
  );
}
