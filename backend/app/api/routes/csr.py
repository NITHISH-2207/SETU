from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.csr import Corporate, CSRProfile, CSRUser, ProblemCSRMatch
from app.models.report import Report
from app.models.project import SolutionProject, ProjectParticipant
from app.api.dependencies import get_current_csr_user
from app.schemas.csr import (
    CSRProfileResponse,
    CSRInterestRequest,
    CSRFundingRequest,
    CSRFundingResponse,
    ProblemCSRMatchResponse,
)
from app.schemas.report import ReportDetailResponse
from app.schemas.project import ProjectResponse
from app.services.csr_service import (
    match_problem_with_csr,
    express_csr_interest,
    allocate_csr_funding,
)
from app.services.report_service import get_report_detail

router = APIRouter(
    prefix="/api/v1/csr",
    tags=["Corporate / CSR"],
)


@router.get(
    "/profile",
    response_model=CSRProfileResponse,
)
def get_profile(
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """Retrieve corporate CSR profile and thematic focus areas."""
    profile = db.query(CSRProfile).filter(CSRProfile.corporate_id == csr_user.corporate_id).first()
    corp = db.query(Corporate).filter(Corporate.id == csr_user.corporate_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="CSR profile not configured")

    return CSRProfileResponse(
        id=profile.id,
        corporate_id=profile.corporate_id,
        company_name=corp.company_name if corp else None,
        focus_areas=profile.focus_areas,
        geographic_preferences=profile.geographic_preferences,
        funding_range=profile.funding_range,
        preferred_problem_types=profile.preferred_problem_types,
        preferred_project_stages=profile.preferred_project_stages,
        eligibility_criteria=profile.eligibility_criteria,
        status=profile.status,
        created_at=profile.created_at,
    )


@router.get(
    "/problems",
    response_model=list[ProblemCSRMatchResponse],
)
def get_csr_problems(
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """List challenges matched with or evaluated by the corporate CSR arm."""
    matches = (
        db.query(ProblemCSRMatch)
        .filter(ProblemCSRMatch.corporate_id == csr_user.corporate_id)
        .order_by(ProblemCSRMatch.created_at.desc())
        .all()
    )
    return [ProblemCSRMatchResponse.model_validate(m) for m in matches]


@router.get(
    "/recommended",
    response_model=list[ProblemCSRMatchResponse],
)
def get_recommended_csr_problems(
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """Discover recommended societal problems matching CSR focus areas and geography."""
    reports = db.query(Report).order_by(Report.created_at.desc()).limit(100).all()
    for rep in reports:
        match_problem_with_csr(db, rep.id)

    matches = (
        db.query(ProblemCSRMatch)
        .filter(ProblemCSRMatch.corporate_id == csr_user.corporate_id)
        .order_by(ProblemCSRMatch.match_score.desc())
        .all()
    )
    return [ProblemCSRMatchResponse.model_validate(m) for m in matches]


@router.get(
    "/problems/{report_id}",
    response_model=ReportDetailResponse,
)
def get_problem_details(
    report_id: int,
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """View detailed societal problem information for CSR funding evaluation."""
    try:
        return get_report_detail(db, report_id, citizen_id=None)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post(
    "/problems/{report_id}/interest",
    response_model=ProblemCSRMatchResponse,
)
def express_interest(
    report_id: int,
    interest_data: CSRInterestRequest,
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """Express corporate CSR sponsorship interest in a community challenge."""
    match = express_csr_interest(
        db=db,
        report_id=report_id,
        corporate_id=csr_user.corporate_id,
        comment=interest_data.comment,
        user_id=csr_user.user_id,
    )
    return ProblemCSRMatchResponse.model_validate(match)


@router.post(
    "/projects/{project_id}/funding",
    response_model=CSRFundingResponse,
)
def fund_project(
    project_id: int,
    funding_data: CSRFundingRequest,
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """Allocate/commit CSR capital or technology grants to an active solution project."""
    try:
        result = allocate_csr_funding(
            db=db,
            project_id=project_id,
            corporate_id=csr_user.corporate_id,
            amount=funding_data.amount,
            currency=funding_data.currency,
            tranche_details=funding_data.tranche_details,
            terms=funding_data.terms,
            user_id=csr_user.user_id,
        )
        return CSRFundingResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/projects",
    response_model=list[ProjectResponse],
)
def list_funded_projects(
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """List solution projects currently supported or funded by this corporation."""
    project_ids = (
        db.query(ProjectParticipant.project_id)
        .filter(
            ProjectParticipant.organization_id == csr_user.corporate_id,
            ProjectParticipant.participant_type == "CSR",
        )
        .all()
    )
    ids = [pid[0] for pid in project_ids]
    projects = db.query(SolutionProject).filter(SolutionProject.id.in_(ids)).all()
    return [ProjectResponse.model_validate(p) for p in projects]


@router.get(
    "/funding",
)
def get_funding_summary(
    csr_user: CSRUser = Depends(get_current_csr_user),
    db: Session = Depends(get_db),
):
    """Summary of CSR funds committed, active funded projects, and impact metrics."""
    participants = (
        db.query(ProjectParticipant)
        .filter(
            ProjectParticipant.organization_id == csr_user.corporate_id,
            ProjectParticipant.participant_type == "CSR",
        )
        .all()
    )
    return {
        "corporate_id": csr_user.corporate_id,
        "total_projects_supported": len(participants),
        "active_engagements": [
            {
                "project_id": p.project_id,
                "role": p.role,
                "joined_at": p.joined_at,
                "status": p.status,
            }
            for p in participants
        ],
    }
