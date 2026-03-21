# MentorBénin — Pages & navigation

Cartographie du flux SPA (React Router). **Point d’entrée obligatoire** : la landing page.

---

## 1. Liste des pages

| # | Route | Page | Accès | Rôle |
|---|--------|------|--------|------|
| 1 | `/` | **Landing** (accueil marketing) | Public | — |
| 2 | `/tarifs` | Tarifs & offres | Public | — |
| 3 | `/confidentialite` | Politique de confidentialité | Public | — |
| 4 | `/mentions-legales` | Mentions légales | Public | — |
| 5 | `/faq` | FAQ (accordéon) | Public | — |
| 6 | `/mot-de-passe-oublie` | Mot de passe oublié (MVP / démo) | Public | — |
| 7 | `/connexion` | Connexion (JWT) | Public* | — |
| 8 | `/inscription` | Inscription mentee / mentor (`?role=mentor`) | Public* | — |
| 9 | `/app` | **Redirection intelligente** selon rôle | Auth | tous |
| 10 | `/app/mentee` | Tableau de bord mentee | Auth | mentee, admin |
| 11 | `/app/matching` | Matching (top 3 mentors) | Auth | mentee, admin |
| 12 | `/app/messages` | Messagerie 1-to-1 | Auth | mentee, mentor, admin |
| 13 | `/app/parcours` | Parcours guidés | Auth | mentee, mentor, admin |
| 14 | `/app/mentor` | Inbox mentor | Auth | mentor, admin |
| 15 | `/app/admin/parcours` | Création de parcours (back-office) | Auth | admin |
| 16 | `/dashboard` | Alias → `/app` | Auth | — |
| 17 | `*` | 404 | Public | — |

\* **GuestOnlyRoute** : si déjà connecté → redirection vers `/app`.

---

## 2. Logique de navigation (flux utilisateur)

### Parcours visiteur (non connecté)

1. **Arrivée** → `GET /` **Landing** (obligatoire comme vitrine produit).
2. CTA « Commencer » / « Inscription » → `/inscription`.
3. « Connexion » (nav ou CTA) → `/connexion`.
4. Tarifs → `/tarifs`.
5. FAQ → `/faq`.
6. Liens pied de page → `/confidentialite`, `/mentions-legales`.
7. **Devenir mentor** (landing) → `/inscription?role=mentor`.

### Après connexion

1. `POST /api/auth/login` → token stocké (`localStorage`).
2. Redirection vers `/app` (ou `?next=` si présent sur `/connexion`).
3. **`/app`** exécute une **redirection par rôle** :
   - **admin** → `/app/admin/parcours`
   - **mentor** → `/app/mentor`
   - **mentee** → `/app/mentee`

### Mentee (parcours métier MVP)

1. `/app/mentee` — vue d’ensemble + liens rapides.
2. `/app/matching` — saisie profil + résultats top 3.
3. `/app/messages` — envoi message (JWT requis) + historique.
4. `/app/parcours` — liste des parcours (API publique en lecture).

### Mentor

1. `/app/mentor` — inbox (messages récents).
2. `/app/messages` — peut aussi échanger (selon règles API).

### Admin

1. `/app/admin/parcours` — création de parcours (`POST` protégé).
2. Accès aux routes **mentee** et **mentor** pour démo.

---

## 3. Garde-fous (routing)

- **`ProtectedRoute`** (`/app/*`) : sans token valide → `/connexion?next=…`.
- **`RoleRoute`** : rôle non autorisé → `/app` (redirection sûre).
- **`GuestOnlyRoute`** : `/connexion` et `/inscription` inaccessibles si session active.

---

## 4. API en développement (proxy)

- `vite.config.js` proxy `/api` et `/health` → backend (par défaut `http://127.0.0.1:8000`).
- Docker : variable `VITE_PROXY_API=http://backend:8000` (voir `docker-compose.yml`).
- `src/config.js` : en dev, `API_BASE` vide = appels relatifs `/api/...` (évite CORS).

---

## 5. Fichiers clés

- `src/App.jsx` — définition des routes + `ScrollToTop`.
- `src/components/AppShell.jsx` — layout + menu latéral (liens selon rôle) + titre de page.
- `src/pages/LandingPage.jsx` — landing professionnelle.
- `src/context/AuthContext.jsx` — session JWT.
- `vite.config.js` — proxy API.
