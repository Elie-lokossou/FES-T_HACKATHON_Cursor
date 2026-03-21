import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

const initial = {
  full_name: "",
  email: "",
  sector: "marketing",
  goals: "stage, cv",
  language: "fr",
  availability: "soir"
};

export default function MatchingPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (user?.full_name || user?.email) {
      setForm((s) => ({
        ...s,
        full_name: user.full_name || s.full_name,
        email: user.email || s.email
      }));
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]);

  const top = useMemo(() => matches[0] ?? null, [matches]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        goals: form.goals
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      };
      const res = await fetch(`${API_BASE}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setMatches(await res.json());
    } catch {
      setError("Impossible de calculer le matching. Vérifie que l’API tourne.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-panel">
      <h2>Matching intelligent</h2>
      <p className="muted">
        Score sur secteur, langue, disponibilité et objectifs — top 3 en moins de 2
        secondes.
      </p>

      <form onSubmit={onSubmit} className="form-grid form-grid--2">
        <label>
          Nom complet
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
        </label>
        <label>
          Secteur
          <select
            value={form.sector}
            onChange={(e) => setForm((s) => ({ ...s, sector: e.target.value }))}
          >
            <option value="marketing">Marketing</option>
            <option value="tech">Tech</option>
            <option value="data">Data</option>
            <option value="rh">RH</option>
          </select>
        </label>
        <label>
          Objectifs (séparés par des virgules)
          <input
            value={form.goals}
            onChange={(e) => setForm((s) => ({ ...s, goals: e.target.value }))}
          />
        </label>
        <label>
          Langue
          <select
            value={form.language}
            onChange={(e) => setForm((s) => ({ ...s, language: e.target.value }))}
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </label>
        <label>
          Disponibilité
          <select
            value={form.availability}
            onChange={(e) =>
              setForm((s) => ({ ...s, availability: e.target.value }))
            }
          >
            <option value="soir">Soir</option>
            <option value="weekend">Week-end</option>
            <option value="semaine">Semaine</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Calcul…" : "Trouver mes 3 mentors"}
          </button>
        </div>
      </form>

      {error && <p className="form-error">{error}</p>}

      {matches.length > 0 && (
        <>
          <h3 className="mt-2">Résultats</h3>
          <ul className="match-list">
            {matches.map((item) => (
              <li key={item.mentor.id} className="match-row">
                <div>
                  <strong>{item.mentor.name}</strong>
                  <div className="muted">
                    {item.mentor.role} · {item.mentor.sector}
                  </div>
                  <div className="match-reasons">{item.reasons.join(" · ")}</div>
                </div>
                <span className="match-score">{item.score}%</span>
              </li>
            ))}
          </ul>
          {top && (
            <p className="muted mt-1">
              <Link className="link" to="/app/messages">
                Contacter {top.mentor.name.split(" ")[0]} → Messages
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
