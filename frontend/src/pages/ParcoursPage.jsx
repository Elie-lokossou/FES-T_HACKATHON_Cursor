import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function ParcoursPage() {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/parcours`);
        if (!res.ok) throw new Error();
        setList(await res.json());
      } catch {
        setError("Impossible de charger les parcours.");
      }
    })();
  }, []);

  return (
    <div className="page-panel">
      <h2>Parcours guidés</h2>
      <p className="muted">
        Étapes structurées — validation mentor à chaque jalon (MVP).
      </p>
      {error && <p className="form-error">{error}</p>}
      <div className="parcours-grid">
        {list.map((p) => (
          <article key={p.id} className="parc-card">
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <ol>
              {p.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
