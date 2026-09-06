from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session,
    recipient_user_id: int,
    type: str,
    title: str,
    message: str,
    related_entity_type: str | None = None,
    related_entity_id: int | None = None,
) -> Notification:
    notification = Notification(
        recipient_user_id=recipient_user_id,
        type=type,
        title=title,
        message=message,
        related_entity_type=related_entity_type,
        related_entity_id=related_entity_id,
        created_at=datetime.now(timezone.utc),
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_user_notifications(
    db: Session,
    user_id: int,
    page: int = 1,
    limit: int = 20,
    unread_only: bool = False,
) -> tuple[list[Notification], int, int]:
    query = db.query(Notification).filter(Notification.recipient_user_id == user_id)
    if unread_only:
        query = query.filter(Notification.read_at.is_(None))

    total = query.count()
    unread_count = (
        db.query(Notification)
        .filter(
            Notification.recipient_user_id == user_id,
            Notification.read_at.is_(None),
        )
        .count()
    )

    offset = (page - 1) * limit
    notifications = (
        query.order_by(Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return notifications, unread_count, total


def mark_notification_read(
    db: Session,
    notification_id: int,
    user_id: int,
) -> Notification | None:
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.recipient_user_id == user_id,
        )
        .first()
    )
    if not notification:
        return None

    if not notification.read_at:
        notification.read_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(notification)

    return notification


def mark_all_read(db: Session, user_id: int) -> int:
    now = datetime.now(timezone.utc)
    count = (
        db.query(Notification)
        .filter(
            Notification.recipient_user_id == user_id,
            Notification.read_at.is_(None),
        )
        .update({"read_at": now})
    )
    db.commit()
    return count
