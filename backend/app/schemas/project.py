from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    report_id: int
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=10)
    objective: str | None = None


class ProjectParticipantAdd(BaseModel):
    user_id: int | None = None
    organization_id: int | None = None
    participant_type: str = Field(..., pattern="^(CITIZEN|GOVERNMENT|MENTOR|STUDENT|CSR|ORGANIZATION)$")
    role: str = Field(min_length=2, max_length=100)


class ProjectParticipantResponse(BaseModel):
    id: int
    project_id: int
    user_id: int | None = None
    organization_id: int | None = None
    participant_type: str
    role: str
    joined_at: datetime
    status: str

    model_config = ConfigDict(from_attributes=True)


class MilestoneCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str | None = None
    due_date: datetime | None = None


class MilestoneResponse(BaseModel):
    id: int
    project_id: int
    title: str
    description: str | None = None
    due_date: datetime | None = None
    completed_at: datetime | None = None
    status: str

    model_config = ConfigDict(from_attributes=True)


class ProjectResponse(BaseModel):
    id: int
    report_id: int
    title: str
    description: str
    objective: str | None = None
    stage: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectDetailResponse(BaseModel):
    id: int
    report_id: int
    title: str
    description: str
    objective: str | None = None
    stage: str
    status: str
    created_at: datetime
    updated_at: datetime
    participants: list[ProjectParticipantResponse] = []
    milestones: list[MilestoneResponse] = []

    model_config = ConfigDict(from_attributes=True)


class StageUpdateRequest(BaseModel):
    stage: str = Field(..., pattern="^(PROBLEM_ANALYSIS|SOLUTION_PROPOSAL|RESEARCH|PROTOTYPE|PILOT|IMPLEMENTATION|DEPLOYMENT|IMPACT_MEASUREMENT|COMPLETED)$")


class ProjectStatusUpdateRequest(BaseModel):
    status: str = Field(..., pattern="^(ON_TRACK|AT_RISK|DELAYED|TERMINATED|COMPLETED)$")
