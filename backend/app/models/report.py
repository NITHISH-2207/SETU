from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    citizen_id: Mapped[int] = mapped_column(
        ForeignKey("citizens.id"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    language: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    location: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    latitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    longitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    location_source: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    submission_source: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="WEB",
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="SUBMITTED",
        index=True,
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