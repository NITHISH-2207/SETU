from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.ai import AIAnalysisResponse
from app.schemas.attachment import AttachmentResponse
from app.schemas.workflow import ReportStatusHistoryResponse, ResolutionResponse


class GovernmentOrgCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    level: str = Field(..., pattern="^(CENTRAL|STATE|DISTRICT|LOCAL)$")
    state: str | None = None
    district: str | None = None
    address: str | None = None
    contact_details: dict | None = None


class GovernmentOrgResponse(BaseModel):
    id: int
    name: str
    level: str
    state: str | None = None
    district: str | None = None
    address: str | None = None
    contact_details: dict | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GovernmentDeptCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    description: str | None = None
    jurisdiction: str | None = None


class GovernmentDeptResponse(BaseModel):
    id: int
    government_id: int
    name: str
    description: str | None = None
    jurisdiction: str | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GovernmentProfileResponse(BaseModel):
    user_id: int
    government_user_id: int
    government_id: int
    department_id: int | None = None
    organization_name: str
    department_name: str | None = None
    level: str
    state: str | None = None
    district: str | None = None
    designation: str
    permissions: list | None = None

    model_config = ConfigDict(from_attributes=True)


class GovernmentReportItem(BaseModel):
    id: int
    title: str
    description: str
    category: str | None = None
    location: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    status: str
    created_at: datetime
    updated_at: datetime
    severity_score: float | None = None
    urgency_score: float | None = None
    research_classification: str | None = None

    model_config = ConfigDict(from_attributes=True)


class GovernmentReportListResponse(BaseModel):
    reports: list[GovernmentReportItem]
    page: int
    limit: int
    total: int


class GovernmentReportDetailResponse(BaseModel):
    id: int
    citizen_id: int
    title: str
    description: str
    language: str | None = None
    category: str | None = None
    location: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location_source: str | None = None
    submission_source: str
    status: str
    created_at: datetime
    updated_at: datetime

    ai_analysis: AIAnalysisResponse | None = None
    attachments: list[AttachmentResponse] = []
    status_history: list[ReportStatusHistoryResponse] = []
    resolutions: list[ResolutionResponse] = []
    community_support_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class GovernmentRemarkRequest(BaseModel):
    remark: str = Field(min_length=3)
    new_status: str | None = None


class GovernmentResolveRequest(BaseModel):
    solution_details: str = Field(min_length=10)
    evidence: dict | None = None
