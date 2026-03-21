import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

export default function MessagesPage() {
  const { token, user } = useAuth();
  const [mentorId, setMentorId] = useState("1");
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function refresh() {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch {
      setError("Impossible de charger les messages.");
    }
  }

  useEffect(() => {
    refresh();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function send(e) {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mentee_name: user?.full_name || "Mentee",
          mentor_id: Number(mentorId),
          content: text.trim()
        })
      });
      if (!res.ok) throw new Error();
      setText("");
      setOk("Message envoyé.");
      await refresh();
    } catch {
      setError("Envoi impossible.");
    }
  }

  return (
    <div className="page-panel">
      <h2>Messagerie</h2>
      <p className="muted">
        Canal 1-to-1 avec le mentor (démo — stockage mémoire côté API).
      </p>

      <form onSubmit={send} className="msg-compose">
        <label>
          ID mentor
          <input
            type="number"
            min={1}
            max={99}
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
          />
        </label>
        <label className="msg-compose__grow">
          Message
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bonjour, je souhaite préparer mon CV..."
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={!text.trim()}>
          Envoyer
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
      {ok && <p className="form-ok">{ok}</p>}

      <h3 className="mt-2">Historique</h3>
      <ul className="msg-thread">
        {items.length === 0 && (
          <li className="muted">Aucun message pour l’instant.</li>
        )}
        {items.map((m) => (
          <li key={m.id}>
            <span className="msg-meta">
              #{m.id} · {m.mentee_name} → mentor {m.mentor_id}
            </span>
            <p>{m.content}</p>
            <time>{new Date(m.created_at).toLocaleString("fr-FR")}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}
