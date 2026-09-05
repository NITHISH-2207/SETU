from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="India",
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


class UniversityDepartment(Base):
    __tablename__ = "university_departments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )


class UniversityMentor(Base):
    __tablename__ = "university_mentors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id"),
        nullable=False,
        index=True,
    )

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("university_departments.id"),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    designation: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    domains: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    expertise: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    experience: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    interests: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    availability: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="AVAILABLE",
    )

    profile_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class UniversityStudent(Base):
    __tablename__ = "university_students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id"),
        nullable=False,
        index=True,
    )

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("university_departments.id"),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    year: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    domains: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    interests: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    availability: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="AVAILABLE",
    )

    profile_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class UniversityTeam(Base):
    __tablename__ = "university_teams"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
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


class UniversityTeamMember(Base):
    __tablename__ = "university_team_members"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    team_id: Mapped[int] = mapped_column(
        ForeignKey("university_teams.id"),
        nullable=False,
        index=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("university_students.id"),
        nullable=False,
        index=True,
    )

    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="MEMBER",
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class UniversityTeamMentor(Base):
    __tablename__ = "university_team_mentors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    team_id: Mapped[int] = mapped_column(
        ForeignKey("university_teams.id"),
        nullable=False,
        index=True,
    )

    mentor_id: Mapped[int] = mapped_column(
        ForeignKey("university_mentors.id"),
        nullable=False,
        index=True,
    )

    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="LEAD_MENTOR",
    )

    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class ProblemUniversityMatch(Base):
    __tablename__ = "problem_university_matches"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id"),
        nullable=False,
        index=True,
    )

    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id"),
        nullable=False,
        index=True,
    )

    mentor_id: Mapped[int | None] = mapped_column(
        ForeignKey("university_mentors.id"),
        nullable=True,
        index=True,
    )

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("university_departments.id"),
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
        default="RECOMMENDED",  # RECOMMENDED, INVITED, ACCEPTED, REJECTED, IN_PROGRESS, COMPLETED
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )
