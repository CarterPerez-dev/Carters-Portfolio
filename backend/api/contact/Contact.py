"""
Contact Model
/api/contact/Contact.py
"""

from __future__ import annotations

import re
from config import Config
from mongoengine import fields, ValidationError
from api.core.database.Base import BaseDocument
from api.core.validation.exceptions import NotFoundError


class Contact(BaseDocument):
    """
    Contact form submission model
    """
    meta = {
        'collection': 'contacts',
        'indexes': ['createdAt',
                    'email',
                    '-createdAt']
    }
    name = fields.StringField(
        max_length = Config.CONTACT_NAME_MAX_LENGTH,
        required = False
    )

    subject = fields.StringField(
        max_length = Config.CONTACT_SUBJECT_MAX_LENGTH,
        required = True,
        min_length = 1
    )

    body = fields.StringField(
        max_length = Config.CONTACT_BODY_MAX_LENGTH,
        required = True,
        min_length = 1
    )

    email = fields.EmailField(
        max_length = Config.CONTACT_EMAIL_MAX_LENGTH,
        required = False
    )

    phone = fields.StringField(
        max_length = Config.CONTACT_PHONE_MAX_LENGTH,
        required = False
    )

    linkedin = fields.URLField(
        max_length = Config.CONTACT_LINKEDIN_MAX_LENGTH,
        required = False
    )

    def __str__(self) -> str:
        return f"Contact: {self.subject} - {self.name or 'Anonymous'}"

    def clean(self):
        """
        Custom validation before saving
        """
        super().clean()

        if self.phone:
            self.phone = self._clean_phone(self.phone)

        if self.linkedin:
            self.linkedin = self._clean_linkedin_url(self.linkedin)

    def _clean_phone(self, phone: str) -> str:
        """
        Clean and validate phone number format
        """
        cleaned = re.sub(r'[^\d+]', '', phone)

        if not re.search(r'\d', cleaned):
            raise ValidationError('Phone number must contain digits')

        if len(cleaned) < 5 or len(cleaned) > 20:
            raise ValidationError(
                'Phone number must be between 5-20 characters'
            )

        return cleaned

    def _clean_linkedin_url(self, url: str) -> str:
        """
        Clean and validate LinkedIn URL
        """
        if not url.startswith(('http://', 'https://')):
            url = f'https://{url}'

        linkedin_pattern = r'https?://(www\.)?linkedin\.com/in/[\w\-]+'
        if not re.match(linkedin_pattern, url, re.IGNORECASE):
            raise ValidationError(
                'LinkedIn URL must be a valid LinkedIn profile URL'
            )

        return url

    @classmethod
    def get_recent_contacts(cls, limit: int = 10) -> list[Contact]:
        """
        Get recent contact submissions
        """
        return cls.objects().order_by('-createdAt').limit(limit)

    @classmethod
    def search_by_email(cls, email: str) -> list[Contact]:
        """
        Find contacts by email address
        """
        return cls.objects(email__iexact = email).order_by('-createdAt')

    def to_email_dict(self) -> dict[str, str | None]:
        """
        Convert contact to dict for email service
        """
        return {
            'name': self.name,
            'subject': self.subject,
            'body': self.body,
            'contact_email': self.email,
            'phone': self.phone,
            'linkedin': self.linkedin
        }

    @classmethod
    def create_contact(cls, data: dict) -> Contact:
        """
        Create and save a new contact
        """
        contact = cls(**data)
        contact.save()
        return contact

    @classmethod
    def get_by_id(cls, contact_id: str) -> Contact:
        """
        Get contact by ID, raise NotFoundError if not found
        """
        contact = cls.objects(id = contact_id).first()
        if not contact:
            raise NotFoundError(
                resource_type = "Contact",
                resource_id = contact_id
            )
        return contact

    def to_dict(self) -> dict:
        """
        Convert contact to dict for API responses
        """
        return {
            "_id": str(self.id),
            "name": self.name,
            "subject": self.subject,
            "body": self.body,
            "email": self.email,
            "phone": self.phone,
            "linkedin": self.linkedin,
            "created_at": self.createdAt,
            "updated_at": self.updatedAt
        }
