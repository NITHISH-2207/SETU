from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class UniversityCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    code: str = Field(min_length=2, max_length=50)
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str = "India"
    contact_details: dict | None = None


class UniversityResponse(BaseModel):
    id: int
    name: str
    code: str
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str
    contact_details: dict | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UniversityDeptCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    code: str | None = None
    description: str | None = None


class UniversityDeptResponse(BaseModel):
    id: int
    university_id: int
    name: str
    code: str | None = None
    description: str | None = None
    status: str

    model_config = ConfigDict(from_attributes=True)


class MentorCreate(BaseModel):
    user_id: int
    university_id: int
    department_id: int | None = None
    name: str = Field(min_length=2, max_length=150)
    designation: str = Field(min_length=2, max_length=100)
    domains: list[str] = []
    expertise: str | None = None
    experience: str | None = None
    interests: list[str] = []


class MentorResponse(BaseModel):
    id: int
    user_id: int
    university_id: int
    department_id: int | None = None
    name: str
    designation: str
    domains: list[str] | None = None
    expertise: str | None = None
    experience: str | None = None
    interests: list[str] | None = None
    availability: str
    profile_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StudentCreate(BaseModel):
    user_id: int
    university_id: int
    department_id: int | None = None
    name: str = Field(min_length=2, max_length=150)
    year: str | None = None
    skills: list[str] = []
    domains: list[str] = []
    interests: list[str] = []


class StudentResponse(BaseModel):
    id: int
    user_id: int
    university_id: int
    department_id: int | None = None
    name: str
    year: str | None = None
    skills: list[str] | None = None
    domains: list[str] | None = None
    interests: list[str] | None = None
    availability: str
    profile_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UniversityTeamCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    description: str | None = None


class TeamMemberAdd(BaseModel):
    student_id: int
    role: str = "MEMBER"


class TeamMentorAssign(BaseModel):
    mentor_id: int
    role: str = "LEAD_MENTOR"


class UniversityTeamResponse(BaseModel):
    id: int
    university_id: int
    name: str
    description: str | None = None
    created_by: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MatchResponse(BaseModel):
    id: int
    report_id: int
    university_id: int
    mentor_id: int | None = None
    department_id: int | None = None
    match_score: float
    matching_reason: str | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExpressionOfInterestRequest(BaseModel):
    mentor_id: int | None = None
    department_id: int | None = None
    comment: str | None = None


class TeamAssignRequest(BaseModel):
    team_id: int


class UniversityProfileResponse(BaseModel):
    user_id: int
    role: str
    profile_id: int
    university_id: int
    university_name: str
    department_id: int | None = None
    department_name: str | None = None
    name: str
    designation_or_year: str | None = None
    domains: list[str] | None = None

    model_config = ConfigDict(from_attributes=True)
