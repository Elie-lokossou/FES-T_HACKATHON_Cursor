from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_auth_and_me():
    login = client.post(
        "/api/auth/login",
        json={"email": "mentee@mentor.bj", "password": "MenteePass123"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["role"] in {"mentee", "mentor", "admin"}


def test_match_top_three():
    payload = {
        "full_name": "Awa Demo",
        "email": "awa@example.com",
        "sector": "marketing",
        "goals": ["cv", "stage"],
        "language": "fr",
        "availability": "soir",
    }
    response = client.post("/api/match", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 3
    assert body[0]["score"] >= body[1]["score"]
