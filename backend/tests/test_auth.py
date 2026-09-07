from datetime import datetime, timezone, timedelta
import jwt
import uuid

from app.core.config import settings
from app.models.otp import OTP
from app.models.user import User
from app.models.government import GovernmentUser

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

def test_stakeholder_registration_requires_organization(client):
    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "GOVERNMENT",
            "full_name": "Random Official",
            "mobile_number": "9000000001",
            "email": "random1@example.com",
            "password": "Password123",
        },
    )

    assert response.status_code == 400
    assert "organization_id is required" in response.json()["detail"]


def test_stakeholder_registration_creates_pending_account_without_jwt(
    client,
    create_test_government,
    db,
):
    govt = create_test_government()

    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "GOVERNMENT",
            "full_name": "Pending Official",
            "mobile_number": f"90{uuid.uuid4().int % 100000000:08d}",
            "email": f"pending_{uuid.uuid4().hex[:8]}@example.com",
            "password": "Password123",
            "organization_id": govt["org"].id,
            "department_id": govt["dept"].id,
            "designation": "Junior Engineer",
        },
    )

    assert response.status_code == 201, response.json()

    body = response.json()

    assert body["role"] == "GOVERNMENT"
    assert body["account_status"] == "PENDING"
    assert "access_token" not in body

    user = db.query(User).filter(User.id == body["user_id"]).first()

    assert user is not None
    assert user.account_status == "PENDING"

    govt_user = (
        db.query(GovernmentUser)
        .filter(GovernmentUser.user_id == user.id)
        .first()
    )

    assert govt_user is not None
    assert govt_user.status == "PENDING"


def test_stakeholder_registration_rejects_wrong_department(
    client,
    create_test_government,
):
    govt_a = create_test_government()
    govt_b = create_test_government()

    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "GOVERNMENT",
            "full_name": "Cross Org Official",
            "mobile_number": "9000000003",
            "email": "crossorg@example.com",
            "password": "Password123",
            "organization_id": govt_a["org"].id,
            "department_id": govt_b["dept"].id,
        },
    )

    assert response.status_code == 400
    assert "does not belong" in response.json()["detail"]


def test_pending_stakeholder_cannot_login(
    client,
    create_test_government,
):
    govt = create_test_government()
    email = f"pendinglogin_{uuid.uuid4().hex[:8]}@example.com"
    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "GOVERNMENT",
            "full_name": "Pending Login Test",
            "mobile_number": f"91{uuid.uuid4().int % 100000000:08d}",
            "email": email,
            "password": "Password123",
            "organization_id": govt["org"].id,
            "department_id": govt["dept"].id,
        },
    )

    assert response.status_code == 201, response.json()

    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "identifier": email,
            "password": "Password123",
        },
    )

    assert login_response.status_code == 403
    assert "inactive or suspended" in login_response.json()["detail"]

def test_university_mentor_registration_creates_pending_account(
    client,
    create_test_university,
):
    uni = create_test_university()

    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "UNIVERSITY_MENTOR",
            "full_name": "Pending Mentor",
            "mobile_number": f"92{uuid.uuid4().int % 100000000:08d}",
            "email": f"mentor_{uuid.uuid4().hex[:8]}@example.com",
            "password": "Password123",
            "organization_id": uni["university"].id,
            "department_id": uni["dept"].id,
            "designation": "Assistant Professor",
        },
    )

    assert response.status_code == 201, response.json()
    body = response.json()

    assert body["role"] == "UNIVERSITY_MENTOR"
    assert body["account_status"] == "PENDING"
    assert "access_token" not in body


def test_university_student_registration_creates_pending_account(
    client,
    create_test_university,
):
    uni = create_test_university()

    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "UNIVERSITY_STUDENT",
            "full_name": "Pending Student",
            "mobile_number": f"93{uuid.uuid4().int % 100000000:08d}",
            "email": f"student_{uuid.uuid4().hex[:8]}@example.com",
            "password": "Password123",
            "organization_id": uni["university"].id,
            "department_id": uni["dept"].id,
        },
    )

    assert response.status_code == 201, response.json()
    body = response.json()

    assert body["role"] == "UNIVERSITY_STUDENT"
    assert body["account_status"] == "PENDING"
    assert "access_token" not in body


def test_csr_registration_creates_pending_account(
    client,
    create_test_csr,
):
    csr = create_test_csr()

    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "CSR",
            "full_name": "Pending CSR Officer",
            "mobile_number": f"94{uuid.uuid4().int % 100000000:08d}",
            "email": f"csr_pending_{uuid.uuid4().hex[:8]}@example.com",
            "password": "Password123",
            "organization_id": csr["corp"].id,
            "designation": "CSR Officer",
        },
    )

    assert response.status_code == 201, response.json()
    body = response.json()

    assert body["role"] == "CSR"
    assert body["account_status"] == "PENDING"
    assert "access_token" not in body


def test_stakeholder_registration_rejects_wrong_organization_type(
    client,
    create_test_government,
):
    govt = create_test_government()

    response = client.post(
        "/api/v1/auth/register-stakeholder",
        json={
            "role": "UNIVERSITY_MENTOR",
            "full_name": "Wrong Organization",
            "mobile_number": f"95{uuid.uuid4().int % 100000000:08d}",
            "email": f"wrong_org_{uuid.uuid4().hex[:8]}@example.com",
            "password": "Password123",
            "organization_id": govt["org"].id,
        },
    )

    assert response.status_code == 400
    assert "university" in response.json()["detail"].lower()