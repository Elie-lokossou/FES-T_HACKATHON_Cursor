import { Link } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";
import MarketingNav from "../components/MarketingNav";

const FAQ = [
  {
    q: "MentorBénin est-il gratuit ?",
    a: "Oui : création de profil, suggestions de mentors et parcours standards sont gratuits. Des options premium (audit CV, accès prioritaire) sont payantes via Mobile Money."
  },
  {
    q: "En combien de temps puis-je trouver un mentor ?",
    a: "Le matching affiche 3 profils en quelques secondes. Tu peux envoyer un message dès que tu es connecté."
  },
  {
    q: "Comment les mentors sont-ils sélectionnés ?",
    a: "Un score calcule la compatibilité (secteur, objectifs, langue, disponibilité). Les 3 meilleurs profils sont proposés."
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: "Le traitement est conçu pour respecter le cadre APDP (Bénin). Consulte notre page confidentialité pour le détail."
  },
  {
    q: "Je suis une entreprise : comment accéder aux talents ?",
    a: "Contacte-nous pour un abonnement ou une commission à l’embauche — voir l’offre Entreprise sur la page Tarifs."
  }
];

export default function FaqPage() {
  return (
    <div className="landing">
      <MarketingNav />
      <section className="ld-section faq-page" style={{ paddingTop: "120px" }}>
        <p className="ld-kicker">FAQ</p>
        <h1>Questions fréquentes</h1>
        <p className="ld-lead" style={{ marginBottom: "2.5rem" }}>
          Réponses rapides avant de créer ton compte.{" "}
          <Link to="/inscription">S’inscrire</Link> ·{" "}
          <Link to="/connexion">Connexion</Link>
        </p>
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
