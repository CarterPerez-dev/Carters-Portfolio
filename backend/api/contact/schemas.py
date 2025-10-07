"""
Contact API Schemas
/api/contact/schemas.py
"""

from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    HttpUrl,
    validator,
)
from config import Config
from datetime import datetime


class ContactCreateRequest(BaseModel):
    """
    Request schema for creating a new contact submission
    """
    name: str | None = Field(
        None,
        max_length = Config.CONTACT_NAME_MAX_LENGTH,
        description = "Contact's name (optional)"
    )

    subject: str = Field(
        ...,
        min_length = 1,
        max_length = Config.CONTACT_SUBJECT_MAX_LENGTH,
        description = "Subject of the message"
    )

    body: str = Field(
        ...,
        min_length = 1,
        max_length = Config.CONTACT_BODY_MAX_LENGTH,
        description = "Message body"
    )

    email: EmailStr | None = Field(
        None,
        description = "Contact's email address (optional)"
    )

    phone: str | None = Field(
        None,
        max_length = Config.CONTACT_PHONE_MAX_LENGTH,
        description = "Contact's phone number (optional)"
    )

    linkedin: HttpUrl | None = Field(
        None,
        description = "Contact's LinkedIn profile URL (optional)"
    )

    @validator('linkedin', pre=True)
    def validate_linkedin(cls, v):
        """
        Trim whitespace and convert empty strings to None for optional URL field
        """
        if not v or (isinstance(v, str) and not v.strip()):
            return None
        if isinstance(v, str):
            return v.strip()
        return v

    @validator('email', pre=True)
    def validate_email(cls, v):
        """
        Trim whitespace from email if provided
        """
        if not v:
            return None
        if isinstance(v, str):
            return v.strip()
        return v

    @validator('subject', 'body')
    def strip_whitespace(cls, v: str) -> str:
        """
        Strip whitespace from subject and body
        """
        return v.strip()

    @validator('name')
    def strip_name(cls, v: str | None) -> str | None:
        """
        Strip whitespace from name if provided
        """
        return v.strip() if v else None

    @validator('phone')
    def validate_phone(cls, v: str | None) -> str | None:
        """
        Basic phone validation
        """
        if not v:
            return None
        cleaned = v.strip().replace(' ',
                                    '').replace('-',
                                                '').replace('(',
                                                            '').replace(')',
                                                                        '')
        return cleaned


class ContactResponse(BaseModel):
    """
    Response schema for contact submissions
    """
    id: str = Field(..., alias = "_id", description = "Contact submission ID")
    name: str | None = Field(None, description = "Contact's name")
    subject: str = Field(..., description = "Subject of the message")
    body: str = Field(..., description = "Message body")
    email: str | None = Field(None, description = "Contact's email")
    phone: str | None = Field(None, description = "Contact's phone")
    linkedin: str | None = Field(None, description = "Contact's LinkedIn URL")
    created_at: datetime = Field(..., description = "Submission timestamp")
    updated_at: datetime = Field(..., description = "Last update timestamp")


class ContactCreateResponse(BaseModel):
    """
    Response schema for successful contact creation
    """
    contact_id: str = Field(..., description = "Created contact ID")
    email_sent: bool = Field(..., description = "Whether notification email was sent")


class ContactListResponse(BaseModel):
    """
    Response schema for contact list (admin use)
    """
    contacts: list[ContactResponse] = Field(..., description = "List of contacts")
    total: int = Field(..., description = "Total number of contacts")
    limit: int = Field(..., description = "Results limit")


class ErrorResponse(BaseModel):
    """
    Standard error response schema
    """
    error: str = Field(..., description = "Error message")
    code: str = Field(..., description = "Error code")
    context: dict | None = Field(None, description = "Additional error context")
