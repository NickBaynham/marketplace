from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

VALID_PAYLOAD = {"name": "Ada", "email": "ada@example.com", "message": "Hello."}


def test_contact_accepts_valid_payload() -> None:
    response = client.post("/contact", json=VALID_PAYLOAD)
    assert response.status_code == 202
    assert response.json() == {"status": "accepted"}


def test_contact_rejects_missing_fields() -> None:
    response = client.post("/contact", json={"name": "Ada"})
    assert response.status_code == 422


def test_contact_rejects_filled_honeypot() -> None:
    payload = {**VALID_PAYLOAD, "website": "http://spam.example"}
    response = client.post("/contact", json=payload)
    assert response.status_code == 422
