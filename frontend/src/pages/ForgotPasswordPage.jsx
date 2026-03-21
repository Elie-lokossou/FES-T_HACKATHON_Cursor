import { Link } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";
import MarketingNav from "../components/MarketingNav";

/**
 * MVP : pas de reset réel côté API — page de réassurance + lien retour.
 */
export default function ForgotPasswordPage() {
  return (
    <div className="landing">
      <MarketingNav />
      <section className="ld-section legal-page" style={{ paddingTop: "120px" }}>
        <h1>Mot de passe oublié</h1>
        <p className="muted">
          La réinitialisation automatique par e-mail sera activée en production
          (Brevo / SendGrid). Pour la démo, utilise un compte seed ou crée un
          nouveau compte depuis l’inscription.
        </p>
        <h2>Comptes de démonstration</h2>
        <ul>
          <li>
            <code>mentee@mentor.bj</code> / <code>MenteePass123</code>
          </li>
          <li>
            <code>mentor@mentor.bj</code> / <code>MentorPass123</code>
          </li>
          <li>
            <code>admin@mentor.bj</code> / <code>AdminPass123</code>
          </li>
        </ul>
        <p>
          <Link className="btn btn--primary" to="/connexion" style={{ marginTop: "1rem" }}>
            Retour à la connexion
          </Link>
        </p>
      </section>
      <MarketingFooter />
    </div>
  );
}
