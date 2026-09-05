from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.government import GovernmentUser
from app.models.university import UniversityMentor, UniversityStudent
from app.models.csr import CSRUser
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    StakeholderRegisterRequest,
)
from app.core.security import verify_password, hash_password, create_access_token

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    """Universal password-based authentication for stakeholders (Government, University, CSR, etc.)."""
    user = (
        db.query(User)
        .filter(
            (User.email == login_data.identifier)
            | (User.mobile_number == login_data.identifier)
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password authentication not set up for this account. Use OTP.",
        )

    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if user.account_status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended",
        )

    user.last_login_at = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(user_id=user.id, role=user.role)

    return LoginResponse(
        message="Login successful",
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        role=user.role,
    )


@router.post(
    "/register-stakeholder",
    response_model=LoginResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_stakeholder(
    data: StakeholderRegisterRequest,
    db: Session = Depends(get_db),
):
    """Onboard an organizational stakeholder user (Government, University Mentor, University Student, CSR)."""
    existing_mobile = db.query(User).filter(User.mobile_number == data.mobile_number).first()
    if existing_mobile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered",
        )

    existing_email = db.query(User).filter(User.email == str(data.email)).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered",
        )

    now = datetime.now(timezone.utc)
    user = User(
        role=data.role,
        mobile_number=data.mobile_number,
        email=str(data.email),
        password_hash=hash_password(data.password),
        account_status="ACTIVE",
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize associated profile if organization info provided
    if data.role == "GOVERNMENT" and data.organization_id:
        govt_user = GovernmentUser(
            user_id=user.id,
            government_id=data.organization_id,
            department_id=data.department_id,
            designation=data.designation or "Official",
            status="ACTIVE",
            created_at=now,
        )
        db.add(govt_user)
    elif data.role == "UNIVERSITY_MENTOR" and data.organization_id:
        mentor = UniversityMentor(
            user_id=user.id,
            university_id=data.organization_id,
            department_id=data.department_id,
            name=data.full_name,
            designation=data.designation or "Assistant Professor",
            domains=[],
            profile_status="ACTIVE",
            created_at=now,
        )
        db.add(mentor)
    elif data.role == "UNIVERSITY_STUDENT" and data.organization_id:
        student = UniversityStudent(
            user_id=user.id,
            university_id=data.organization_id,
            department_id=data.department_id,
            name=data.full_name,
            profile_status="ACTIVE",
            created_at=now,
        )
        db.add(student)
    elif data.role == "CSR" and data.organization_id:
        csr_user = CSRUser(
            user_id=user.id,
            corporate_id=data.organization_id,
            designation=data.designation or "CSR Officer",
            status="ACTIVE",
            created_at=now,
        )
        db.add(csr_user)

    db.commit()

    token = create_access_token(user_id=user.id, role=user.role)
    return LoginResponse(
        message="Stakeholder registered successfully",
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        role=user.role,
    )
