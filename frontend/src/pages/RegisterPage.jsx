import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mentee");

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "mentor" || r === "mentee") setRole(r);
  }, [searchParams]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role
        })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "erreur");
      }
      const data = await res.json();
      await loginWithToken(data.access_token);
      navigate("/app", { replace: true });
    } catch {
      setError("Email déjà utilisé ou mot de passe trop court (8+ caractères).");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <Link to="/" className="auth-back">
          ← Retour à l’accueil
        </Link>
        <h1>Créer un compte</h1>
        <p className="auth-lead">
          Rejoignez MentorBénin en tant que mentee ou mentor.
        </p>
        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Nom complet
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Mot de passe (min. 8 caractères)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <label>
            Je m’inscris comme
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? "Création…" : "Valider mon inscription"}
          </button>
        </form>
        <p className="auth-alt">
          Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
