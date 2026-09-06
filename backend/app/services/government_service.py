from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.government import (
    GovernmentUser,
    GovernmentOrganization,
    GovernmentDepartment,
)
from app.models.report import Report
from app.models.ai_analysis import AIAnalysis
from app.models.report_workflow import Resolution
from app.schemas.government import (
    GovernmentProfileResponse,
    GovernmentReportItem,
    GovernmentReportDetailResponse,
)
from app.services.workflow_service import transition_report_status, submit_resolution
from app.services.report_service import get_report_detail


def _get_authorized_report(
    db: Session,
    report_id: int,
    govt_user: GovernmentUser,
) -> Report:
    """
    Return a report only if it belongs to the government user's jurisdiction.

    Department-level jurisdiction is preferred. If no department jurisdiction
    is configured, fall back to the organization's district/state.
    """
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise ValueError("Report not found")

    dept = (
        db.query(GovernmentDepartment)
        .filter(GovernmentDepartment.id == govt_user.department_id)
        .first()
        if govt_user.department_id
        else None
    )

    if dept and dept.jurisdiction:
        # Location is optional in the report schema. If it is missing,
        # the government user may review it because jurisdiction cannot
        # be determined from location yet.
        if not report.location:
            return report
        if dept.jurisdiction.lower() not in report.location.lower():
            raise ValueError("Report is outside your jurisdiction")
        return report

    org = (
        db.query(GovernmentOrganization)
        .filter(GovernmentOrganization.id == govt_user.government_id)
        .first()
    )

    if not org:
        raise ValueError("Government organization not found")

    # District is the next useful scope after department jurisdiction.
    if org.district:
        # Location is optional, so allow review when jurisdiction cannot
        # yet be determined from the submitted report.
        if not report.location:
            return report

        if org.district.lower() not in report.location.lower():
            raise ValueError("Report is outside your jurisdiction")

        return report

    # If neither department nor district is configured, allow the organization
    # to access the report. This supports broader/state-level authorities.
    return report


def get_government_profile(
    db: Session,
    user_id: int,
) -> GovernmentProfileResponse:
    govt_user = (
        db.query(GovernmentUser)
        .filter(GovernmentUser.user_id == user_id)
        .first()
    )

    if not govt_user:
        raise ValueError("Government profile not found")

    org = (
        db.query(GovernmentOrganization)
        .filter(GovernmentOrganization.id == govt_user.government_id)
        .first()
    )

    dept = (
        db.query(GovernmentDepartment)
        .filter(GovernmentDepartment.id == govt_user.department_id)
        .first()
        if govt_user.department_id
        else None
    )

    return GovernmentProfileResponse(
        user_id=govt_user.user_id,
        government_user_id=govt_user.id,
        government_id=govt_user.government_id,
        department_id=govt_user.department_id,
        organization_name=org.name if org else "Government Authority",
        department_name=dept.name if dept else None,
        level=org.level if org else "LOCAL",
        state=org.state if org else None,
        district=org.district if org else None,
        designation=govt_user.designation,
        permissions=govt_user.permissions or [],
    )


def list_government_reports(
    db: Session,
    govt_user: GovernmentUser,
    page: int = 1,
    limit: int = 20,
    status: str | None = None,
    category: str | None = None,
    research_classification: str | None = None,
) -> tuple[list[GovernmentReportItem], int]:
    query = db.query(Report)

    if status:
        query = query.filter(Report.status == status)

    if category:
        query = query.filter(Report.category == category)

    dept = (
        db.query(GovernmentDepartment)
        .filter(GovernmentDepartment.id == govt_user.department_id)
        .first()
        if govt_user.department_id
        else None
    )

    if dept and dept.jurisdiction:
        query = query.filter(
            Report.location.ilike(f"%{dept.jurisdiction}%")
        )
    else:
        org = (
            db.query(GovernmentOrganization)
            .filter(GovernmentOrganization.id == govt_user.government_id)
            .first()
        )

        if org and org.district:
            query = query.filter(
                Report.location.ilike(f"%{org.district}%")
            )

    if research_classification:
        query = query.join(
            AIAnalysis,
            AIAnalysis.report_id == Report.id,
        ).filter(
            AIAnalysis.research_classification == research_classification
        )

    total = query.count()

    offset = (page - 1) * limit

    reports = (
        query
        .order_by(Report.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    items: list[GovernmentReportItem] = []

    for r in reports:
        ai_record = (
            db.query(AIAnalysis)
            .filter(AIAnalysis.report_id == r.id)
            .order_by(AIAnalysis.created_at.desc())
            .first()
        )

        items.append(
            GovernmentReportItem(
                id=r.id,
                title=r.title,
                description=r.description,
                category=r.category,
                location=r.location,
                latitude=r.latitude,
                longitude=r.longitude,
                status=r.status,
                created_at=r.created_at,
                updated_at=r.updated_at,
                severity_score=ai_record.severity_score if ai_record else None,
                urgency_score=ai_record.urgency_score if ai_record else None,
                research_classification=(
                    ai_record.research_classification
                    if ai_record
                    else None
                ),
            )
        )

    return items, total


def get_government_report_detail(
    db: Session,
    report_id: int,
    govt_user: GovernmentUser,
) -> GovernmentReportDetailResponse:
    # Enforce government jurisdiction before exposing report details.
    _get_authorized_report(db, report_id, govt_user)

    detail = get_report_detail(
        db,
        report_id,
        citizen_id=None,
    )

    resolutions = (
        db.query(Resolution)
        .filter(Resolution.report_id == report_id)
        .order_by(Resolution.submitted_at.desc())
        .all()
    )

    return GovernmentReportDetailResponse(
        id=detail.id,
        citizen_id=detail.citizen_id,
        title=detail.title,
        description=detail.description,
        language=detail.language,
        category=detail.category,
        location=detail.location,
        latitude=detail.latitude,
        longitude=detail.longitude,
        location_source=detail.location_source,
        submission_source=detail.submission_source,
        status=detail.status,
        created_at=detail.created_at,
        updated_at=detail.updated_at,
        ai_analysis=detail.ai_analysis,
        attachments=detail.attachments,
        status_history=detail.status_history,
        resolutions=resolutions,
        community_support_count=detail.community_support_count,
    )


def update_government_report_status(
    db: Session,
    report_id: int,
    new_status: str,
    govt_user: GovernmentUser,
    comment: str | None = None,
) -> Report:
    _get_authorized_report(db, report_id, govt_user)

    return transition_report_status(
        db=db,
        report_id=report_id,
        new_status=new_status,
        actor_user_id=govt_user.user_id,
        actor_type="GOVERNMENT",
        comment=comment,
    )


def add_government_remark(
    db: Session,
    report_id: int,
    govt_user: GovernmentUser,
    remark: str,
    new_status: str | None = None,
) -> Report:
    report = _get_authorized_report(
        db,
        report_id,
        govt_user,
    )

    target_status = new_status or report.status

    return transition_report_status(
        db=db,
        report_id=report_id,
        new_status=target_status,
        actor_user_id=govt_user.user_id,
        actor_type="GOVERNMENT",
        comment=f"Official remark: {remark}",
    )


def government_resolve_report(
    db: Session,
    report_id: int,
    govt_user: GovernmentUser,
    solution_details: str,
    evidence: dict | None = None,
) -> Resolution:
    _get_authorized_report(
        db,
        report_id,
        govt_user,
    )

    return submit_resolution(
        db=db,
        report_id=report_id,
        solution_details=solution_details,
        submitted_by=govt_user.user_id,
        evidence=evidence,
    )