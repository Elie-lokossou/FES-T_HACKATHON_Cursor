import { Link } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";
import MarketingNav from "../components/MarketingNav";

export default function TarifsPage() {
  return (
    <div className="landing">
      <MarketingNav />
      <section className="ld-section ld-pricing-page">
        <p className="ld-kicker">Tarifs</p>
        <h2>
          Commence gratuitement,
          <br />
          <em>évolue selon tes besoins.</em>
        </h2>
        <p className="ld-lead ld-lead--center">
          Paiement Mobile Money — MTN MoMo, Moov Money, CinetPay.
        </p>
        <div className="pricing-grid pricing-grid--page">
          <article className="price-card">
            <div className="price-tier">Gratuit</div>
            <div className="price-amount">0 FCFA</div>
            <p className="price-period">Pour toujours</p>
            <ul className="price-features">
              <li>Profil mentee complet</li>
              <li>3 suggestions de mentors</li>
              <li>Messagerie 1-to-1</li>
              <li>Parcours standards</li>
            </ul>
            <Link className="btn btn--outline btn--block" to="/inscription">
              Créer mon profil
            </Link>
          </article>
          <article className="price-card price-card--featured">
            <div className="featured-badge">Populaire</div>
            <div className="price-tier">Premium</div>
            <div className="price-amount">2 500 FCFA</div>
            <p className="price-period">/ service · Mobile Money</p>
            <ul className="price-features">
              <li>Tout le gratuit</li>
              <li>Audit vidéo CV</li>
              <li>Accès prioritaire Top Mentors</li>
              <li>Simulation d’entretien</li>
            </ul>
            <Link className="btn btn--primary btn--block" to="/connexion">
              Débloquer Premium
            </Link>
          </article>
          <article className="price-card">
            <div className="price-tier">Entreprise</div>
            <div className="price-amount">Sur devis</div>
            <p className="price-period">Abonnement ou commission</p>
            <ul className="price-features">
              <li>Vivier de talents</li>
              <li>Sponsoring de parcours</li>
              <li>Profils pré-filtrés</li>
            </ul>
            <a className="btn btn--outline btn--block" href="mailto:contact@mentor.bj">
              Nous contacter
            </a>
          </article>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
