import { Link } from "react-router-dom";

export default function MarketingFooter() {
  return (
    <footer className="mk-footer">
      <div className="mk-footer__grid">
        <div>
          <Link className="mk-footer__brand" to="/">
            MentorBénin
          </Link>
          <p className="mk-footer__desc">
            La plateforme de mentorat intelligent qui connecte chaque jeune béninois
            à un professionnel expérimenté.
          </p>
        </div>
        <div>
          <h4>Plateforme</h4>
          <Link to="/inscription">S’inscrire</Link>
          <Link to="/connexion">Connexion</Link>
          <a href="/#fonctionnalites">Fonctionnalités</a>
        </div>
        <div>
          <h4>Ressources</h4>
          <a href="/#comment">Comment ça marche</a>
          <Link to="/faq">FAQ</Link>
          <Link to="/tarifs">Tarifs</Link>
        </div>
        <div>
          <h4>Légal</h4>
          <Link to="/confidentialite">Confidentialité</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
        </div>
      </div>
      <div className="mk-footer__bottom">
        <span>© {new Date().getFullYear()} MentorBénin · Cotonou, Bénin</span>
        <span>Conforme APDP · Données protégées</span>
      </div>
    </footer>
  );
}
