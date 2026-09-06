from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.citizen import Citizen
from app.models.report_workflow import (
    ReportStatusHistory,
    ReportHistory,
    Resolution,
    Appeal,
)
from app.services.notification_service import create_notification


def transition_report_status(
    db: Session,
    report_id: int,
    new_status: str,
    actor_user_id: int | None,
    actor_type: str,
    comment: str | None = None,
) -> Report:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise ValueError(f"Report {report_id} not found")

    old_status = report.status

    # Record status transition history
    status_history = ReportStatusHistory(
        report_id=report.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by=actor_user_id,
        actor_type=actor_type,
        comment=comment,
        created_at=datetime.now(timezone.utc),
    )
    db.add(status_history)

    # Record general audit history
    audit_record = ReportHistory(
        report_id=report.id,
        changed_by=actor_user_id,
        actor_type=actor_type,
        action="STATUS_TRANSITION",
        previous_value={"status": old_status},
        new_value={"status": new_status, "comment": comment},
        timestamp=datetime.now(timezone.utc),
    )
    db.add(audit_record)

    report.status = new_status
    report.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(report)

    # Notify the citizen owner
    citizen = db.query(Citizen).filter(Citizen.id == report.citizen_id).first()
    if citizen and (not actor_user_id or citizen.user_id != actor_user_id):
        create_notification(
            db=db,
            recipient_user_id=citizen.user_id,
            type="REPORT_STATUS_CHANGED",
            title=f"Report Status Updated: {new_status}",
            message=f"Your report '{report.title}' status changed from {old_status} to {new_status}." + (f" Note: {comment}" if comment else ""),
            related_entity_type="REPORT",
            related_entity_id=report.id,
        )

    return report


def submit_resolution(
    db: Session,
    report_id: int,
    solution_details: str,
    submitted_by: int,
    evidence: dict | None = None,
) -> Resolution:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise ValueError(f"Report {report_id} not found")

    resolution = Resolution(
        report_id=report_id,
        solution_details=solution_details,
        resolution_status="PROPOSED",
        submitted_by=submitted_by,
        submitted_at=datetime.now(timezone.utc),
        evidence=evidence,
    )
    db.add(resolution)
    db.commit()
    db.refresh(resolution)

    # Update report status
    transition_report_status(
        db=db,
        report_id=report_id,
        new_status="RESOLVED",
        actor_user_id=submitted_by,
        actor_type="GOVERNMENT",
        comment=f"Resolution proposed: {solution_details[:100]}...",
    )

    return resolution


def accept_resolution(
    db: Session,
    report_id: int,
    citizen_id: int,
) -> Resolution:
    report = (
        db.query(Report)
        .filter(Report.id == report_id, Report.citizen_id == citizen_id)
        .first()
    )
    if not report:
        raise ValueError("Report not found or not owned by citizen")

    resolution = (
        db.query(Resolution)
        .filter(Resolution.report_id == report_id)
        .order_by(Resolution.submitted_at.desc())
        .first()
    )
    if not resolution:
        raise ValueError("No resolution found for this report")

    resolution.resolution_status = "ACCEPTED"
    citizen = db.query(Citizen).filter(Citizen.id == citizen_id).first()
    user_id = citizen.user_id if citizen else None

    transition_report_status(
        db=db,
        report_id=report_id,
        new_status="ACCEPTED",
        actor_user_id=user_id,
        actor_type="CITIZEN",
        comment="Citizen accepted the proposed resolution.",
    )

    # Notify resolver
    if resolution.submitted_by:
        create_notification(
            db=db,
            recipient_user_id=resolution.submitted_by,
            type="RESOLUTION_ACCEPTED",
            title="Resolution Accepted by Citizen",
            message=f"The citizen accepted the resolution for report '{report.title}'.",
            related_entity_type="REPORT",
            related_entity_id=report_id,
        )

    return resolution


def submit_appeal(
    db: Session,
    report_id: int,
    citizen_id: int,
    reason: str,
    message: str,
) -> Appeal:
    report = (
        db.query(Report)
        .filter(Report.id == report_id, Report.citizen_id == citizen_id)
        .first()
    )
    if not report:
        raise ValueError("Report not found or not owned by citizen")

    appeal = Appeal(
        report_id=report_id,
        citizen_id=citizen_id,
        reason=reason,
        message=message,
        status="SUBMITTED",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(appeal)
    db.commit()
    db.refresh(appeal)

    citizen = db.query(Citizen).filter(Citizen.id == citizen_id).first()
    user_id = citizen.user_id if citizen else None

    transition_report_status(
        db=db,
        report_id=report_id,
        new_status="APPEALED",
        actor_user_id=user_id,
        actor_type="CITIZEN",
        comment=f"Appeal filed: {reason}",
    )

    return appeal
