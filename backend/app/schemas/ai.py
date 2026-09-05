from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AIAnalysisResponse(BaseModel):
    id: int
    report_id: int
    title_generated: str | None = None
    category_predicted: str | None = None
    category_confidence: float | None = None
    severity_score: float
    severity_factors: dict | None = None
    urgency_score: float
    confidence_score: float
    duplicate_detected: bool
    duplicate_report_ids: list[int] | None = None
    research_classification: str
    research_confidence: float
    location_interpretation: str | None = None
    verification_required: bool
    model_version: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
