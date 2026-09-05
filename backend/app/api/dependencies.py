from collections.abc import Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.models.citizen import Citizen
from app.models.government import GovernmentUser
from app.models.university import UniversityMentor, UniversityStudent
from app.models.csr import CSRUser

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> dict:
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

    user_id_str = payload.get("sub")
    role = payload.get("role")

    if not user_id_str or not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if user.account_status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended",
        )

    return {
        "user_id": user.id,
        "role": user.role,
        "user": user,
    }


def require_roles(*allowed_roles: str) -> Callable:
    def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: role must be one of {allowed_roles}",
            )
        return current_user

    return role_checker


def get_current_citizen(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Citizen:
    if current_user["role"] != "CITIZEN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: citizen profile required",
        )

    citizen = (
        db.query(Citizen)
        .filter(Citizen.user_id == current_user["user_id"])
        .first()
    )
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen profile not found",
        )
    return citizen


def get_current_government_user(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> GovernmentUser:
    if current_user["role"] != "GOVERNMENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: government authority required",
        )

    govt_user = (
        db.query(GovernmentUser)
        .filter(GovernmentUser.user_id == current_user["user_id"])
        .first()
    )
    if not govt_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Government profile not found",
        )
    return govt_user


def get_current_university_mentor(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UniversityMentor:
    if current_user["role"] != "UNIVERSITY_MENTOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: university mentor role required",
        )

    mentor = (
        db.query(UniversityMentor)
        .filter(UniversityMentor.user_id == current_user["user_id"])
        .first()
    )
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found",
        )
    return mentor


def get_current_university_student(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UniversityStudent:
    if current_user["role"] != "UNIVERSITY_STUDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: university student role required",
        )

    student = (
        db.query(UniversityStudent)
        .filter(UniversityStudent.user_id == current_user["user_id"])
        .first()
    )
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )
    return student


def get_current_csr_user(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CSRUser:
    if current_user["role"] != "CSR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: CSR stakeholder role required",
        )

    csr_user = (
        db.query(CSRUser)
        .filter(CSRUser.user_id == current_user["user_id"])
        .first()
    )
    if not csr_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CSR profile not found",
        )
    return csr_user