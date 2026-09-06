from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.csr import Corporate, CSRProfile, CSRUser, ProblemCSRMatch
from app.models.report import Report
from app.models.project import SolutionProject, ProjectParticipant
from app.services.notification_service import create_notification
from app.services.workflow_service import transition_report_status


def match_problem_with_csr(
    db: Session,
    report_id: int,
) -> list[ProblemCSRMatch]:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        return []

    csr_profiles = db.query(CSRProfile).filter(CSRProfile.status == "ACTIVE").all()
    created_matches = []

    report_text = f"{report.title} {report.description} {report.category or ''} {report.location or ''}".lower()

    for profile in csr_profiles:
        focus_areas = [f.lower() for f in (profile.focus_areas or [])]
        overlap = [f for f in focus_areas if f in report_text]

        if overlap:
            match_score = min(95.0, 55.0 + len(overlap) * 15.0)
            reason = f"Challenge aligns with CSR focus areas: {', '.join(overlap)}"

            existing = (
                db.query(ProblemCSRMatch)
                .filter(
                    ProblemCSRMatch.report_id == report_id,
                    ProblemCSRMatch.corporate_id == profile.corporate_id,
                )
                .first()
            )
            if not existing:
                match = ProblemCSRMatch(
                    report_id=report_id,
                    corporate_id=profile.corporate_id,
                    csr_id=profile.id,
                    match_score=match_score,
                    matching_reason=reason,
                    status="RECOMMENDED",
                    created_at=datetime.now(timezone.utc),
                )
                db.add(match)
                created_matches.append(match)

                # Notify corporate users
                csr_users = db.query(CSRUser).filter(CSRUser.corporate_id == profile.corporate_id).all()
                for cu in csr_users:
                    create_notification(
                        db=db,
                        recipient_user_id=cu.user_id,
                        type="CSR_MATCH_RECOMMENDED",
                        title="New CSR Challenge Match",
                        message=f"A societal challenge matching your focus areas ({', '.join(overlap)}) is available.",
                        related_entity_type="REPORT",
                        related_entity_id=report_id,
                    )

    db.commit()
    return created_matches


def express_csr_interest(
    db: Session,
    report_id: int,
    corporate_id: int,
    comment: str | None = None,
    user_id: int | None = None,
) -> ProblemCSRMatch:
    match = (
        db.query(ProblemCSRMatch)
        .filter(
            ProblemCSRMatch.report_id == report_id,
            ProblemCSRMatch.corporate_id == corporate_id,
        )
        .first()
    )

    if not match:
        profile = db.query(CSRProfile).filter(CSRProfile.corporate_id == corporate_id).first()
        match = ProblemCSRMatch(
            report_id=report_id,
            corporate_id=corporate_id,
            csr_id=profile.id if profile else None,
            match_score=85.0,
            matching_reason=comment or "Direct CSR interest expressed",
            status="INTERESTED",
            created_at=datetime.now(timezone.utc),
        )
        db.add(match)
    else:
        match.status = "INTERESTED"
        if comment:
            match.matching_reason = (match.matching_reason or "") + f" | Interest note: {comment}"

    db.commit()
    db.refresh(match)
    return match


def allocate_csr_funding(
    db: Session,
    project_id: int,
    corporate_id: int,
    amount: float,
    currency: str = "INR",
    tranche_details: str | None = None,
    terms: str | None = None,
    user_id: int | None = None,
) -> dict:
    project = db.query(SolutionProject).filter(SolutionProject.id == project_id).first()
    if not project:
        raise ValueError("Project not found")

    corp = db.query(Corporate).filter(Corporate.id == corporate_id).first()
    corp_name = corp.company_name if corp else f"Corporate #{corporate_id}"

    # Add or update corporate as participant in the project
    participant = (
        db.query(ProjectParticipant)
        .filter(
            ProjectParticipant.project_id == project_id,
            ProjectParticipant.organization_id == corporate_id,
            ProjectParticipant.participant_type == "CSR",
        )
        .first()
    )
    if not participant:
        participant = ProjectParticipant(
            project_id=project_id,
            organization_id=corporate_id,
            user_id=user_id,
            participant_type="CSR",
            role=f"CSR Funding Partner ({currency} {amount:,.2f})",
            joined_at=datetime.now(timezone.utc),
            status="ACTIVE",
        )
        db.add(participant)
    else:
        participant.role = f"CSR Funding Partner (Committed {currency} {amount:,.2f})"

    # Update match status to FUNDED
    match = (
        db.query(ProblemCSRMatch)
        .filter(
            ProblemCSRMatch.report_id == project.report_id,
            ProblemCSRMatch.corporate_id == corporate_id,
        )
        .first()
    )
    if match:
        match.status = "FUNDED"

    db.commit()
    return {
        "project_id": project_id,
        "corporate_id": corporate_id,
        "amount": amount,
        "currency": currency,
        "status": "COMMITTED",
        "message": f"Successfully allocated {currency} {amount:,.2f} from {corp_name} to project '{project.title}'.",
    }
