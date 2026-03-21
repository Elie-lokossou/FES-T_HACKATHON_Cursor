import { useState } from "react";
import { Link } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";
import MarketingNav from "../components/MarketingNav";

export default function LandingPage() {
  const [tab, setTab] = useState("mentee");

  return (
    <div className="landing">
      <MarketingNav />

      <section className="ld-hero">
        <div className="ld-hero__blob ld-hero__blob--1" aria-hidden />
        <div className="ld-hero__blob ld-hero__blob--2" aria-hidden />
        <div className="ld-hero__inner">
          <p className="ld-badge">Bénin · Afrique de l’Ouest · 2025</p>
          <h1>
            Trouve ton mentor,
            <br />
            <em>construis ton avenir.</em>
          </h1>
          <p className="ld-hero__sub">
            La plateforme qui connecte chaque jeune béninois à un professionnel
            expérimenté — matching intelligent, parcours guidés, accessible depuis
            ton téléphone.
          </p>
          <div className="ld-hero__ctas">
            <Link className="btn btn--primary btn--lg" to="/inscription">
              Commencer gratuitement
            </Link>
            <a className="btn btn--outline btn--lg" href="#comment">
              Voir comment ça marche
            </a>
          </div>
          <div className="ld-stats">
            <div>
              <span className="ld-stats__num">120K</span>
              <span className="ld-stats__lbl">Jeunes diplômés / an</span>
            </div>
            <div className="ld-stats__rule" />
            <div>
              <span className="ld-stats__num">70%</span>
              <span className="ld-stats__lbl">Sans accès à un mentor</span>
            </div>
            <div className="ld-stats__rule" />
            <div>
              <span className="ld-stats__num">&lt;10 min</span>
              <span className="ld-stats__lbl">Pour démarrer</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ld-section ld-problem" id="probleme">
        <p className="ld-kicker">Le problème</p>
        <h2>
          Plus de <em>70 % des diplômés</em>
          <br />
          n’ont pas de réseau professionnel fiable.
        </h2>
        <p className="ld-lead">
          Les solutions actuelles ne couvrent qu’une fraction des jeunes et
          n’offrent pas de suivi mesurable.
        </p>
        <div className="ld-problem__grid">
          <div className="ld-cards">
            <article className="ld-pcard">
              <div className="ld-pcard__num">70%</div>
              <p>
                des jeunes déclarent n’avoir aucun accès à un professionnel dans
                leur domaine.
              </p>
            </article>
            <article className="ld-pcard">
              <div className="ld-pcard__num">+25%</div>
              <p>
                chômage des diplômés — alors que des milliers de PME cherchent des
                talents proactifs.
              </p>
            </article>
            <article className="ld-pcard">
              <div className="ld-pcard__num">5%</div>
              <p>
                seulement touchés par les programmes existants, sans suivi
                numérique durable.
              </p>
            </article>
          </div>
          <div className="ld-visual">
            <h3>Solutions actuelles — limites</h3>
            <ul>
              <li>
                <strong>LinkedIn</strong>
                <span>Réseau global, peu d’ancrage local</span>
              </li>
              <li>
                <strong>ONG / public</strong>
                <span>Ponctuel, faible couverture</span>
              </li>
              <li>
                <strong>Réseaux informels</strong>
                <span>Opaques, peu inclusifs</span>
              </li>
            </ul>
            <div className="ld-visual__note">
              <strong>MentorBénin</strong> — matching · suivi · mobile-first
            </div>
          </div>
        </div>
      </section>

      <section className="ld-section" id="comment">
        <p className="ld-kicker">Comment ça marche</p>
        <h2>
          Un mentor pertinent en
          <br />
          <em>moins de 10 minutes.</em>
        </h2>
        <div className="ld-steps">
          <div className="ld-step">
            <div className="ld-step__num">01</div>
            <h3>Crée ton profil</h3>
            <p>
              Domaine, compétences, objectifs — sauvegarde automatique à chaque
              étape.
            </p>
          </div>
          <div className="ld-step">
            <div className="ld-step__num">02</div>
            <h3>Reçois 3 suggestions</h3>
            <p>
              Score de compatibilité (secteur, langue, disponibilité) — résultat en
              moins de 2 secondes.
            </p>
          </div>
          <div className="ld-step">
            <div className="ld-step__num">03</div>
            <h3>Lance ton parcours</h3>
            <p>
              CV, entretien, réseau — étapes validées avec ton mentor.
            </p>
          </div>
        </div>
      </section>

      <section className="ld-section ld-features" id="fonctionnalites">
        <div className="ld-features__head">
          <div>
            <p className="ld-kicker">Fonctionnalités</p>
            <h2>
              Tout ce dont tu as besoin
              <br />
              <em>pour réussir.</em>
            </h2>
          </div>
          <p className="ld-lead">
            Pensé pour le mobile et les connexions variables — avec paiement Mobile
            Money à la carte.
          </p>
        </div>
        <div className="ld-feat-grid">
          <article className="ld-feat ld-feat--hero">
            <span className="ld-feat__ico">⚡</span>
            <h3>Matching intelligent</h3>
            <p>
              Top 3 mentors classés par score. Si le score est faible, élargissement
              des critères et file d’attente avec notification.
            </p>
          </article>
          <article className="ld-feat">
            <span className="ld-feat__ico">📋</span>
            <h3>Parcours guidés</h3>
            <p>Étapes mesurables avec validation mentor à chaque jalon.</p>
          </article>
          <article className="ld-feat">
            <span className="ld-feat__ico">💬</span>
            <h3>Messagerie 1-to-1</h3>
            <p>Historique persistant, notifications si hors ligne.</p>
          </article>
          <article className="ld-feat">
            <span className="ld-feat__ico">📊</span>
            <h3>Dashboard mentor</h3>
            <p>Suivi de progression pour préparer vos échanges.</p>
          </article>
          <article className="ld-feat">
            <span className="ld-feat__ico">🏢</span>
            <h3>Vivier talents</h3>
            <p>PME : accès aux profils ayant complété un parcours.</p>
          </article>
          <article className="ld-feat">
            <span className="ld-feat__ico">📱</span>
            <h3>Mobile Money</h3>
            <p>MTN MoMo, Moov, CinetPay — sans carte bancaire.</p>
          </article>
        </div>
      </section>

      <section className="ld-section ld-personas">
        <p className="ld-kicker">Pour qui ?</p>
        <h2>
          Une plateforme pensée
          <br />
          pour <em>chaque profil.</em>
        </h2>
        <div className="ld-tabs">
          {["mentee", "mentor", "entreprise"].map((id) => (
            <button
              key={id}
              type="button"
              className={"ld-tab" + (tab === id ? " ld-tab--on" : "")}
              onClick={() => setTab(id)}
            >
              {id === "mentee" && "Mentees"}
              {id === "mentor" && "Mentors"}
              {id === "entreprise" && "Entreprises"}
            </button>
          ))}
        </div>
        {tab === "mentee" && (
          <div className="ld-persona-grid">
            <div>
              <h3>Jeune diplômé, construis ton réseau.</h3>
              <p>
                Profil multi-étapes, 3 mentors suggérés, parcours et messagerie
                directe — gratuit pour l’essentiel.
              </p>
            </div>
            <div className="ld-persona-card">
              <h4>Tes 3 mentors suggérés</h4>
              <p className="muted">Exemple — Finance & comptabilité</p>
              <ul>
                <li>
                  <span>Amos Kpèdènon</span>
                  <em>94 %</em>
                </li>
                <li>
                  <span>Brice Mensah</span>
                  <em>87 %</em>
                </li>
                <li>
                  <span>Céline Sohouinlé</span>
                  <em>81 %</em>
                </li>
              </ul>
            </div>
          </div>
        )}
        {tab === "mentor" && (
          <p className="ld-persona-text">
            <strong>Mentors :</strong> acceptez les demandes, suivez la progression,
            gardez le contrôle sur votre disponibilité.
          </p>
        )}
        {tab === "entreprise" && (
          <p className="ld-persona-text">
            <strong>PME :</strong> accédez à un vivier de talents pré-filtrés —
            abonnement ou commission à l’embauche.
          </p>
        )}
      </section>

      <section className="ld-kpis">
        <div className="ld-kpis__inner">
          <div>
            <span className="ld-kpis__num">&gt;60%</span>
            <span className="ld-kpis__lbl">Matching réussi à J+7</span>
          </div>
          <div>
            <span className="ld-kpis__num">&gt;40%</span>
            <span className="ld-kpis__lbl">Complétion des parcours</span>
          </div>
          <div>
            <span className="ld-kpis__num">&gt;70%</span>
            <span className="ld-kpis__lbl">Rétention mentors M+1</span>
          </div>
          <div>
            <span className="ld-kpis__num">&gt;30%</span>
            <span className="ld-kpis__lbl">Emploi / stage à M+6</span>
          </div>
        </div>
      </section>

      <section className="ld-cta">
        <div className="ld-cta__box">
          <h2>
            Prêt à démarrer ton
            <br />
            <em>parcours professionnel ?</em>
          </h2>
          <p>
            Rejoins MentorBénin — gratuit pour le matching et les parcours standards,
            depuis ton mobile.
          </p>
          <div className="ld-cta__btns">
            <Link className="btn btn--primary" to="/inscription">
              Créer mon profil
            </Link>
            <Link className="btn btn--outline" to="/connexion">
              J’ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
