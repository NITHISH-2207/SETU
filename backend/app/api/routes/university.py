from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.university import (
    University,
    UniversityDepartment,
    UniversityMentor,
    UniversityStudent,
    UniversityTeam,
    ProblemUniversityMatch,
)
from app.models.report import Report
from app.models.ai_analysis import AIAnalysis
from app.api.dependencies import get_current_user, require_roles
from app.schemas.university import (
    UniversityProfileResponse,
    MatchResponse,
    ExpressionOfInterestRequest,
    MentorResponse,
    StudentResponse,
    UniversityTeamCreate,
    UniversityTeamResponse,
    TeamMemberAdd,
    TeamAssignRequest,
)
from app.schemas.report import ReportDetailResponse
from app.services.university_service import (
    match_problem_with_universities,
    express_university_interest,
    create_university_team,
    add_team_member,
)
from app.services.report_service import get_report_detail
from app.services.workflow_service import transition_report_status

router = APIRouter(
    prefix="/api/v1/university",
    tags=["University"],
)


@router.get(
    "/profile",
    response_model=UniversityProfileResponse,
)
def get_profile(
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR", "UNIVERSITY_STUDENT")),
    db: Session = Depends(get_db),
):
    """Retrieve university mentor or student profile."""
    user_id = current_user["user_id"]
    role = current_user["role"]

    if role == "UNIVERSITY_MENTOR":
        mentor = db.query(UniversityMentor).filter(UniversityMentor.user_id == user_id).first()
        if not mentor:
            raise HTTPException(status_code=404, detail="Mentor profile not found")
        uni = db.query(University).filter(University.id == mentor.university_id).first()
        dept = db.query(UniversityDepartment).filter(UniversityDepartment.id == mentor.department_id).first() if mentor.department_id else None
        return UniversityProfileResponse(
            user_id=user_id,
            role=role,
            profile_id=mentor.id,
            university_id=mentor.university_id,
            university_name=uni.name if uni else "University",
            department_id=mentor.department_id,
            department_name=dept.name if dept else None,
            name=mentor.name,
            designation_or_year=mentor.designation,
            domains=mentor.domains,
        )
    else:
        student = db.query(UniversityStudent).filter(UniversityStudent.user_id == user_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        uni = db.query(University).filter(University.id == student.university_id).first()
        dept = db.query(UniversityDepartment).filter(UniversityDepartment.id == student.department_id).first() if student.department_id else None
        return UniversityProfileResponse(
            user_id=user_id,
            role=role,
            profile_id=student.id,
            university_id=student.university_id,
            university_name=uni.name if uni else "University",
            department_id=student.department_id,
            department_name=dept.name if dept else None,
            name=student.name,
            designation_or_year=student.year,
            domains=student.domains,
        )


@router.get(
    "/problems",
    response_model=list[MatchResponse],
)
def get_matched_problems(
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR", "UNIVERSITY_STUDENT")),
    db: Session = Depends(get_db),
):
    """List problem challenges matched with or invited to the user's university."""
    user_id = current_user["user_id"]
    uni_id = None
    if current_user["role"] == "UNIVERSITY_MENTOR":
        m = db.query(UniversityMentor).filter(UniversityMentor.user_id == user_id).first()
        uni_id = m.university_id if m else None
    else:
        s = db.query(UniversityStudent).filter(UniversityStudent.user_id == user_id).first()
        uni_id = s.university_id if s else None

    if not uni_id:
        return []

    matches = (
        db.query(ProblemUniversityMatch)
        .filter(ProblemUniversityMatch.university_id == uni_id)
        .order_by(ProblemUniversityMatch.created_at.desc())
        .all()
    )
    return [MatchResponse.model_validate(m) for m in matches]


@router.get(
    "/problems/recommended",
    response_model=list[MatchResponse],
)
def get_recommended_problems(
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """List recommended research challenges matched to the mentor's specific domains."""
    mentor = db.query(UniversityMentor).filter(UniversityMentor.user_id == current_user["user_id"]).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    # Run matching for any open research-needed reports
    research_reports = (
        db.query(Report)
        .join(AIAnalysis, AIAnalysis.report_id == Report.id)
        .filter(AIAnalysis.research_classification == "RESEARCH_NEEDED")
        .all()
    )
    for rep in research_reports:
        match_problem_with_universities(db, rep.id)

    matches = (
        db.query(ProblemUniversityMatch)
        .filter(
            ProblemUniversityMatch.university_id == mentor.university_id,
            ProblemUniversityMatch.mentor_id == mentor.id,
        )
        .order_by(ProblemUniversityMatch.match_score.desc())
        .all()
    )
    return [MatchResponse.model_validate(m) for m in matches]


@router.get(
    "/problems/{report_id}",
    response_model=ReportDetailResponse,
)
def get_problem_details(
    report_id: int,
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR", "UNIVERSITY_STUDENT")),
    db: Session = Depends(get_db),
):
    """View societal problem details for university feasibility assessment."""
    try:
        return get_report_detail(db, report_id, citizen_id=None)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post(
    "/problems/{report_id}/interest",
    response_model=MatchResponse,
)
def express_interest(
    report_id: int,
    interest_data: ExpressionOfInterestRequest,
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """University mentor expresses research interest on behalf of their institution."""
    mentor = db.query(UniversityMentor).filter(UniversityMentor.user_id == current_user["user_id"]).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    match = express_university_interest(
        db=db,
        report_id=report_id,
        university_id=mentor.university_id,
        mentor_id=mentor.id,
        department_id=mentor.department_id,
        comment=interest_data.comment,
        user_id=mentor.user_id,
    )
    return MatchResponse.model_validate(match)


@router.get(
    "/mentors",
    response_model=list[MentorResponse],
)
def list_mentors(
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR", "UNIVERSITY_STUDENT")),
    db: Session = Depends(get_db),
):
    """List available mentors within the authenticated user's university."""
    user_id = current_user["user_id"]
    uni_id = None
    if current_user["role"] == "UNIVERSITY_MENTOR":
        m = db.query(UniversityMentor).filter(UniversityMentor.user_id == user_id).first()
        uni_id = m.university_id if m else None
    else:
        s = db.query(UniversityStudent).filter(UniversityStudent.user_id == user_id).first()
        uni_id = s.university_id if s else None

    if not uni_id:
        return []

    mentors = db.query(UniversityMentor).filter(UniversityMentor.university_id == uni_id).all()
    return [MentorResponse.model_validate(m) for m in mentors]


@router.get(
    "/students",
    response_model=list[StudentResponse],
)
def list_students(
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """List students within the mentor's university for project formation."""
    mentor = db.query(UniversityMentor).filter(UniversityMentor.user_id == current_user["user_id"]).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    students = db.query(UniversityStudent).filter(UniversityStudent.university_id == mentor.university_id).all()
    return [StudentResponse.model_validate(s) for s in students]


@router.post(
    "/teams",
    response_model=UniversityTeamResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_team(
    team_data: UniversityTeamCreate,
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """Form a new student-mentor university project team."""
    mentor = db.query(UniversityMentor).filter(UniversityMentor.user_id == current_user["user_id"]).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    team = create_university_team(
        db=db,
        university_id=mentor.university_id,
        created_by=mentor.user_id,
        name=team_data.name,
        description=team_data.description,
    )
    return UniversityTeamResponse.model_validate(team)


@router.post(
    "/teams/{team_id}/members",
    status_code=status.HTTP_201_CREATED,
)
def add_member(
    team_id: int,
    member_data: TeamMemberAdd,
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """Add a student member to an existing university team."""
    team = db.query(UniversityTeam).filter(UniversityTeam.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    member = add_team_member(
        db=db,
        team_id=team_id,
        student_id=member_data.student_id,
        role=member_data.role,
    )
    return {"message": "Team member added successfully", "member_id": member.id}


@router.post(
    "/problems/{report_id}/assign",
)
def assign_team_to_problem(
    report_id: int,
    assign_data: TeamAssignRequest,
    current_user: dict = Depends(require_roles("UNIVERSITY_MENTOR")),
    db: Session = Depends(get_db),
):
    """Assign an authorized university team to tackle a matched societal challenge."""
    team = db.query(UniversityTeam).filter(UniversityTeam.id == assign_data.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    transition_report_status(
        db=db,
        report_id=report_id,
        new_status="SOLUTION_DEVELOPMENT",
        actor_user_id=current_user["user_id"],
        actor_type="UNIVERSITY",
        comment=f"University Team '{team.name}' assigned to work on problem.",
    )

    return {"message": f"Team '{team.name}' assigned to report {report_id}"}
