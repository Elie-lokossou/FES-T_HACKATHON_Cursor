import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

export default function MentorInboxPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/mentor/inbox`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        setItems(await res.json());
      } catch {
        setError("Impossible de charger l’inbox.");
      }
    })();
  }, [token]);

  return (
    <div className="page-panel">
      <h2>Inbox mentor</h2>
      <p className="muted">Demandes et messages récents (démo).</p>
      {error && <p className="form-error">{error}</p>}
      <ul className="msg-thread">
        {items.length === 0 && !error && (
          <li className="muted">Aucun message pour l’instant.</li>
        )}
        {items.map((m) => (
          <li key={m.id}>
            <span className="msg-meta">
              #{m.id} · {m.mentee_name}
            </span>
            <p>{m.content}</p>
            <time>{new Date(m.created_at).toLocaleString("fr-FR")}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}
