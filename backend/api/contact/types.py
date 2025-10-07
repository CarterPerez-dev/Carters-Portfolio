"""
Contact Type Definitions
/api/contact/types.py
"""

from typing import TypedDict
from datetime import datetime


class ContactDict(TypedDict):
    """
    Type definition for contact dictionary
    """
    _id: str
    name: str | None
    subject: str
    body: str
    email: str | None
    phone: str | None
    linkedin: str | None
    created_at: datetime
    updated_at: datetime


class ContactCreateResponseDict(TypedDict):
    """
    Type definition for contact creation response
    """
    contact_id: str
    email_sent: bool


class ContactListDict(TypedDict):
    """
    Type definition for contact list response
    """
    contacts: list[ContactDict]
    total: int
    limit: int


class ContactEmailDict(TypedDict):
    """
    Type definition for contact email data
    """
    name: str | None
    subject: str
    body: str
    contact_email: str | None
    phone: str | None
    linkedin: str | None
