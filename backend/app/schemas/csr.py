from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class CorporateCreate(BaseModel):
    company_name: str = Field(min_length=2, max_length=255)
    registration_details: str | None = None
    industry: str | None = None
    headquarters: str | None = None
    locations: list[str] = []
    website: str | None = None
    contact_details: dict | None = None


class CorporateResponse(BaseModel):
    id: int
    company_name: str
    registration_details: str | None = None
    industry: str | None = None
    headquarters: str | None = None
    locations: list[str] | None = None
    website: str | None = None
    contact_details: dict | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CSRProfileCreate(BaseModel):
    focus_areas: list[str] = []
    geographic_preferences: list[str] = []
    funding_range: dict | None = None
    preferred_problem_types: list[str] = []
    preferred_project_stages: list[str] = []
    eligibility_criteria: str | None = None


class CSRProfileResponse(BaseModel):
    id: int
    corporate_id: int
    company_name: str | None = None
    focus_areas: list[str] | None = None
    geographic_preferences: list[str] | None = None
    funding_range: dict | None = None
    preferred_problem_types: list[str] | None = None
    preferred_project_stages: list[str] | None = None
    eligibility_criteria: str | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CSRInterestRequest(BaseModel):
    comment: str | None = None


class CSRFundingRequest(BaseModel):
    amount: float = Field(gt=0)
    currency: str = "INR"
    tranche_details: str | None = None
    terms: str | None = None


class CSRFundingResponse(BaseModel):
    project_id: int
    corporate_id: int
    amount: float
    currency: str
    status: str
    message: str


class ProblemCSRMatchResponse(BaseModel):
    id: int
    report_id: int
    corporate_id: int
    csr_id: int | None = None
    match_score: float
    matching_reason: str | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
