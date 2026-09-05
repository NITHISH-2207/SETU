from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class StatusUpdateRequest(BaseModel):
    new_status: str = Field(min_length=2, max_length=50)
    comment: str | None = None


class ReportStatusHistoryResponse(BaseModel):
    id: int
    report_id: int
    previous_status: str | None = None
    new_status: str
    changed_by: int | None = None
    actor_type: str
    comment: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportHistoryResponse(BaseModel):
    id: int
    report_id: int
    changed_by: int | None = None
    actor_type: str
    action: str
    previous_value: dict | None = None
    new_value: dict | None = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportSupportResponse(BaseModel):
    report_id: int
    supported: bool
    total_supports: int


class ResolutionCreate(BaseModel):
    solution_details: str = Field(min_length=10)
    evidence: dict | None = None


class ResolutionResponse(BaseModel):
    id: int
    report_id: int
    solution_details: str
    resolution_status: str
    submitted_by: int
    submitted_at: datetime
    verified_by: int | None = None
    verified_at: datetime | None = None
    evidence: dict | None = None

    model_config = ConfigDict(from_attributes=True)


class AppealCreate(BaseModel):
    reason: str = Field(min_length=3, max_length=255)
    message: str = Field(min_length=10)


class AppealResponse(BaseModel):
    id: int
    report_id: int
    citizen_id: int
    reason: str
    message: str
    status: str
    created_at: datetime
    updated_at: datetime
    resolved_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
