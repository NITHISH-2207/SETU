from pydantic import BaseModel, Field


class CitizenSignupRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    mobile_number: str = Field(min_length=10, max_length=15)
    email: str | None = None


class OTPRequest(BaseModel):
    mobile_number: str | None = Field(default=None, min_length=10, max_length=15)
    identifier: str | None = Field(default=None, max_length=255)


class OTPResponse(BaseModel):
    message: str
    development_otp: str | None = None


class OTPVerifyRequest(BaseModel):
    mobile_number: str | None = Field(default=None, min_length=10, max_length=15)
    identifier: str | None = Field(default=None, max_length=255)
    otp: str = Field(min_length=6, max_length=6)


class OTPVerifyResponse(BaseModel):
    message: str
    user_id: int
    citizen_id: int
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=6, max_length=100)


class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str


class StakeholderRegisterRequest(BaseModel):
    role: str = Field(..., pattern="^(GOVERNMENT|UNIVERSITY_MENTOR|UNIVERSITY_STUDENT|CSR)$")
    full_name: str = Field(min_length=2, max_length=150)
    mobile_number: str = Field(min_length=10, max_length=15)
    email: str
    password: str = Field(min_length=6, max_length=100)
    organization_id: int | None = None
    department_id: int | None = None
    designation: str | None = None