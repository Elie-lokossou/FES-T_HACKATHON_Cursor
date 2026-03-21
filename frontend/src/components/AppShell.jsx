import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navForRole(role) {
  const base = [
    { to: "/app", end: true, label: "Accueil", icon: "⌂" }
  ];
  if (role === "mentee" || role === "admin") {
    base.push(
      { to: "/app/mentee", label: "Espace mentee", icon: "◉" },
      { to: "/app/matching", label: "Matching", icon: "◎" },
      { to: "/app/messages", label: "Messages", icon: "✉" },
      { to: "/app/parcours", label: "Parcours", icon: "≡" }
    );
  }
  if (role === "mentor" || role === "admin") {
    base.push({ to: "/app/mentor", label: "Inbox mentor", icon: "☰" });
  }
  if (role === "admin") {
    base.push({ to: "/app/admin/parcours", label: "Admin parcours", icon: "⚙" });
  }
  return base;
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navForRole(user?.role ?? "mentee");

  return (
    <div className="app-shell">
      <aside className="app-shell__aside">
        <div className="app-shell__brand">
          <span className="app-shell__logo">MB</span>
          <div>
            <strong>MentorBénin</strong>
            <span className="app-shell__role">{user?.role}</span>
          </div>
        </div>
        <nav className="app-shell__nav">
          {items.map((item) => (
            <NavLink
              key={item.to + (item.end ? "-e" : "")}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                "app-shell__link" + (isActive ? " app-shell__link--active" : "")
              }
            >
              <span className="app-shell__ico">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-shell__footer">
          <p className="app-shell__user">{user?.full_name}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>
      <div className="app-shell__main">
        <header className="app-shell__topbar">
          <h1 className="app-shell__title">Espace connecté</h1>
        </header>
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
