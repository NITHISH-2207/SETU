from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    title_generated: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    category_predicted: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    category_confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    severity_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    severity_factors: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    urgency_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    confidence_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    duplicate_detected: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    duplicate_report_ids: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    research_classification: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="RESEARCH_NOT_NEEDED",
    )

    research_confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    location_interpretation: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    verification_required: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="v1-rule-engine",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )
