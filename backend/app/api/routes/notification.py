from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.notification import (
    NotificationResponse,
    NotificationListResponse,
)
from app.services.notification_service import (
    get_user_notifications,
    mark_notification_read,
    mark_all_read,
)

router = APIRouter(
    prefix="/api/v1/notifications",
    tags=["Notifications"],
)


@router.get(
    "",
    response_model=NotificationListResponse,
)
def get_notifications(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    unread_only: bool = Query(default=False),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List in-app website notifications for the authenticated user."""
    items, unread_count, total = get_user_notifications(
        db=db,
        user_id=current_user["user_id"],
        page=page,
        limit=limit,
        unread_only=unread_only,
    )
    return NotificationListResponse(
        notifications=[NotificationResponse.model_validate(n) for n in items],
        unread_count=unread_count,
        total=total,
    )


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def mark_read(
    notification_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a specific notification as read."""
    notification = mark_notification_read(
        db=db,
        notification_id=notification_id,
        user_id=current_user["user_id"],
    )
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    return NotificationResponse.model_validate(notification)


@router.post(
    "/read-all",
)
def mark_all_notifications_read(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all notifications as read for the authenticated user."""
    count = mark_all_read(db=db, user_id=current_user["user_id"])
    return {"message": f"Marked {count} notifications as read"}
