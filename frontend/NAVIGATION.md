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
| 5 | `/connexion` | Connexion (JWT) | Public | — |
| 6 | `/inscription` | Inscription mentee / mentor | Public | — |
| 7 | `/app` | **Redirection intelligente** selon rôle | Auth | tous |
| 8 | `/app/mentee` | Tableau de bord mentee | Auth | mentee, admin |
| 9 | `/app/matching` | Matching (top 3 mentors) | Auth | mentee, admin |
| 10 | `/app/messages` | Messagerie 1-to-1 | Auth | mentee, mentor, admin |
| 11 | `/app/parcours` | Parcours guidés | Auth | mentee, mentor, admin |
| 12 | `/app/mentor` | Inbox mentor | Auth | mentor, admin |
| 13 | `/app/admin/parcours` | Création de parcours (back-office) | Auth | admin |
| 14 | `/dashboard` | Alias → `/app` | Auth | — |
| 15 | `*` | 404 | Public | — |

---

## 2. Logique de navigation (flux utilisateur)

### Parcours visiteur (non connecté)

1. **Arrivée** → `GET /` **Landing** (obligatoire comme vitrine produit).
2. CTA « Commencer » / « Inscription » → `/inscription`.
3. « Connexion » (nav ou CTA) → `/connexion`.
4. Tarifs → `/tarifs`.
5. Liens pied de page → `/confidentialite`, `/mentions-legales`.

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

---

## 4. Fichiers clés

- `src/App.jsx` — définition des routes.
- `src/components/AppShell.jsx` — layout + menu latéral (liens selon rôle).
- `src/pages/LandingPage.jsx` — landing professionnelle.
- `src/context/AuthContext.jsx` — session JWT.
