import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={"mk-nav" + (open ? " mk-nav--open" : "")}>
      <Link className="mk-logo" to="/" onClick={() => setOpen(false)}>
        <span className="mk-logo__mark" aria-hidden>
          MB
        </span>
        MentorBénin
      </Link>

      <button
        type="button"
        className="mk-nav__toggle"
        aria-expanded={open}
        aria-controls="mk-nav-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="mk-nav__burger" aria-hidden />
        <span className="sr-only">Menu</span>
      </button>

      <ul id="mk-nav-menu" className={"mk-nav__links" + (open ? " mk-nav__links--open" : "")}>
        <li>
          <a href="/#comment" onClick={() => setOpen(false)}>
            Comment ça marche
          </a>
        </li>
        <li>
          <a href="/#fonctionnalites" onClick={() => setOpen(false)}>
            Fonctionnalités
          </a>
        </li>
        <li>
          <Link to="/faq" onClick={() => setOpen(false)}>
            FAQ
          </Link>
        </li>
        <li>
          <NavLink to="/tarifs" onClick={() => setOpen(false)}>
            Tarifs
          </NavLink>
        </li>
        <li>
          <Link to="/connexion" className="mk-nav__cta" onClick={() => setOpen(false)}>
            Connexion
          </Link>
        </li>
      </ul>
    </nav>
  );
}
