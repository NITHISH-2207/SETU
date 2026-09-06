from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.university import (
    University,
    UniversityDepartment,
    UniversityMentor,
    UniversityStudent,
    UniversityTeam,
    UniversityTeamMember,
    UniversityTeamMentor,
    ProblemUniversityMatch,
)
from app.models.report import Report
from app.models.ai_analysis import AIAnalysis
from app.services.notification_service import create_notification
from app.services.workflow_service import transition_report_status


def match_problem_with_universities(
    db: Session,
    report_id: int,
) -> list[ProblemUniversityMatch]:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        return []

    ai_record = db.query(AIAnalysis).filter(AIAnalysis.report_id == report_id).first()
    # Match complex/research-needed problems
    if ai_record and ai_record.research_classification != "RESEARCH_NEEDED":
        return []

    # Find mentors with overlapping domains
    mentors = db.query(UniversityMentor).filter(UniversityMentor.availability == "AVAILABLE").all()
    created_matches = []

    report_text = f"{report.title} {report.description} {report.category or ''}".lower()

    for mentor in mentors:
        mentor_domains = [d.lower() for d in (mentor.domains or [])]
        overlap = [d for d in mentor_domains if d in report_text]

        if overlap:
            match_score = min(95.0, 50.0 + len(overlap) * 15.0)
            reason = f"Mentor {mentor.name} has relevant expertise in: {', '.join(overlap)}"

            # Check if match already exists
            existing = (
                db.query(ProblemUniversityMatch)
                .filter(
                    ProblemUniversityMatch.report_id == report_id,
                    ProblemUniversityMatch.university_id == mentor.university_id,
                    ProblemUniversityMatch.mentor_id == mentor.id,
                )
                .first()
            )
            if not existing:
                match = ProblemUniversityMatch(
                    report_id=report_id,
                    university_id=mentor.university_id,
                    mentor_id=mentor.id,
                    department_id=mentor.department_id,
                    match_score=match_score,
                    matching_reason=reason,
                    status="RECOMMENDED",
                    created_at=datetime.now(timezone.utc),
                )
                db.add(match)
                created_matches.append(match)

                # Notify mentor
                create_notification(
                    db=db,
                    recipient_user_id=mentor.user_id,
                    type="PROBLEM_MATCHED",
                    title="New Research Challenge Matched",
                    message=f"Challenge '{report.title}' matches your expertise in {', '.join(overlap)}.",
                    related_entity_type="REPORT",
                    related_entity_id=report_id,
                )

    db.commit()
    return created_matches


def express_university_interest(
    db: Session,
    report_id: int,
    university_id: int,
    mentor_id: int | None = None,
    department_id: int | None = None,
    comment: str | None = None,
    user_id: int | None = None,
) -> ProblemUniversityMatch:
    match = (
        db.query(ProblemUniversityMatch)
        .filter(
            ProblemUniversityMatch.report_id == report_id,
            ProblemUniversityMatch.university_id == university_id,
        )
        .first()
    )

    if not match:
        match = ProblemUniversityMatch(
            report_id=report_id,
            university_id=university_id,
            mentor_id=mentor_id,
            department_id=department_id,
            match_score=80.0,
            matching_reason=comment or "University expressed direct research interest",
            status="ACCEPTED",
            created_at=datetime.now(timezone.utc),
        )
        db.add(match)
    else:
        match.status = "ACCEPTED"
        if comment:
            match.matching_reason = (match.matching_reason or "") + f" | Interest confirmed: {comment}"

    transition_report_status(
        db=db,
        report_id=report_id,
        new_status="ACADEMIC_REVIEW",
        actor_user_id=user_id,
        actor_type="UNIVERSITY",
        comment=f"University ID {university_id} expressed interest in collaborative research.",
    )

    db.commit()
    db.refresh(match)
    return match


def create_university_team(
    db: Session,
    university_id: int,
    created_by: int,
    name: str,
    description: str | None = None,
) -> UniversityTeam:
    team = UniversityTeam(
        university_id=university_id,
        name=name,
        description=description,
        created_by=created_by,
        status="ACTIVE",
        created_at=datetime.now(timezone.utc),
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


def add_team_member(
    db: Session,
    team_id: int,
    student_id: int,
    role: str = "MEMBER",
) -> UniversityTeamMember:
    member = UniversityTeamMember(
        team_id=team_id,
        student_id=student_id,
        role=role,
        joined_at=datetime.now(timezone.utc),
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def assign_team_mentor(
    db: Session,
    team_id: int,
    mentor_id: int,
    role: str = "LEAD_MENTOR",
) -> UniversityTeamMentor:
    team_mentor = UniversityTeamMentor(
        team_id=team_id,
        mentor_id=mentor_id,
        role=role,
        assigned_at=datetime.now(timezone.utc),
    )
    db.add(team_mentor)
    db.commit()
    db.refresh(team_mentor)
    return team_mentor
