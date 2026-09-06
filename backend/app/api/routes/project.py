from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import SolutionProject, ProjectParticipant, ProjectMilestone
from app.api.dependencies import get_current_user, require_roles
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectParticipantAdd,
    ProjectParticipantResponse,
    MilestoneCreate,
    MilestoneResponse,
    StageUpdateRequest,
    ProjectStatusUpdateRequest,
)
from app.services.project_service import (
    create_solution_project,
    get_project_detail,
    add_project_participant,
    update_project_stage,
    update_project_status,
    add_project_milestone,
    update_project_milestone,
)

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["Solution Projects"],
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    data: ProjectCreate,
    current_user: dict = Depends(require_roles("GOVERNMENT", "UNIVERSITY_MENTOR", "CSR")),
    db: Session = Depends(get_db),
):
    """Initiate a multi-stakeholder solution project from a verified community problem."""
    try:
        project = create_solution_project(
            db=db,
            data=data,
            created_by_user_id=current_user["user_id"],
        )
        return ProjectResponse.model_validate(project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "",
    response_model=list[ProjectResponse],
)
def list_projects(
    stage: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
):
    """List solution projects with stage and health filters."""
    query = db.query(SolutionProject)
    if stage:
        query = query.filter(SolutionProject.stage == stage)
    if status_filter:
        query = query.filter(SolutionProject.status == status_filter)

    projects = query.order_by(SolutionProject.created_at.desc()).all()
    return [ProjectResponse.model_validate(p) for p in projects]


@router.get(
    "/{project_id}",
    response_model=ProjectDetailResponse,
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    """Retrieve solution project details, milestones, and collaborating participants."""
    try:
        return get_project_detail(db=db, project_id=project_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post(
    "/{project_id}/participants",
    response_model=ProjectParticipantResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_participant(
    project_id: int,
    data: ProjectParticipantAdd,
    current_user: dict = Depends(require_roles("GOVERNMENT", "UNIVERSITY_MENTOR", "CSR")),
    db: Session = Depends(get_db),
):
    """Add a collaborating stakeholder (mentor, student, government dept, CSR) to a project."""
    try:
        participant = add_project_participant(
            db=db,
            project_id=project_id,
            participant_type=data.participant_type,
            role=data.role,
            user_id=data.user_id,
            organization_id=data.organization_id,
        )
        return ProjectParticipantResponse.model_validate(participant)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch(
    "/{project_id}/stage",
    response_model=ProjectResponse,
)
def update_stage(
    project_id: int,
    data: StageUpdateRequest,
    current_user: dict = Depends(require_roles("GOVERNMENT", "UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """Advance project lifecycle stage (Problem Analysis -> Research -> Prototype -> Pilot -> Deployment -> Impact)."""
    try:
        project = update_project_stage(
            db=db,
            project_id=project_id,
            stage=data.stage,
            user_id=current_user["user_id"],
        )
        return ProjectResponse.model_validate(project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch(
    "/{project_id}/status",
    response_model=ProjectResponse,
)
def update_health_status(
    project_id: int,
    data: ProjectStatusUpdateRequest,
    current_user: dict = Depends(require_roles("GOVERNMENT", "UNIVERSITY_MENTOR", "CSR")),
    db: Session = Depends(get_db),
):
    """Update project health tracking status (ON_TRACK, AT_RISK, DELAYED, TERMINATED, COMPLETED)."""
    try:
        project = update_project_status(
            db=db,
            project_id=project_id,
            status=data.status,
        )
        return ProjectResponse.model_validate(project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/{project_id}/milestones",
    response_model=MilestoneResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_milestone(
    project_id: int,
    data: MilestoneCreate,
    current_user: dict = Depends(require_roles("GOVERNMENT", "UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """Attach deliverable milestones and due dates to a solution project."""
    try:
        milestone = add_project_milestone(
            db=db,
            project_id=project_id,
            title=data.title,
            description=data.description,
            due_date=data.due_date,
        )
        return MilestoneResponse.model_validate(milestone)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch(
    "/{project_id}/milestones/{milestone_id}",
    response_model=MilestoneResponse,
)
def update_milestone(
    project_id: int,
    milestone_id: int,
    status_data: ProjectStatusUpdateRequest,
    current_user: dict = Depends(require_roles("GOVERNMENT", "UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """Update progress or mark completion of a project milestone."""
    try:
        milestone = update_project_milestone(
            db=db,
            milestone_id=milestone_id,
            status=status_data.status,
        )
        return MilestoneResponse.model_validate(milestone)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
