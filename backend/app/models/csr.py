from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class Corporate(Base):
    __tablename__ = "corporates"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    company_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    registration_details: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    industry: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    headquarters: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    locations: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    contact_details: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class CSRProfile(Base):
    __tablename__ = "csr_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    corporate_id: Mapped[int] = mapped_column(
        ForeignKey("corporates.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    focus_areas: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    geographic_preferences: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    funding_range: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    preferred_problem_types: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    preferred_project_stages: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    eligibility_criteria: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class CSRUser(Base):
    __tablename__ = "csr_users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    corporate_id: Mapped[int] = mapped_column(
        ForeignKey("corporates.id"),
        nullable=False,
        index=True,
    )

    designation: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    permissions: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class ProblemCSRMatch(Base):
    __tablename__ = "problem_csr_matches"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    corporate_id: Mapped[int] = mapped_column(
        ForeignKey("corporates.id"),
        nullable=False,
        index=True,
    )

    csr_id: Mapped[int | None] = mapped_column(
        ForeignKey("csr_profiles.id"),
        nullable=True,
        index=True,
    )

    match_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    matching_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="RECOMMENDED",  # RECOMMENDED, INTERESTED, EVALUATING, APPROVED, REJECTED, FUNDED, COMPLETED
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )
