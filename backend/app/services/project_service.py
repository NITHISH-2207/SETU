from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.project import SolutionProject, ProjectParticipant, ProjectMilestone
from app.models.report import Report
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectParticipantResponse,
    MilestoneResponse,
)
from app.services.workflow_service import transition_report_status


def create_solution_project(
    db: Session,
    data: ProjectCreate,
    created_by_user_id: int | None = None,
) -> SolutionProject:
    report = db.query(Report).filter(Report.id == data.report_id).first()
    if not report:
        raise ValueError("Report not found")

    now = datetime.now(timezone.utc)
    project = SolutionProject(
        report_id=data.report_id,
        title=data.title,
        description=data.description,
        objective=data.objective,
        stage="PROBLEM_ANALYSIS",
        status="ON_TRACK",
        created_at=now,
        updated_at=now,
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Add creator as initial participant if user_id provided
    if created_by_user_id:
        participant = ProjectParticipant(
            project_id=project.id,
            user_id=created_by_user_id,
            participant_type="MENTOR",
            role="Project Initiator",
            joined_at=now,
            status="ACTIVE",
        )
        db.add(participant)
        db.commit()

    # Update report status to SOLUTION_DEVELOPMENT
    transition_report_status(
        db=db,
        report_id=report.id,
        new_status="SOLUTION_DEVELOPMENT",
        actor_user_id=created_by_user_id,
        actor_type="UNIVERSITY",
        comment=f"Solution Project '{project.title}' initialized.",
    )

    return project


def get_project_detail(
    db: Session,
    project_id: int,
) -> ProjectDetailResponse:
    project = db.query(SolutionProject).filter(SolutionProject.id == project_id).first()
    if not project:
        raise ValueError(f"Project {project_id} not found")

    participants = (
        db.query(ProjectParticipant)
        .filter(ProjectParticipant.project_id == project.id)
        .order_by(ProjectParticipant.joined_at.asc())
        .all()
    )
    participant_schemas = [
        ProjectParticipantResponse.model_validate(p) for p in participants
    ]

    milestones = (
        db.query(ProjectMilestone)
        .filter(ProjectMilestone.project_id == project.id)
        .order_by(ProjectMilestone.id.asc())
        .all()
    )
    milestone_schemas = [
        MilestoneResponse.model_validate(m) for m in milestones
    ]

    return ProjectDetailResponse(
        id=project.id,
        report_id=project.report_id,
        title=project.title,
        description=project.description,
        objective=project.objective,
        stage=project.stage,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
        participants=participant_schemas,
        milestones=milestone_schemas,
    )


def add_project_participant(
    db: Session,
    project_id: int,
    participant_type: str,
    role: str,
    user_id: int | None = None,
    organization_id: int | None = None,
) -> ProjectParticipant:
    project = db.query(SolutionProject).filter(SolutionProject.id == project_id).first()
    if not project:
        raise ValueError("Project not found")

    participant = ProjectParticipant(
        project_id=project_id,
        user_id=user_id,
        organization_id=organization_id,
        participant_type=participant_type,
        role=role,
        joined_at=datetime.now(timezone.utc),
        status="ACTIVE",
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant


def update_project_stage(
    db: Session,
    project_id: int,
    stage: str,
    user_id: int | None = None,
) -> SolutionProject:
    project = db.query(SolutionProject).filter(SolutionProject.id == project_id).first()
    if not project:
        raise ValueError("Project not found")

    project.stage = stage
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(project)

    # Sync report status if relevant
    if stage in ["PILOT", "IMPLEMENTATION"]:
        transition_report_status(
            db=db,
            report_id=project.report_id,
            new_status=stage,
            actor_user_id=user_id,
            actor_type="UNIVERSITY",
            comment=f"Project advanced to {stage} stage.",
        )

    return project


def update_project_status(
    db: Session,
    project_id: int,
    status: str,
) -> SolutionProject:
    project = db.query(SolutionProject).filter(SolutionProject.id == project_id).first()
    if not project:
        raise ValueError("Project not found")

    project.status = status
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(project)
    return project


def add_project_milestone(
    db: Session,
    project_id: int,
    title: str,
    description: str | None = None,
    due_date: datetime | None = None,
) -> ProjectMilestone:
    project = db.query(SolutionProject).filter(SolutionProject.id == project_id).first()
    if not project:
        raise ValueError("Project not found")

    milestone = ProjectMilestone(
        project_id=project_id,
        title=title,
        description=description,
        due_date=due_date,
        status="PENDING",
    )
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone


def update_project_milestone(
    db: Session,
    milestone_id: int,
    status: str,
) -> ProjectMilestone:
    milestone = db.query(ProjectMilestone).filter(ProjectMilestone.id == milestone_id).first()
    if not milestone:
        raise ValueError("Milestone not found")

    milestone.status = status
    if status == "COMPLETED":
        milestone.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(milestone)
    return milestone
