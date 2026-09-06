from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class SolutionProject(Base):
    __tablename__ = "solution_projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
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

    objective: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    stage: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PROBLEM_ANALYSIS",  # PROBLEM_ANALYSIS, SOLUTION_PROPOSAL, RESEARCH, PROTOTYPE, PILOT, IMPLEMENTATION, DEPLOYMENT, IMPACT_MEASUREMENT, COMPLETED
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ON_TRACK",  # ON_TRACK, AT_RISK, DELAYED, TERMINATED, COMPLETED
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


class ProjectParticipant(Base):
    __tablename__ = "project_participants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    project_id: Mapped[int] = mapped_column(
        ForeignKey("solution_projects.id"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    organization_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    participant_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,  # CITIZEN, GOVERNMENT, MENTOR, STUDENT, CSR, ORGANIZATION
    )

    role: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    project_id: Mapped[int] = mapped_column(
        ForeignKey("solution_projects.id"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    due_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PENDING",  # PENDING, IN_PROGRESS, COMPLETED, MISSED
    )
