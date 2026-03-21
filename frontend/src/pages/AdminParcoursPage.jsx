import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

export default function AdminParcoursPage() {
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("Étape A, Étape B, Étape C");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function refresh() {
    const res = await fetch(`${API_BASE}/api/parcours`);
    if (res.ok) setList(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      const res = await fetch(`${API_BASE}/api/parcours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          steps: steps.split(",").map((s) => s.trim()).filter(Boolean)
        })
      });
      if (!res.ok) throw new Error();
      setOk("Parcours publié.");
      setTitle("");
      setDescription("");
      setSteps("Étape A, Étape B");
      await refresh();
    } catch {
      setError("Création refusée (rôle admin requis).");
    }
  }

  return (
    <div className="page-panel">
      <h2>Admin — Parcours</h2>
      <p className="muted">Créer et publier un parcours (back-office MVP).</p>

      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Titre
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={4}
          />
        </label>
        <label>
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
          />
        </label>
        <label>
          Étapes (séparées par des virgules)
          <input value={steps} onChange={(e) => setSteps(e.target.value)} />
        </label>
        <button type="submit" className="btn btn--primary">
          Publier
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
      {ok && <p className="form-ok">{ok}</p>}

      <h3 className="mt-2">Parcours existants</h3>
      <ul className="admin-list">
        {list.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong> — {p.steps.length} étapes
          </li>
        ))}
      </ul>
    </div>
  );
}
