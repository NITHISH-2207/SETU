from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.db.session import get_db
from app.models.user import User
from app.models.government import GovernmentUser, GovernmentOrganization, GovernmentDepartment
from app.models.university import (
    University,
    UniversityDepartment,
    UniversityMentor,
    UniversityStudent,
)
from app.models.csr import Corporate, CSRUser
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    StakeholderRegisterRequest,
    StakeholderRegisterResponse,
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
    response_model=StakeholderRegisterResponse,
    status_code=201,
)
def register_stakeholder(
    data: StakeholderRegisterRequest,
    db: Session = Depends(get_db),
):
    """Submit an organizational stakeholder onboarding request."""

    existing_mobile = (
        db.query(User)
        .filter(User.mobile_number == data.mobile_number)
        .first()
    )
    if existing_mobile:
        raise HTTPException(
            status_code=400,
            detail="Mobile number already registered",
        )

    existing_email = (
        db.query(User)
        .filter(User.email == str(data.email))
        .first()
    )
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email address already registered",
        )

    if data.organization_id is None:
        raise HTTPException(
            status_code=400,
            detail="organization_id is required for stakeholder registration",
        )

    # Validate organization according to stakeholder role.
    organization = None

    if data.role == "GOVERNMENT":
        organization = (
            db.query(GovernmentOrganization)
            .filter(
                GovernmentOrganization.id == data.organization_id,
                GovernmentOrganization.status == "ACTIVE",
            )
            .first()
        )
        if not organization:
            raise HTTPException(
                status_code=400,
                detail="Active government organization not found",
            )

        if data.department_id is not None:
            department = (
                db.query(GovernmentDepartment)
                .filter(
                    GovernmentDepartment.id == data.department_id,
                    GovernmentDepartment.government_id == organization.id,
                    GovernmentDepartment.status == "ACTIVE",
                )
                .first()
            )
            if not department:
                raise HTTPException(
                    status_code=400,
                    detail="Department does not belong to the selected government organization",
                )

    elif data.role in {"UNIVERSITY_MENTOR", "UNIVERSITY_STUDENT"}:
        organization = (
            db.query(University)
            .filter(
                University.id == data.organization_id,
                University.status == "ACTIVE",
            )
            .first()
        )
        if not organization:
            raise HTTPException(
                status_code=400,
                detail="Active university not found",
            )

        if data.department_id is not None:
            department = (
                db.query(UniversityDepartment)
                .filter(
                    UniversityDepartment.id == data.department_id,
                    UniversityDepartment.university_id == organization.id,
                )
                .first()
            )
            if not department:
                raise HTTPException(
                    status_code=400,
                    detail="Department does not belong to the selected university",
                )

    elif data.role == "CSR":
        organization = (
            db.query(Corporate)
            .filter(
                Corporate.id == data.organization_id,
                Corporate.status == "ACTIVE",
            )
            .first()
        )
        if not organization:
            raise HTTPException(
                status_code=400,
                detail="Active corporate organization not found",
            )

    now = datetime.now(timezone.utc)

    # Stakeholder accounts require organizational approval/activation.
    user = User(
        role=data.role,
        mobile_number=data.mobile_number,
        email=str(data.email),
        password_hash=hash_password(data.password),
        account_status="PENDING",
        created_at=now,
        updated_at=now,
    )

    db.add(user)
    db.flush()

    # Create the stakeholder profile as pending onboarding.
    if data.role == "GOVERNMENT":
        govt_user = GovernmentUser(
            user_id=user.id,
            government_id=data.organization_id,
            department_id=data.department_id,
            designation=data.designation or "Official",
            status="PENDING",
            created_at=now,
        )
        db.add(govt_user)

    elif data.role == "UNIVERSITY_MENTOR":
        mentor = UniversityMentor(
            user_id=user.id,
            university_id=data.organization_id,
            department_id=data.department_id,
            name=data.full_name,
            designation=data.designation or "Assistant Professor",
            domains=[],
            profile_status="PENDING",
            created_at=now,
        )
        db.add(mentor)

    elif data.role == "UNIVERSITY_STUDENT":
        student = UniversityStudent(
            user_id=user.id,
            university_id=data.organization_id,
            department_id=data.department_id,
            name=data.full_name,
            profile_status="PENDING",
            created_at=now,
        )
        db.add(student)

    elif data.role == "CSR":
        csr_user = CSRUser(
            user_id=user.id,
            corporate_id=data.organization_id,
            designation=data.designation or "CSR Officer",
            status="PENDING",
            created_at=now,
        )
        db.add(csr_user)

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to complete stakeholder registration",
        )

    return StakeholderRegisterResponse(
        message="Stakeholder registration submitted for approval",
        user_id=user.id,
        role=user.role,
        account_status=user.account_status,
    )