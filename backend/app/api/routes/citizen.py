from datetime import datetime, timezone
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    UploadFile,
    File,
    status,
)
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.citizen import Citizen
from app.schemas.auth import (
    CitizenSignupRequest,
    OTPRequest,
    OTPResponse,
    OTPVerifyRequest,
    OTPVerifyResponse,
)
from app.schemas.report import (
    ReportCreate,
    ReportResponse,
    CitizenReportListResponse,
    ReportDetailResponse,
)
from app.schemas.attachment import AttachmentResponse
from app.schemas.workflow import (
    ReportSupportResponse,
    ResolutionResponse,
    AppealCreate,
    AppealResponse,
)
from app.services.otp_service import create_otp
from app.services.otp_verification_service import verify_otp_code
from app.core.security import create_access_token
from app.api.dependencies import get_current_user, get_current_citizen
from app.services.report_service import (
    create_report,
    list_citizen_reports,
    get_report_detail,
)
from app.services.cloudinary_service import upload_attachment
from app.services.support_service import (
    support_report,
    unsupport_report,
    get_support_count,
)
from app.services.workflow_service import accept_resolution, submit_appeal

router = APIRouter(
    prefix="/api/v1/citizen",
    tags=["Citizen"],
)


@router.post(
    "/auth/signup",
    response_model=OTPResponse,
    status_code=status.HTTP_201_CREATED,
)
def citizen_signup(
    signup_data: CitizenSignupRequest,
    db: Session = Depends(get_db),
):
    """Register a new citizen account and issue verification OTP."""
    existing_user = (
        db.query(User)
        .filter(User.mobile_number == signup_data.mobile_number)
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered. Please request OTP to log in.",
        )

    now = datetime.now(timezone.utc)
    user = User(
        role="CITIZEN",
        mobile_number=signup_data.mobile_number,
        email=str(signup_data.email) if signup_data.email else None,
        account_status="ACTIVE",
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    citizen = Citizen(
        user_id=user.id,
        full_name=signup_data.full_name,
        mobile_number=signup_data.mobile_number,
        email=str(signup_data.email) if signup_data.email else None,
        mobile_verified=False,
        email_verified=False,
        created_at=now,
        updated_at=now,
    )
    db.add(citizen)
    db.commit()
    db.refresh(citizen)

    otp = create_otp(
        db=db,
        identifier=signup_data.mobile_number,
        user_id=user.id,
        otp_type="MOBILE",
    )

    return OTPResponse(
        message="Citizen account registered successfully. OTP sent.",
        development_otp=otp,
    )


@router.post(
    "/auth/request-otp",
    response_model=OTPResponse,
)
def request_otp(
    otp_request: OTPRequest,
    db: Session = Depends(get_db),
):
    """Request login/verification OTP via mobile number or email."""
    identifier = otp_request.mobile_number or otp_request.identifier
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number or identifier is required",
        )

    citizen = (
        db.query(Citizen)
        .filter(
            (Citizen.mobile_number == identifier)
            | (Citizen.email == identifier)
        )
        .first()
    )

    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen account not found",
        )

    otp_type = "EMAIL" if "@" in identifier else "MOBILE"
    otp = create_otp(
        db=db,
        identifier=identifier,
        user_id=citizen.user_id,
        otp_type=otp_type,
    )

    return OTPResponse(
        message="OTP generated successfully",
        development_otp=otp,
    )


@router.post(
    "/auth/verify-otp",
    response_model=OTPVerifyResponse,
)
def verify_otp(
    otp_request: OTPVerifyRequest,
    db: Session = Depends(get_db),
):
    """Verify OTP and issue JWT access token."""
    identifier = otp_request.mobile_number or otp_request.identifier
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number or identifier is required",
        )

    try:
        otp_record = verify_otp_code(
            db=db,
            identifier=identifier,
            otp_code=otp_request.otp,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    citizen = (
        db.query(Citizen)
        .filter(Citizen.user_id == otp_record.user_id)
        .first()
    )

    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen profile not found",
        )

    if otp_record.type == "MOBILE":
        citizen.mobile_verified = True
    elif otp_record.type == "EMAIL":
        citizen.email_verified = True
    db.commit()

    access_token = create_access_token(
        user_id=otp_record.user_id,
        role="CITIZEN",
    )

    return OTPVerifyResponse(
        message="OTP verified successfully",
        user_id=otp_record.user_id,
        citizen_id=citizen.id,
        access_token=access_token,
    )


@router.post(
    "/reports",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_report(
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """Submit a societal problem report as an authenticated citizen."""
    return create_report(
        db=db,
        report_data=report_data,
        citizen_id=citizen.id,
    )


@router.get(
    "/reports",
    response_model=CitizenReportListResponse,
)
def get_my_reports(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    category: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    sort_by: str = Query(default="created_at_desc"),
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """List citizen's own submitted reports with pagination and filtering."""
    items, total = list_citizen_reports(
        db=db,
        citizen_id=citizen.id,
        page=page,
        limit=limit,
        category=category,
        status=status_filter,
        sort_by=sort_by,
    )
    return CitizenReportListResponse(
        reports=items,
        page=page,
        limit=limit,
        total=total,
    )


@router.get(
    "/reports/{report_id}",
    response_model=ReportDetailResponse,
)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """Retrieve full details of citizen's own report (strictly isolated)."""
    try:
        return get_report_detail(
            db=db,
            report_id=report_id,
            citizen_id=citizen.id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post(
    "/reports/{report_id}/attachments",
    response_model=AttachmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_report_media(
    report_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """Upload media attachment for citizen's own report."""
    try:
        # Verify ownership
        get_report_detail(db=db, report_id=report_id, citizen_id=citizen.id)
        attachment = await upload_attachment(db=db, report_id=report_id, file=file)
        return AttachmentResponse(
            id=attachment.id,
            report_id=attachment.report_id,
            type=attachment.type,
            file_url=attachment.file_url,
            storage_key=attachment.storage_key,
            cloudinary_public_id=attachment.cloudinary_public_id,
            cloudinary_resource_type=attachment.cloudinary_resource_type,
            metadata=attachment.file_metadata,
            uploaded_at=attachment.uploaded_at,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/reports/{report_id}/support",
    response_model=ReportSupportResponse,
)
def add_support(
    report_id: int,
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """Add community support signal to a report."""
    try:
        supported, total = support_report(
            db=db,
            report_id=report_id,
            citizen_id=citizen.id,
        )
        return ReportSupportResponse(
            report_id=report_id,
            supported=supported,
            total_supports=total,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/reports/{report_id}/support",
    response_model=ReportSupportResponse,
)
def remove_support(
    report_id: int,
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """Remove community support signal from a report."""
    supported, total = unsupport_report(
        db=db,
        report_id=report_id,
        citizen_id=citizen.id,
    )
    return ReportSupportResponse(
        report_id=report_id,
        supported=supported,
        total_supports=total,
    )


@router.post(
    "/reports/{report_id}/resolve/accept",
    response_model=ResolutionResponse,
)
def accept_report_resolution(
    report_id: int,
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """Accept the proposed resolution for citizen's own report."""
    try:
        res = accept_resolution(
            db=db,
            report_id=report_id,
            citizen_id=citizen.id,
        )
        return ResolutionResponse.model_validate(res)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/reports/{report_id}/appeal",
    response_model=AppealResponse,
    status_code=status.HTTP_201_CREATED,
)
def file_report_appeal(
    report_id: int,
    appeal_data: AppealCreate,
    db: Session = Depends(get_db),
    citizen: Citizen = Depends(get_current_citizen),
):
    """Appeal the resolution or status of citizen's own report."""
    try:
        appeal = submit_appeal(
            db=db,
            report_id=report_id,
            citizen_id=citizen.id,
            reason=appeal_data.reason,
            message=appeal_data.message,
        )
        return AppealResponse.model_validate(appeal)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )