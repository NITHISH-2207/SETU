from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.attachment import AttachmentResponse
from app.schemas.ai import AIAnalysisResponse
from app.schemas.workflow import (
    ReportStatusHistoryResponse,
    ResolutionResponse,
    AppealResponse,
)


class ReportCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=10)
    language: str | None = Field(default=None, max_length=20)
    category: str | None = Field(default=None, max_length=100)

    location: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)

    location_source: str | None = Field(
        default="CITIZEN_PROVIDED",  # GPS_CONFIRMED, CITIZEN_PROVIDED, GEOCODED_ESTIMATE
        max_length=30,
    )

    submission_source: str = Field(
        default="WEB",  # WEB, SMS, FUTURE_CHANNEL
        max_length=30,
    )


class ReportResponse(BaseModel):
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

    model_config = ConfigDict(from_attributes=True)


class CitizenReportItem(BaseModel):
    id: int
    citizen_id: int
    title: str
    description: str
    category: str | None = None
    location: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location_source: str | None = None
    submission_source: str
    status: str
    created_at: datetime
    updated_at: datetime
    latest_update: str | None = None
    resolution_status: str | None = None
    community_support_count: int = 0
    appeal_status: str | None = None

    model_config = ConfigDict(from_attributes=True)


class CitizenReportListResponse(BaseModel):
    reports: list[CitizenReportItem]
    page: int
    limit: int
    total: int


class ReportDetailResponse(BaseModel):
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

    community_support_count: int = 0
    is_supported_by_user: bool = False

    attachments: list[AttachmentResponse] = []
    ai_analysis: AIAnalysisResponse | None = None
    status_history: list[ReportStatusHistoryResponse] = []
    resolution: ResolutionResponse | None = None
    appeal: AppealResponse | None = None

    model_config = ConfigDict(from_attributes=True)