from __future__ import annotations

import hashlib
import os
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field


JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALG = "HS256"
JWT_EXP_HOURS = 8

security = HTTPBearer(auto_error=False)


class MenteeProfile(BaseModel):
    full_name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    sector: str = Field(min_length=2, max_length=80)
    goals: List[str] = Field(min_length=1, max_length=8)
    language: str = Field(min_length=2, max_length=30, default="fr")
    availability: str = Field(min_length=2, max_length=30)


class Mentor(BaseModel):
    id: int
    name: str
    role: str
    sector: str
    languages: List[str]
    availability: List[str]
    bio: str


class MatchResponse(BaseModel):
    mentor: Mentor
    score: int
    reasons: List[str]


class MessageInput(BaseModel):
    mentee_name: str = Field(min_length=2, max_length=80)
    mentor_id: int
    content: str = Field(min_length=1, max_length=800)


class MessageOutput(BaseModel):
    id: int
    mentee_name: str
    mentor_id: int
    content: str
    created_at: str


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=120)
    role: str = Field(default="mentee")


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=120)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str


class Parcours(BaseModel):
    id: int
    title: str
    description: str
    steps: List[str]


class ParcoursCreate(BaseModel):
    title: str = Field(min_length=4, max_length=120)
    description: str = Field(min_length=10, max_length=300)
    steps: List[str] = Field(min_length=2, max_length=10)


MENTORS: List[Mentor] = [
    Mentor(
        id=1,
        name="Amos Kpedenon",
        role="Product Manager",
        sector="tech",
        languages=["fr", "en"],
        availability=["soir", "weekend"],
        bio="Accompagnement produit et insertion dans les startups locales.",
    ),
    Mentor(
        id=2,
        name="Brice Mensah",
        role="Data Analyst",
        sector="data",
        languages=["fr", "en"],
        availability=["weekend"],
        bio="CV data, portfolio, entretien technique.",
    ),
    Mentor(
        id=3,
        name="Celine Sohouinle",
        role="HR Manager",
        sector="rh",
        languages=["fr"],
        availability=["semaine", "soir"],
        bio="Positionnement pro, CV, preparation aux entretiens.",
    ),
    Mentor(
        id=4,
        name="Fatima Alabi",
        role="Marketing Lead",
        sector="marketing",
        languages=["fr"],
        availability=["soir"],
        bio="Strategie marketing digital et personal branding.",
    ),
]

MESSAGES: List[MessageOutput] = []
PARCOURS: List[Parcours] = [
    Parcours(
        id=1,
        title="Preparer son CV",
        description="Construire un CV clair, adapte au marche local.",
        steps=["Diagnostic CV actuel", "Refonte", "Validation mentor"],
    ),
    Parcours(
        id=2,
        title="Reussir son entretien",
        description="Methode simple pour presenter son profil avec impact.",
        steps=["Pitch 60 secondes", "Questions frequentes", "Simulation"],
    ),
]

USERS: Dict[str, Dict[str, str]] = {}
USER_COUNTER = 0

app = FastAPI(title="Mentorat Intelligent API", version="0.2.0")

allowed_origin = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def _hash_password(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _create_user(full_name: str, email: str, role: str, password: str) -> None:
    global USER_COUNTER
    USER_COUNTER += 1
    USERS[email.lower()] = {
        "id": str(USER_COUNTER),
        "full_name": full_name,
        "email": email.lower(),
        "role": role,
        "password_hash": _hash_password(password),
    }


def _seed_users() -> None:
    if USERS:
        return
    _create_user("Admin Demo", "admin@mentor.bj", "admin", "AdminPass123")
    _create_user("Mentor Demo", "mentor@mentor.bj", "mentor", "MentorPass123")
    _create_user("Mentee Demo", "mentee@mentor.bj", "mentee", "MenteePass123")


@app.on_event("startup")
def startup_seed() -> None:
    _seed_users()


def _create_token(user: Dict[str, str]) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user["email"],
        "role": user["role"],
        "exp": now + timedelta(hours=JWT_EXP_HOURS),
        "iat": now,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def _score(profile: MenteeProfile, mentor: Mentor) -> MatchResponse:
    points = 0
    reasons: List[str] = []

    if profile.sector.lower() == mentor.sector.lower():
        points += 45
        reasons.append("Secteur aligne")

    if profile.language.lower() in [x.lower() for x in mentor.languages]:
        points += 25
        reasons.append("Langue compatible")

    if profile.availability.lower() in [x.lower() for x in mentor.availability]:
        points += 20
        reasons.append("Disponibilite compatible")

    if any(g.lower() in mentor.bio.lower() for g in profile.goals):
        points += 10
        reasons.append("Objectifs proches")

    return MatchResponse(
        mentor=mentor,
        score=min(points, 100),
        reasons=reasons or ["Compatibilite globale"],
    )


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, str]:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token") from None

    user = USERS.get(email.lower())
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def require_roles(*roles: str):
    def guard(user: Dict[str, str] = Depends(get_current_user)) -> Dict[str, str]:
        if user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
        return user

    return guard


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=TokenResponse)
def register(payload: UserCreate) -> TokenResponse:
    role = payload.role.lower()
    if role not in {"mentee", "mentor"}:
        raise HTTPException(status_code=400, detail="Role must be mentee or mentor")

    email = payload.email.lower()
    if email in USERS:
        raise HTTPException(status_code=409, detail="Email already exists")

    _create_user(payload.full_name, email, role, payload.password)
    token = _create_token(USERS[email])
    return TokenResponse(access_token=token)


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: UserLogin) -> TokenResponse:
    email = payload.email.lower()
    user = USERS.get(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user["password_hash"] != _hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=_create_token(user))


@app.get("/api/me", response_model=UserPublic)
def me(user: Dict[str, str] = Depends(get_current_user)) -> UserPublic:
    return UserPublic(
        id=int(user["id"]),
        full_name=user["full_name"],
        email=user["email"],
        role=user["role"],
    )


@app.get("/api/mentors", response_model=List[Mentor])
def list_mentors() -> List[Mentor]:
    return MENTORS


@app.post("/api/match", response_model=List[MatchResponse])
def match(profile: MenteeProfile) -> List[MatchResponse]:
    results = [_score(profile, mentor) for mentor in MENTORS]
    results.sort(key=lambda x: x.score, reverse=True)
    return results[:3]


@app.get("/api/messages", response_model=List[MessageOutput])
def list_messages(_user: Dict[str, str] = Depends(get_current_user)) -> List[MessageOutput]:
    return MESSAGES[-20:]


@app.post("/api/messages", response_model=MessageOutput)
def create_message(
    payload: MessageInput, _user: Dict[str, str] = Depends(require_roles("mentee", "mentor", "admin"))
) -> MessageOutput:
    mentor_exists = any(m.id == payload.mentor_id for m in MENTORS)
    if not mentor_exists:
        raise HTTPException(status_code=404, detail="Mentor not found")

    message = MessageOutput(
        id=len(MESSAGES) + 1,
        mentee_name=payload.mentee_name,
        mentor_id=payload.mentor_id,
        content=payload.content.strip(),
        created_at=datetime.utcnow().isoformat() + "Z",
    )
    MESSAGES.append(message)
    return message


@app.get("/api/parcours", response_model=List[Parcours])
def list_parcours() -> List[Parcours]:
    return PARCOURS


@app.post("/api/parcours", response_model=Parcours)
def create_parcours(
    payload: ParcoursCreate, _user: Dict[str, str] = Depends(require_roles("admin"))
) -> Parcours:
    item = Parcours(
        id=len(PARCOURS) + 1,
        title=payload.title.strip(),
        description=payload.description.strip(),
        steps=[x.strip() for x in payload.steps if x.strip()],
    )
    PARCOURS.append(item)
    return item


@app.get("/api/mentor/inbox", response_model=List[MessageOutput])
def mentor_inbox(_user: Dict[str, str] = Depends(require_roles("mentor", "admin"))) -> List[MessageOutput]:
    return MESSAGES[-20:]
