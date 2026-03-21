from __future__ import annotations

import hashlib
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal, get_db, init_db
from app.models import MessageModel, MentorModel, ParcoursModel, User
from app.seed import seed_if_empty

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


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Mentorat Intelligent API", version="0.3.0", lifespan=lifespan)

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


def _mentor_to_schema(m: MentorModel) -> Mentor:
    return Mentor(
        id=m.id,
        name=m.name,
        role=m.job_title,
        sector=m.sector,
        languages=list(m.languages or []),
        availability=list(m.availability or []),
        bio=m.bio,
    )


def _create_token(user: User) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user.email,
        "role": user.role,
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
    db: Session = Depends(get_db),
) -> User:
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

    user = db.execute(select(User).where(User.email == email.lower())).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def require_roles(*roles: str):
    def guard(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
        return user

    return guard


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "database": "connected"}


@app.post("/api/auth/register", response_model=TokenResponse)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> TokenResponse:
    role = payload.role.lower()
    if role not in {"mentee", "mentor"}:
        raise HTTPException(status_code=400, detail="Role must be mentee or mentor")

    email = payload.email.lower()
    exists = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if exists:
        raise HTTPException(status_code=409, detail="Email already exists")

    user = User(
        email=email,
        full_name=payload.full_name,
        password_hash=_hash_password(payload.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=_create_token(user))


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    email = payload.email.lower()
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.password_hash != _hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=_create_token(user))


@app.get("/api/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)) -> UserPublic:
    return UserPublic(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
    )


@app.get("/api/mentors", response_model=List[Mentor])
def list_mentors(db: Session = Depends(get_db)) -> List[Mentor]:
    rows = db.execute(select(MentorModel).order_by(MentorModel.id)).scalars().all()
    return [_mentor_to_schema(m) for m in rows]


@app.post("/api/match", response_model=List[MatchResponse])
def match(profile: MenteeProfile, db: Session = Depends(get_db)) -> List[MatchResponse]:
    rows = db.execute(select(MentorModel).order_by(MentorModel.id)).scalars().all()
    mentors = [_mentor_to_schema(m) for m in rows]
    results = [_score(profile, mentor) for mentor in mentors]
    results.sort(key=lambda x: x.score, reverse=True)
    return results[:3]


def _fetch_messages(db: Session) -> List[MessageOutput]:
    rows = (
        db.execute(
            select(MessageModel).order_by(MessageModel.created_at.desc()).limit(20)
        )
        .scalars()
        .all()
    )
    rows = list(reversed(rows))
    out: List[MessageOutput] = []
    for m in rows:
        out.append(
            MessageOutput(
                id=m.id,
                mentee_name=m.mentee_name,
                mentor_id=m.mentor_id,
                content=m.content,
                created_at=m.created_at.isoformat() if m.created_at else "",
            )
        )
    return out


@app.get("/api/messages", response_model=List[MessageOutput])
def list_messages(
    _user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> List[MessageOutput]:
    return _fetch_messages(db)


@app.post("/api/messages", response_model=MessageOutput)
def create_message(
    payload: MessageInput,
    _user: User = Depends(require_roles("mentee", "mentor", "admin")),
    db: Session = Depends(get_db),
) -> MessageOutput:
    mentor = db.get(MentorModel, payload.mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    msg = MessageModel(
        mentee_name=payload.mentee_name.strip(),
        mentor_id=payload.mentor_id,
        content=payload.content.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return MessageOutput(
        id=msg.id,
        mentee_name=msg.mentee_name,
        mentor_id=msg.mentor_id,
        content=msg.content,
        created_at=msg.created_at.isoformat() if msg.created_at else "",
    )


@app.get("/api/parcours", response_model=List[Parcours])
def list_parcours(db: Session = Depends(get_db)) -> List[Parcours]:
    rows = db.execute(select(ParcoursModel).order_by(ParcoursModel.id)).scalars().all()
    return [
        Parcours(
            id=r.id,
            title=r.title,
            description=r.description,
            steps=list(r.steps or []),
        )
        for r in rows
    ]


@app.post("/api/parcours", response_model=Parcours)
def create_parcours(
    payload: ParcoursCreate,
    _user: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
) -> Parcours:
    steps = [x.strip() for x in payload.steps if x.strip()]
    item = ParcoursModel(
        title=payload.title.strip(),
        description=payload.description.strip(),
        steps=steps,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return Parcours(
        id=item.id,
        title=item.title,
        description=item.description,
        steps=list(item.steps or []),
    )


@app.get("/api/mentor/inbox", response_model=List[MessageOutput])
def mentor_inbox(
    _user: User = Depends(require_roles("mentor", "admin")),
    db: Session = Depends(get_db),
) -> List[MessageOutput]:
    return _fetch_messages(db)
