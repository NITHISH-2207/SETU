from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class ReportAttachment(Base):
    __tablename__ = "report_attachments"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    file_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    storage_key: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    cloudinary_public_id: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    cloudinary_resource_type: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    file_metadata: Mapped[dict | None] = mapped_column(
        "metadata",
        JSON,
        nullable=True,
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )