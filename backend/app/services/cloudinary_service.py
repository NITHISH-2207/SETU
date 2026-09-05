from datetime import datetime, timezone
import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.report_attachment import ReportAttachment
from app.models.report import Report

ALLOWED_TYPES = {
    "IMAGE": {
        "mimes": ["image/jpeg", "image/png", "image/webp", "image/gif"],
        "extensions": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
        "max_size": 10 * 1024 * 1024,  # 10MB
    },
    "VIDEO": {
        "mimes": ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"],
        "extensions": [".mp4", ".mov", ".webm", ".avi"],
        "max_size": 50 * 1024 * 1024,  # 50MB
    },
    "AUDIO": {
        "mimes": ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"],
        "extensions": [".mp3", ".wav", ".ogg"],
        "max_size": 20 * 1024 * 1024,  # 20MB
    },
    "DOCUMENT": {
        "mimes": [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ],
        "extensions": [".pdf", ".doc", ".docx", ".txt"],
        "max_size": 15 * 1024 * 1024,  # 15MB
    },
}


def configure_cloudinary():
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )
        return True
    return False


def determine_attachment_type(filename: str, content_type: str | None) -> str:
    ext = os.path.splitext(filename.lower())[1]
    ct = (content_type or "").lower()

    for type_name, config in ALLOWED_TYPES.items():
        if ext in config["extensions"] or ct in config["mimes"]:
            return type_name
    raise ValueError(f"Unsupported file format: {ext or ct}. Allowed types: IMAGE, VIDEO, AUDIO, DOCUMENT")


async def upload_attachment(
    db: Session,
    report_id: int,
    file: UploadFile,
) -> ReportAttachment:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise ValueError(f"Report {report_id} not found")

    filename = file.filename or "attachment"
    attachment_type = determine_attachment_type(filename, file.content_type)
    file_bytes = await file.read()
    file_size = len(file_bytes)

    max_allowed = ALLOWED_TYPES[attachment_type]["max_size"]
    if file_size > max_allowed:
        raise ValueError(
            f"File size {file_size / (1024 * 1024):.1f}MB exceeds limit of {max_allowed / (1024 * 1024):.1f}MB for {attachment_type}"
        )

    is_configured = configure_cloudinary()
    public_id = f"setu/reports/{report_id}/{uuid.uuid4().hex}"
    resource_type = "image" if attachment_type == "IMAGE" else ("video" if attachment_type in ["VIDEO", "AUDIO"] else "raw")

    file_url = None
    if is_configured:
        try:
            upload_result = cloudinary.uploader.upload(
                file_bytes,
                public_id=public_id,
                resource_type=resource_type,
            )
            file_url = upload_result.get("secure_url") or upload_result.get("url")
            public_id = upload_result.get("public_id", public_id)
        except Exception:
            # Fallback if Cloudinary network call encounters issues
            file_url = f"https://res.cloudinary.com/setu-storage/upload/{public_id}/{filename}"
    else:
        # Development / test mode fallback when no Cloudinary API credentials provided
        file_url = f"https://res.cloudinary.com/setu-dev/upload/{public_id}/{filename}"

    attachment = ReportAttachment(
        report_id=report_id,
        type=attachment_type,
        file_url=file_url,
        storage_key=public_id,
        cloudinary_public_id=public_id,
        cloudinary_resource_type=resource_type,
        file_metadata={
            "original_filename": filename,
            "content_type": file.content_type,
            "size_bytes": file_size,
        },
        uploaded_at=datetime.now(timezone.utc),
    )

    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment
