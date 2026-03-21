"""Données initiales (idempotent)."""
from __future__ import annotations

import hashlib

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import MentorModel, ParcoursModel, User


def _hash_password(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def seed_if_empty(db: Session) -> None:
    n_users = db.scalar(select(func.count()).select_from(User)) or 0
    if n_users == 0:
        for full_name, email, role, pwd in [
            ("Admin Demo", "admin@mentor.bj", "admin", "AdminPass123"),
            ("Mentor Demo", "mentor@mentor.bj", "mentor", "MentorPass123"),
            ("Mentee Demo", "mentee@mentor.bj", "mentee", "MenteePass123"),
        ]:
            db.add(
                User(
                    email=email.lower(),
                    full_name=full_name,
                    password_hash=_hash_password(pwd),
                    role=role,
                )
            )
        db.commit()

    n_mentors = db.scalar(select(func.count()).select_from(MentorModel)) or 0
    if n_mentors == 0:
        rows = [
            MentorModel(
                name="Amos Kpedenon",
                job_title="Product Manager",
                sector="tech",
                languages=["fr", "en"],
                availability=["soir", "weekend"],
                bio="Accompagnement produit et insertion dans les startups locales.",
            ),
            MentorModel(
                name="Brice Mensah",
                job_title="Data Analyst",
                sector="data",
                languages=["fr", "en"],
                availability=["weekend"],
                bio="CV data, portfolio, entretien technique.",
            ),
            MentorModel(
                name="Celine Sohouinle",
                job_title="HR Manager",
                sector="rh",
                languages=["fr"],
                availability=["semaine", "soir"],
                bio="Positionnement pro, CV, preparation aux entretiens.",
            ),
            MentorModel(
                name="Fatima Alabi",
                job_title="Marketing Lead",
                sector="marketing",
                languages=["fr"],
                availability=["soir"],
                bio="Strategie marketing digital et personal branding.",
            ),
        ]
        for r in rows:
            db.add(r)
        db.commit()

    n_parcours = db.scalar(select(func.count()).select_from(ParcoursModel)) or 0
    if n_parcours == 0:
        db.add(
            ParcoursModel(
                title="Preparer son CV",
                description="Construire un CV clair, adapte au marche local.",
                steps=["Diagnostic CV actuel", "Refonte", "Validation mentor"],
            )
        )
        db.add(
            ParcoursModel(
                title="Reussir son entretien",
                description="Methode simple pour presenter son profil avec impact.",
                steps=["Pitch 60 secondes", "Questions frequentes", "Simulation"],
            )
        )
        db.commit()
