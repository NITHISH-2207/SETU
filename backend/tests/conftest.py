import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
import uuid

from app.main import app
from app.db.session import SessionLocal
from app.models.user import User
from app.models.citizen import Citizen
from app.models.government import GovernmentOrganization, GovernmentDepartment, GovernmentUser
from app.models.university import University, UniversityDepartment, UniversityMentor, UniversityStudent
from app.models.csr import Corporate, CSRProfile, CSRUser
from app.core.security import create_access_token, hash_password


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def create_test_citizen(db):
    def _create(name: str = "Test Citizen", mobile: str | None = None, email: str | None = None):
        uid = uuid.uuid4().hex[:8]
        mobile_num = mobile or f"98{uuid.uuid4().int % 100000000:08d}"
        email_addr = email or f"citizen_{uid}@example.com"

        user = User(
            role="CITIZEN",
            mobile_number=mobile_num,
            email=email_addr,
            account_status="ACTIVE",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        citizen = Citizen(
            user_id=user.id,
            full_name=name,
            mobile_number=mobile_num,
            email=email_addr,
            mobile_verified=True,
            email_verified=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(citizen)
        db.commit()
        db.refresh(citizen)

        token = create_access_token(user_id=user.id, role="CITIZEN")
        return {
            "user": user,
            "citizen": citizen,
            "token": token,
            "headers": {"Authorization": f"Bearer {token}"},
        }

    return _create


@pytest.fixture
def create_test_government(db):
    def _create():
        uid = uuid.uuid4().hex[:8]
        mobile_num = f"97{uuid.uuid4().int % 100000000:08d}"
        email_addr = f"govt_{uid}@setu.gov.in"

        org = GovernmentOrganization(
            name=f"Municipal Corporation {uid}",
            level="LOCAL",
            state="Maharashtra",
            district="Pune",
            status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(org)
        db.commit()
        db.refresh(org)

        dept = GovernmentDepartment(
            government_id=org.id,
            name="Water Supply & Sanitation",
            jurisdiction="Pune Ward 4",
            status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(dept)
        db.commit()
        db.refresh(dept)

        user = User(
            role="GOVERNMENT",
            mobile_number=mobile_num,
            email=email_addr,
            password_hash=hash_password("GovtSecret123"),
            account_status="ACTIVE",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        govt_user = GovernmentUser(
            user_id=user.id,
            government_id=org.id,
            department_id=dept.id,
            designation="Executive Engineer",
            permissions=["READ_REPORTS", "UPDATE_STATUS", "RESOLVE_REPORTS"],
            status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(govt_user)
        db.commit()
        db.refresh(govt_user)

        token = create_access_token(user_id=user.id, role="GOVERNMENT")
        return {
            "user": user,
            "org": org,
            "dept": dept,
            "govt_user": govt_user,
            "token": token,
            "headers": {"Authorization": f"Bearer {token}"},
        }

    return _create


@pytest.fixture
def create_test_university(db):
    def _create():
        uid = uuid.uuid4().hex[:8]
        uni = University(
            name=f"National Institute of Technology {uid}",
            code=f"NIT_{uid.upper()}",
            city="Bengaluru",
            state="Karnataka",
            country="India",
            status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(uni)
        db.commit()
        db.refresh(uni)

        dept = UniversityDepartment(
            university_id=uni.id,
            name="Civil & Environmental Engineering",
            code="CEE",
            status="ACTIVE",
        )
        db.add(dept)
        db.commit()
        db.refresh(dept)

        # Mentor
        mentor_mobile = f"96{uuid.uuid4().int % 100000000:08d}"
        mentor_user = User(
            role="UNIVERSITY_MENTOR",
            mobile_number=mentor_mobile,
            email=f"mentor_{uid}@nit.edu",
            password_hash=hash_password("MentorSecret123"),
            account_status="ACTIVE",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(mentor_user)
        db.commit()
        db.refresh(mentor_user)

        mentor = UniversityMentor(
            user_id=mentor_user.id,
            university_id=uni.id,
            department_id=dept.id,
            name=f"Dr. Ramesh Sharma {uid}",
            designation="Professor",
            domains=["water", "contamination", "filtration", "arsenic", "purification"],
            expertise="Water Quality & Membrane Filtration",
            availability="AVAILABLE",
            profile_status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(mentor)

        # Student
        student_mobile = f"95{uuid.uuid4().int % 100000000:08d}"
        student_user = User(
            role="UNIVERSITY_STUDENT",
            mobile_number=student_mobile,
            email=f"student_{uid}@nit.edu",
            password_hash=hash_password("StudentSecret123"),
            account_status="ACTIVE",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

        student = UniversityStudent(
            user_id=student_user.id,
            university_id=uni.id,
            department_id=dept.id,
            name=f"Ananya Verma {uid}",
            year="4th Year",
            skills=["Water Quality Testing", "CAD", "IoT Sensors"],
            domains=["water", "sensors"],
            availability="AVAILABLE",
            profile_status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(student)
        db.commit()
        db.refresh(mentor)
        db.refresh(student)

        mentor_token = create_access_token(user_id=mentor_user.id, role="UNIVERSITY_MENTOR")
        student_token = create_access_token(user_id=student_user.id, role="UNIVERSITY_STUDENT")

        return {
            "university": uni,
            "dept": dept,
            "mentor_user": mentor_user,
            "mentor": mentor,
            "mentor_headers": {"Authorization": f"Bearer {mentor_token}"},
            "student_user": student_user,
            "student": student,
            "student_headers": {"Authorization": f"Bearer {student_token}"},
        }

    return _create


@pytest.fixture
def create_test_csr(db):
    def _create():
        uid = uuid.uuid4().hex[:8]
        corp = Corporate(
            company_name=f"Tata Foundation {uid}",
            registration_details=f"REG-{uid.upper()}",
            industry="CSR & Community Development",
            headquarters="Mumbai",
            status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(corp)
        db.commit()
        db.refresh(corp)

        profile = CSRProfile(
            corporate_id=corp.id,
            focus_areas=["Water", "Healthcare", "Environment", "Rural Development"],
            geographic_preferences=["Maharashtra", "Karnataka", "National"],
            funding_range={"min": 50000, "max": 5000000},
            status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        mobile_num = f"94{uuid.uuid4().int % 100000000:08d}"
        user = User(
            role="CSR",
            mobile_number=mobile_num,
            email=f"csr_{uid}@foundation.org",
            password_hash=hash_password("CsrSecret123"),
            account_status="ACTIVE",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        csr_user = CSRUser(
            user_id=user.id,
            corporate_id=corp.id,
            designation="CSR Program Director",
            status="ACTIVE",
            created_at=datetime.now(timezone.utc),
        )
        db.add(csr_user)
        db.commit()
        db.refresh(csr_user)

        token = create_access_token(user_id=user.id, role="CSR")
        return {
            "corp": corp,
            "profile": profile,
            "user": user,
            "csr_user": csr_user,
            "token": token,
            "headers": {"Authorization": f"Bearer {token}"},
        }

    return _create
