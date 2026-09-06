from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.report_workflow import ReportSupport
from app.models.report import Report


def support_report(db: Session, report_id: int, citizen_id: int) -> tuple[bool, int]:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise ValueError("Report not found")

    existing = (
        db.query(ReportSupport)
        .filter(
            ReportSupport.report_id == report_id,
            ReportSupport.citizen_id == citizen_id,
        )
        .first()
    )

    if not existing:
        support = ReportSupport(
            report_id=report_id,
            citizen_id=citizen_id,
            created_at=datetime.now(timezone.utc),
        )
        db.add(support)
        db.commit()

    count = (
        db.query(ReportSupport)
        .filter(ReportSupport.report_id == report_id)
        .count()
    )
    return True, count


def unsupport_report(db: Session, report_id: int, citizen_id: int) -> tuple[bool, int]:
    existing = (
        db.query(ReportSupport)
        .filter(
            ReportSupport.report_id == report_id,
            ReportSupport.citizen_id == citizen_id,
        )
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()

    count = (
        db.query(ReportSupport)
        .filter(ReportSupport.report_id == report_id)
        .count()
    )
    return False, count


def get_support_count(db: Session, report_id: int) -> int:
    return (
        db.query(ReportSupport)
        .filter(ReportSupport.report_id == report_id)
        .count()
    )


def has_citizen_supported(db: Session, report_id: int, citizen_id: int) -> bool:
    return (
        db.query(ReportSupport)
        .filter(
            ReportSupport.report_id == report_id,
            ReportSupport.citizen_id == citizen_id,
        )
        .first()
        is not None
    )
