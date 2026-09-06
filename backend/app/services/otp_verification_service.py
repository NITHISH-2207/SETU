from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.security import verify_otp
from app.models.otp import OTP


MAX_OTP_ATTEMPTS = 5


def verify_otp_code(
    db: Session,
    identifier: str,
    otp_code: str,
    otp_type: str | None = None,
) -> OTP:
    query = db.query(OTP).filter(
        OTP.identifier == identifier,
        OTP.verified_at.is_(None),
    )
    if otp_type:
        query = query.filter(OTP.type == otp_type)

    otp_record = query.order_by(OTP.created_at.desc()).first()

    if not otp_record:
        raise ValueError("No valid OTP found")

    if otp_record.attempts >= MAX_OTP_ATTEMPTS:
        raise ValueError("Maximum OTP attempts exceeded")

    now = datetime.now(timezone.utc)

    if otp_record.expires_at <= now:
        raise ValueError("OTP has expired")

    if not verify_otp(otp_code, otp_record.otp_hash):
        otp_record.attempts += 1
        db.commit()
        raise ValueError("Invalid OTP")

    otp_record.verified_at = now
    db.commit()
    db.refresh(otp_record)

    return otp_record