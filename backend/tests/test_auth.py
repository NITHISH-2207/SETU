from datetime import datetime, timezone, timedelta
import jwt
import uuid

from app.core.config import settings
from app.models.otp import OTP


def test_citizen_signup_and_request_otp(client):
    mobile = f"98{uuid.uuid4().int % 100000000:08d}"
    signup_res = client.post(
        "/api/v1/citizen/auth/signup",
        json={
            "full_name": "Radhika Sharma",
            "mobile_number": mobile,
            "email": f"radhika_{uuid.uuid4().hex[:6]}@example.com",
        },
    )
    assert signup_res.status_code == 201
    data = signup_res.json()
    assert "OTP sent" in data["message"]
    assert data["development_otp"] is not None
    otp_code = data["development_otp"]

    # Verify correct OTP
    verify_res = client.post(
        "/api/v1/citizen/auth/verify-otp",
        json={"mobile_number": mobile, "otp": otp_code},
    )
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert "access_token" in v_data
    assert v_data["user_id"] > 0
    assert v_data["citizen_id"] > 0


def test_verify_incorrect_otp(client, create_test_citizen):
    citizen_ctx = create_test_citizen()
    mobile = citizen_ctx["citizen"].mobile_number

    # Request new OTP
    req_res = client.post("/api/v1/citizen/auth/request-otp", json={"mobile_number": mobile})
    assert req_res.status_code == 200

    # Wrong OTP
    bad_res = client.post(
        "/api/v1/citizen/auth/verify-otp",
        json={"mobile_number": mobile, "otp": "000000"},
    )
    assert bad_res.status_code == 400
    assert "Invalid OTP" in bad_res.json()["detail"]


def test_reject_expired_otp(client, create_test_citizen, db):
    citizen_ctx = create_test_citizen()
    mobile = citizen_ctx["citizen"].mobile_number

    # Request OTP
    req_res = client.post("/api/v1/citizen/auth/request-otp", json={"mobile_number": mobile})
    assert req_res.status_code == 200
    otp = req_res.json()["development_otp"]

    # Expire in DB
    otp_record = (
        db.query(OTP)
        .filter(OTP.identifier == mobile, OTP.verified_at.is_(None))
        .order_by(OTP.created_at.desc())
        .first()
    )
    otp_record.expires_at = datetime.now(timezone.utc) - timedelta(minutes=10)
    db.commit()

    # Try verifying expired OTP
    exp_res = client.post(
        "/api/v1/citizen/auth/verify-otp",
        json={"mobile_number": mobile, "otp": otp},
    )
    assert exp_res.status_code == 400
    assert "expired" in exp_res.json()["detail"].lower()


def test_reject_too_many_otp_attempts(client, create_test_citizen, db):
    citizen_ctx = create_test_citizen()
    mobile = citizen_ctx["citizen"].mobile_number

    client.post("/api/v1/citizen/auth/request-otp", json={"mobile_number": mobile})

    # Fail 5 times
    for _ in range(5):
        client.post(
            "/api/v1/citizen/auth/verify-otp",
            json={"mobile_number": mobile, "otp": "999999"},
        )

    # 6th attempt should hit max attempts exceeded
    res = client.post(
        "/api/v1/citizen/auth/verify-otp",
        json={"mobile_number": mobile, "otp": "999999"},
    )
    assert res.status_code == 400
    assert "Maximum OTP attempts" in res.json()["detail"]


def test_jwt_authentication_and_expiry(client, create_test_citizen):
    citizen_ctx = create_test_citizen()
    headers = citizen_ctx["headers"]

    # Valid token on protected endpoint
    res = client.get("/api/v1/citizen/reports", headers=headers)
    assert res.status_code == 200

    # Invalid token
    bad_res = client.get("/api/v1/citizen/reports", headers={"Authorization": "Bearer invalid.token.payload"})
    assert bad_res.status_code == 401

    # Expired token
    expired_token = jwt.encode(
        {"sub": str(citizen_ctx["user"].id), "role": "CITIZEN", "exp": datetime.now(timezone.utc) - timedelta(hours=1)},
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    exp_res = client.get("/api/v1/citizen/reports", headers={"Authorization": f"Bearer {expired_token}"})
    assert exp_res.status_code == 401
    assert "expired" in exp_res.json()["detail"].lower()


def test_stakeholder_password_login(client, create_test_government):
    govt_ctx = create_test_government()
    user = govt_ctx["user"]

    # Valid login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"identifier": user.email, "password": "GovtSecret123"},
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()
    assert login_res.json()["role"] == "GOVERNMENT"

    # Wrong password
    bad_res = client.post(
        "/api/v1/auth/login",
        json={"identifier": user.email, "password": "WrongPassword"},
    )
    assert bad_res.status_code == 401
