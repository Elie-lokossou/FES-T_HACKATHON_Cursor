import { Link, NavLink } from "react-router-dom";

export default function MarketingNav() {
  return (
    <nav className="mk-nav">
      <Link className="mk-logo" to="/">
        <span className="mk-logo__mark" aria-hidden>
          MB
        </span>
        MentorBénin
      </Link>
      <ul className="mk-nav__links">
        <li>
          <a href="/#comment">Comment ça marche</a>
        </li>
        <li>
          <a href="/#fonctionnalites">Fonctionnalités</a>
        </li>
        <li>
          <NavLink to="/tarifs">Tarifs</NavLink>
        </li>
        <li>
          <Link to="/connexion" className="mk-nav__cta">
            Connexion
          </Link>
        </li>
      </ul>
    </nav>
  );
}
