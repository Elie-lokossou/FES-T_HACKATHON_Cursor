import MarketingFooter from "../components/MarketingFooter";
import MarketingNav from "../components/MarketingNav";

export default function ConfidentialitePage() {
  return (
    <div className="landing">
      <MarketingNav />
      <section className="ld-section legal-page">
        <h1>Politique de confidentialité</h1>
        <p className="muted">
          Cadre MVP — alignement avec les exigences APDP (Bénin). Données
          personnelles : email, téléphone, objectifs professionnels, messages.
          Conservation chiffrée côté infrastructure en production. Droit à
          l’effacement sous 72 h sur demande.
        </p>
        <h2>Finalités</h2>
        <p>
          Fourniture du service de mentorat, matching, messagerie et suivi de
          parcours. Aucune revente de données sans consentement explicite.
        </p>
        <h2>Contact DPO</h2>
        <p>
          <a href="mailto:privacy@mentor.bj">privacy@mentor.bj</a>
        </p>
      </section>
      <MarketingFooter />
    </div>
  );
}
