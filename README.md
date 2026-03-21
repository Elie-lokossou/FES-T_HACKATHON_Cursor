# Mentorat Intelligent - Starter App

Base applicative rapide (non HTML statique) inspiree de `mentorat-platform.html`.

## Contenu

- `backend/` : API FastAPI (auth JWT, roles, matching, mentors, messages, parcours)
- `frontend/` : App React + Vite + React Router — **landing professionnelle**, auth JWT, espaces par rôle (voir `frontend/NAVIGATION.md`)
- `docker-compose.yml` : lancement rapide fullstack

## Lancer le backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API dispo sur: `http://localhost:8000`

## Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dispo sur: `http://localhost:5173`

## Endpoints utiles

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me` (token requis)
- `GET /api/mentors`
- `POST /api/match`
- `GET /api/messages` (token requis)
- `POST /api/messages` (token requis)
- `GET /api/parcours`
- `POST /api/parcours` (admin)
- `GET /api/mentor/inbox` (mentor/admin)

## Exemple payload matching

```json
{
  "full_name": "Awa K.",
  "email": "awa@example.com",
  "sector": "marketing",
  "goals": ["stage", "cv"],
  "language": "fr",
  "availability": "soir"
}
```

## Comptes de demo (seed)

- `admin@mentor.bj` / `AdminPass123`
- `mentor@mentor.bj` / `MentorPass123`
- `mentee@mentor.bj` / `MenteePass123`

## Tests rapides backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install pytest
pytest -q
```

## Lancement fullstack avec Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
