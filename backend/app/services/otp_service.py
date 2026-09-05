import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.otp import OTP
from app.core.security import hash_otp


OTP_EXPIRY_MINUTES = 5


def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def create_otp(
    db: Session,
    identifier: str,
    user_id: int | None = None,
    otp_type: str = "MOBILE",
) -> str:
    now = datetime.now(timezone.utc)
    # Invalidate any prior active unverified OTPs for this identifier
    db.query(OTP).filter(
        OTP.identifier == identifier,
        OTP.type == otp_type,
        OTP.verified_at.is_(None),
        OTP.expires_at > now,
    ).update({"expires_at": now})

    otp = generate_otp()

    otp_record = OTP(
        user_id=user_id,
        identifier=identifier,
        type=otp_type,
        otp_hash=hash_otp(otp),
        expires_at=now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        attempts=0,
        resend_count=0,
    )

    db.add(otp_record)
    db.commit()
    db.refresh(otp_record)

    return otp