import MarketingFooter from "../components/MarketingFooter";
import MarketingNav from "../components/MarketingNav";

export default function MentionsLegalesPage() {
  return (
    <div className="landing">
      <MarketingNav />
      <section className="ld-section legal-page">
        <h1>Mentions légales</h1>
        <p>
          <strong>Éditeur :</strong> MentorBénin (projet MVP / démonstration).
        </p>
        <p>
          <strong>Siège :</strong> Cotonou, République du Bénin.
        </p>
        <p>
          <strong>Contact :</strong>{" "}
          <a href="mailto:contact@mentor.bj">contact@mentor.bj</a>
        </p>
        <p className="muted">
          Ce site est une démonstration produit. Les informations peuvent être
          mises à jour avant toute mise en production.
        </p>
      </section>
      <MarketingFooter />
    </div>
  );
}
