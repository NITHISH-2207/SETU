from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utc_now


class GovernmentOrganization(Base):
    __tablename__ = "government_organizations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    level: Mapped[str] = mapped_column(
        String(30),
        nullable=False,  # CENTRAL, STATE, DISTRICT, LOCAL
        index=True,
    )

    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    district: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    address: Mapped[str | None] = mapped_column(
        Text,
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


class GovernmentDepartment(Base):
    __tablename__ = "government_departments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    government_id: Mapped[int] = mapped_column(
        ForeignKey("government_organizations.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    jurisdiction: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
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


class GovernmentUser(Base):
    __tablename__ = "government_users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    government_id: Mapped[int] = mapped_column(
        ForeignKey("government_organizations.id"),
        nullable=False,
        index=True,
    )

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("government_departments.id"),
        nullable=True,
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
