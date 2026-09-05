from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AttachmentResponse(BaseModel):
    id: int
    report_id: int
    type: str
    file_url: str | None = None
    storage_key: str | None = None
    cloudinary_public_id: str | None = None
    cloudinary_resource_type: str | None = None
    metadata: dict | None = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
