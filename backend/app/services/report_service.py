from datetime import datetime, timezone
from sqlalchemy import desc, asc
from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.report_attachment import ReportAttachment
from app.models.ai_analysis import AIAnalysis
from app.models.report_workflow import (
    ReportStatusHistory,
    Resolution,
    Appeal,
    ReportSupport,
)
from app.models.citizen import Citizen
from app.schemas.report import (
    ReportCreate,
    CitizenReportItem,
    ReportDetailResponse,
)
from app.schemas.attachment import AttachmentResponse
from app.schemas.ai import AIAnalysisResponse
from app.schemas.workflow import (
    ReportStatusHistoryResponse,
    ResolutionResponse,
    AppealResponse,
)
from app.services.ai_service import analyze_report
from app.services.notification_service import create_notification


def create_report(
    db: Session,
    report_data: ReportCreate,
    citizen_id: int,
) -> Report:
    now = datetime.now(timezone.utc)
    report = Report(
        citizen_id=citizen_id,
        title=report_data.title,
        description=report_data.description,
        language=report_data.language,
        category=report_data.category,
        location=report_data.location,
        latitude=report_data.latitude,
        longitude=report_data.longitude,
        location_source=report_data.location_source or "CITIZEN_PROVIDED",
        submission_source=report_data.submission_source or "WEB",
        status="SUBMITTED",
        created_at=now,
        updated_at=now,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # Initial status history
    citizen = db.query(Citizen).filter(Citizen.id == citizen_id).first()
    user_id = citizen.user_id if citizen else None

    initial_history = ReportStatusHistory(
        report_id=report.id,
        previous_status=None,
        new_status="SUBMITTED",
        changed_by=user_id,
        actor_type="CITIZEN",
        comment="Report submitted by citizen",
        created_at=now,
    )
    db.add(initial_history)
    db.commit()

    # Trigger AI analysis (persisted separately without modifying the original report)
    analyze_report(db, report)

    # Dispatch notification to citizen
    if user_id:
        create_notification(
            db=db,
            recipient_user_id=user_id,
            type="REPORT_SUBMITTED",
            title="Report Successfully Submitted",
            message=f"Your problem report '{report.title}' has been submitted for review.",
            related_entity_type="REPORT",
            related_entity_id=report.id,
        )

    return report


def get_report_by_id(
    db: Session,
    report_id: int,
    citizen_id: int | None = None,
) -> Report:
    query = db.query(Report).filter(Report.id == report_id)
    if citizen_id is not None:
        query = query.filter(Report.citizen_id == citizen_id)

    report = query.first()
    if not report:
        raise ValueError("Report not found or unauthorized")
    return report


def get_report_detail(
    db: Session,
    report_id: int,
    citizen_id: int | None = None,
    current_user_id: int | None = None,
) -> ReportDetailResponse:
    report = get_report_by_id(db, report_id, citizen_id=citizen_id)

    # Load attachments
    attachments = (
        db.query(ReportAttachment)
        .filter(ReportAttachment.report_id == report.id)
        .order_by(ReportAttachment.uploaded_at.asc())
        .all()
    )
    attachment_items = [
        AttachmentResponse(
            id=a.id,
            report_id=a.report_id,
            type=a.type,
            file_url=a.file_url,
            storage_key=a.storage_key,
            cloudinary_public_id=a.cloudinary_public_id,
            cloudinary_resource_type=a.cloudinary_resource_type,
            metadata=a.file_metadata,
            uploaded_at=a.uploaded_at,
        )
        for a in attachments
    ]

    # Load AI analysis
    ai_record = (
        db.query(AIAnalysis)
        .filter(AIAnalysis.report_id == report.id)
        .order_by(AIAnalysis.created_at.desc())
        .first()
    )
    ai_schema = AIAnalysisResponse.model_validate(ai_record) if ai_record else None

    # Load status history
    histories = (
        db.query(ReportStatusHistory)
        .filter(ReportStatusHistory.report_id == report.id)
        .order_by(ReportStatusHistory.created_at.asc())
        .all()
    )
    history_items = [ReportStatusHistoryResponse.model_validate(h) for h in histories]

    # Load resolution
    res = (
        db.query(Resolution)
        .filter(Resolution.report_id == report.id)
        .order_by(Resolution.submitted_at.desc())
        .first()
    )
    resolution_schema = ResolutionResponse.model_validate(res) if res else None

    # Load appeal
    app = (
        db.query(Appeal)
        .filter(Appeal.report_id == report.id)
        .order_by(Appeal.created_at.desc())
        .first()
    )
    appeal_schema = AppealResponse.model_validate(app) if app else None

    # Support metrics
    support_count = (
        db.query(ReportSupport)
        .filter(ReportSupport.report_id == report.id)
        .count()
    )

    is_supported = False
    if citizen_id is not None:
        is_supported = (
            db.query(ReportSupport)
            .filter(
                ReportSupport.report_id == report.id,
                ReportSupport.citizen_id == citizen_id,
            )
            .first()
            is not None
        )

    return ReportDetailResponse(
        id=report.id,
        citizen_id=report.citizen_id,
        title=report.title,
        description=report.description,
        language=report.language,
        category=report.category,
        location=report.location,
        latitude=report.latitude,
        longitude=report.longitude,
        location_source=report.location_source,
        submission_source=report.submission_source,
        status=report.status,
        created_at=report.created_at,
        updated_at=report.updated_at,
        community_support_count=support_count,
        is_supported_by_user=is_supported,
        attachments=attachment_items,
        ai_analysis=ai_schema,
        status_history=history_items,
        resolution=resolution_schema,
        appeal=appeal_schema,
    )


def list_citizen_reports(
    db: Session,
    citizen_id: int,
    page: int = 1,
    limit: int = 10,
    category: str | None = None,
    status: str | None = None,
    sort_by: str = "created_at_desc",
) -> tuple[list[CitizenReportItem], int]:
    query = db.query(Report).filter(Report.citizen_id == citizen_id)

    if category:
        query = query.filter(Report.category == category)
    if status:
        query = query.filter(Report.status == status)

    if sort_by == "created_at_asc":
        query = query.order_by(asc(Report.created_at))
    else:
        query = query.order_by(desc(Report.created_at))

    total = query.count()
    offset = (page - 1) * limit
    reports = query.offset(offset).limit(limit).all()

    items: list[CitizenReportItem] = []
    for r in reports:
        # Latest update comment
        latest_history = (
            db.query(ReportStatusHistory)
            .filter(ReportStatusHistory.report_id == r.id)
            .order_by(ReportStatusHistory.created_at.desc())
            .first()
        )
        latest_update = latest_history.comment if latest_history else None

        # Resolution status
        res = (
            db.query(Resolution)
            .filter(Resolution.report_id == r.id)
            .order_by(Resolution.submitted_at.desc())
            .first()
        )
        res_status = res.resolution_status if res else None

        # Appeal status
        app = (
            db.query(Appeal)
            .filter(Appeal.report_id == r.id)
            .order_by(Appeal.created_at.desc())
            .first()
        )
        app_status = app.status if app else None

        # Support count
        supp_count = (
            db.query(ReportSupport)
            .filter(ReportSupport.report_id == r.id)
            .count()
        )

        items.append(
            CitizenReportItem(
                id=r.id,
                citizen_id=r.citizen_id,
                title=r.title,
                description=r.description,
                category=r.category,
                location=r.location,
                latitude=r.latitude,
                longitude=r.longitude,
                location_source=r.location_source,
                submission_source=r.submission_source,
                status=r.status,
                created_at=r.created_at,
                updated_at=r.updated_at,
                latest_update=latest_update,
                resolution_status=res_status,
                community_support_count=supp_count,
                appeal_status=app_status,
            )
        )

    return items, total