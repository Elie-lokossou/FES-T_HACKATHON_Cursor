import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MenteeHomePage() {
  const { user } = useAuth();

  return (
    <div className="page-panel">
      <div className="page-panel__intro">
        <h2>Bonjour, {user?.full_name?.split(" ")[0] ?? "mentee"}</h2>
        <p>
          Complète ton profil, lance le matching et échange avec un mentor — tout
          depuis cet espace.
        </p>
      </div>
      <div className="tile-grid">
        <Link className="tile" to="/app/matching">
          <span className="tile__ico">◎</span>
          <strong>Matching</strong>
          <span>Top 3 mentors selon ton profil</span>
        </Link>
        <Link className="tile" to="/app/messages">
          <span className="tile__ico">✉</span>
          <strong>Messages</strong>
          <span>Écris à ton mentor</span>
        </Link>
        <Link className="tile" to="/app/parcours">
          <span className="tile__ico">≡</span>
          <strong>Parcours</strong>
          <span>CV, entretien, réseau</span>
        </Link>
      </div>
    </div>
  );
}
