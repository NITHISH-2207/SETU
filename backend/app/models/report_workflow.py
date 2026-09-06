from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class ReportStatusHistory(Base):
    __tablename__ = "report_status_histories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    previous_status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    new_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    changed_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    actor_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="CITIZEN",
    )

    comment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class ReportHistory(Base):
    __tablename__ = "report_histories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    changed_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    actor_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    previous_value: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    new_value: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class ReportSupport(Base):
    __tablename__ = "report_supports"
    __table_args__ = (
        UniqueConstraint("report_id", "citizen_id", name="uq_report_citizen_support"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    citizen_id: Mapped[int] = mapped_column(
        ForeignKey("citizens.id"),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class Resolution(Base):
    __tablename__ = "resolutions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    solution_details: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    resolution_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PROPOSED",  # PROPOSED, IMPLEMENTED, VERIFIED, ACCEPTED, REJECTED
    )

    submitted_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    verified_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    verified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    evidence: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )


class Appeal(Base):
    __tablename__ = "appeals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    citizen_id: Mapped[int] = mapped_column(
        ForeignKey("citizens.id"),
        nullable=False,
        index=True,
    )

    reason: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="SUBMITTED",  # SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED, REOPENED
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
