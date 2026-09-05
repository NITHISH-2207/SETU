from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.government import GovernmentUser
from app.models.report import Report
from app.models.report_workflow import ReportStatusHistory
from app.api.dependencies import get_current_government_user
from app.schemas.government import (
    GovernmentProfileResponse,
    GovernmentReportListResponse,
    GovernmentReportDetailResponse,
    GovernmentRemarkRequest,
    GovernmentResolveRequest,
)
from app.schemas.workflow import (
    StatusUpdateRequest,
    ReportStatusHistoryResponse,
    ResolutionResponse,
)
from app.schemas.report import ReportResponse
from app.services.government_service import (
    get_government_profile,
    list_government_reports,
    get_government_report_detail,
    update_government_report_status,
    add_government_remark,
    government_resolve_report,
)

router = APIRouter(
    prefix="/api/v1/government",
    tags=["Government"],
)


@router.get(
    "/profile",
    response_model=GovernmentProfileResponse,
)
def get_profile(
    govt_user: GovernmentUser = Depends(get_current_government_user),
    db: Session = Depends(get_db),
):
    """Retrieve government user and department profile."""
    return get_government_profile(db=db, user_id=govt_user.user_id)


@router.get(
    "/reports",
    response_model=GovernmentReportListResponse,
)
def get_reports(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    status_filter: str | None = Query(default=None, alias="status"),
    category: str | None = None,
    research_classification: str | None = None,
    govt_user: GovernmentUser = Depends(get_current_government_user),
    db: Session = Depends(get_db),
):
    """List societal reports filtered by jurisdiction, status, and AI classification."""
    items, total = list_government_reports(
        db=db,
        govt_user=govt_user,
        page=page,
        limit=limit,
        status=status_filter,
        category=category,
        research_classification=research_classification,
    )
    return GovernmentReportListResponse(
        reports=items,
        page=page,
        limit=limit,
        total=total,
    )


@router.get(
    "/reports/{report_id}",
    response_model=GovernmentReportDetailResponse,
)
def get_report(
    report_id: int,
    govt_user: GovernmentUser = Depends(get_current_government_user),
    db: Session = Depends(get_db),
):
    """View complete problem report details including AI analysis and evidence."""
    try:
        return get_government_report_detail(
            db=db,
            report_id=report_id,
            govt_user=govt_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.patch(
    "/reports/{report_id}/status",
    response_model=ReportResponse,
)
def update_status(
    report_id: int,
    status_data: StatusUpdateRequest,
    govt_user: GovernmentUser = Depends(get_current_government_user),
    db: Session = Depends(get_db),
):
    """Update report workflow status with official comment."""
    try:
        report = update_government_report_status(
            db=db,
            report_id=report_id,
            new_status=status_data.new_status,
            govt_user=govt_user,
            comment=status_data.comment,
        )
        return ReportResponse.model_validate(report)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/reports/{report_id}/update",
    response_model=ReportResponse,
)
def add_remark(
    report_id: int,
    remark_data: GovernmentRemarkRequest,
    govt_user: GovernmentUser = Depends(get_current_government_user),
    db: Session = Depends(get_db),
):
    """Add official department remarks/progress updates to a report."""
    try:
        report = add_government_remark(
            db=db,
            report_id=report_id,
            govt_user=govt_user,
            remark=remark_data.remark,
            new_status=remark_data.new_status,
        )
        return ReportResponse.model_validate(report)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/reports/{report_id}/resolve",
    response_model=ResolutionResponse,
)
def resolve_report(
    report_id: int,
    resolve_data: GovernmentResolveRequest,
    govt_user: GovernmentUser = Depends(get_current_government_user),
    db: Session = Depends(get_db),
):
    """Submit official resolution or implementation details for a report."""
    try:
        res = government_resolve_report(
            db=db,
            report_id=report_id,
            govt_user=govt_user,
            solution_details=resolve_data.solution_details,
            evidence=resolve_data.evidence,
        )
        return ResolutionResponse.model_validate(res)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/reports/{report_id}/history",
    response_model=list[ReportStatusHistoryResponse],
)
def get_report_history(
    report_id: int,
    govt_user: GovernmentUser = Depends(get_current_government_user),
    db: Session = Depends(get_db),
):
    """Retrieve complete status and audit history of a report."""
    histories = (
        db.query(ReportStatusHistory)
        .filter(ReportStatusHistory.report_id == report_id)
        .order_by(ReportStatusHistory.created_at.asc())
        .all()
    )
    return [ReportStatusHistoryResponse.model_validate(h) for h in histories]
