import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <h1>404</h1>
        <p className="auth-lead">Cette page n’existe pas ou a été déplacée.</p>
        <div className="notfound-links">
          <Link className="btn btn--primary" to="/">
            Accueil
          </Link>
          <Link className="btn btn--outline" to="/faq">
            FAQ
          </Link>
          <Link className="btn btn--outline" to="/connexion">
            Connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
