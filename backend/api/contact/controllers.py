"""
Contact Controllers
/api/contact/controllers.py
"""

import logging
from typing import cast
from config import Config
from flask import current_app, g
from api.contact.Contact import Contact
from api.core.services.EmailSender import EmailSender


logger = logging.getLogger(__name__)


def create_contact() -> dict[str, str | bool]:
    """
    Create a new contact and send notification email
    """
    contact = Contact.create_contact(g.validated)
    
    email_sent = _send_notification_email(contact)

    return cast(
        dict[str,
             str | bool],
        {
            "contact_id": str(contact.id),
            "email_sent": email_sent
        }
    )

def get_contact_by_id(contact_id: str) -> dict[str, str | None]:
    """
    Get a contact by ID
    """
    contact = Contact.get_by_id(contact_id)
    return cast(dict[str, str | None], contact.to_dict())

def get_recent_contacts(
    limit: int = Config.CONTACT_DEFAULT_LIST_LIMIT
) -> list[dict[str,
               str | None]]:
    """
    Get recent contacts - returns list
    """
    contacts = Contact.get_recent_contacts(limit = limit)
    return cast(
        list[dict[str,
                  str | None]],
        [contact.to_dict() for contact in contacts]
    )

def get_recent_contacts_list(
    limit: int = Config.CONTACT_DEFAULT_LIST_LIMIT
) -> dict[str,
          list[dict[str,
                    str | None]] | int]:
    """
    Get recent contacts - returns structured list response
    """
    contact_list = get_recent_contacts(limit)
    return cast(
        dict[str,
             list[dict[str,
                       str | None]] | int],
        {
            "contacts": contact_list,
            "total": len(contact_list),
            "limit": limit
        }
    )

def _send_notification_email(contact: Contact) -> bool:
    """
    Send email notification
    """
    try:
        email_sender = EmailSender(
            resend_api_key = current_app.config['RESEND_API_KEY'],
            portfolio_email = current_app.config['PORTFOLIO_EMAIL']
        )

        email_data = contact.to_email_dict()
        return email_sender.send_contact_form_email(**email_data)

    except (KeyError, TypeError, ValueError) as e:
        logger.error("Email configuration error for contact %s: %s", contact.id, str(e))
        return False
    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.error("Unexpected email error for contact %s: %s", contact.id, str(e))
        return False
