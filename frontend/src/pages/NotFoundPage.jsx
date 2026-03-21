import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>404</h1>
        <p className="auth-lead">Cette page n’existe pas.</p>
        <Link className="btn btn--primary" to="/">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
