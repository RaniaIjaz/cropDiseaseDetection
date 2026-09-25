"""Auth flow: registration, login, and the two failure modes that matter."""


def register(client, email, user_name="Test Farmer", password="correct-horse-1"):
    return client.post(
        "/auth/register",
        json={"userName": user_name, "email": email, "password": password},
    )


def test_register_returns_token_and_profile(client, unique_email):
    res = register(client, unique_email)

    assert res.status_code == 200, res.text
    body = res.json()
    assert body["email"] == unique_email
    assert body["userName"] == "Test Farmer"
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["id"]
    # The password must never come back out of the API.
    assert "password" not in body


def test_register_rejects_duplicate_email(client, unique_email):
    assert register(client, unique_email).status_code == 200

    second = register(client, unique_email, user_name="Someone Else")

    assert second.status_code == 400
    assert "already registered" in second.json()["detail"].lower()


def test_login_with_correct_password_returns_token(client, unique_email):
    register(client, unique_email, password="correct-horse-1")

    res = client.post(
        "/auth/login",
        json={"email": unique_email, "password": "correct-horse-1"},
    )

    assert res.status_code == 200, res.text
    assert res.json()["access_token"]


def test_login_with_wrong_password_is_rejected(client, unique_email):
    register(client, unique_email, password="correct-horse-1")

    res = client.post(
        "/auth/login",
        json={"email": unique_email, "password": "definitely-wrong"},
    )

    assert res.status_code == 401
    # No token should leak on a failed login.
    assert "access_token" not in res.json()


def test_login_for_unknown_email_is_rejected(client):
    res = client.post(
        "/auth/login",
        json={"email": "nobody@example.com", "password": "whatever-123"},
    )

    assert res.status_code == 401


def test_register_rejects_malformed_email(client):
    res = client.post(
        "/auth/register",
        json={"userName": "X", "email": "not-an-email", "password": "pw12345678"},
    )

    # Pydantic's EmailStr rejects this before the handler runs.
    assert res.status_code == 422


def test_me_returns_the_registered_user(client, unique_email):
    token = register(client, unique_email).json()["access_token"]

    res = client.get("/auth/me", params={"token": token})

    assert res.status_code == 200, res.text
    assert res.json()["email"] == unique_email


def test_me_rejects_a_bogus_token(client):
    res = client.get("/auth/me", params={"token": "not-a-real-token"})

    assert res.status_code == 401
