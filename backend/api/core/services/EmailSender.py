"""
Email Service using Resend API
/api/core/services/EmailSender.py
"""

import os
import requests
import logging
from jinja2 import Template


logger = logging.getLogger(__name__)


class EmailSender:
    """
    Email service using Resend API for sending contact form emails
    """
    def __init__(self, resend_api_key: str, portfolio_email: str):
        self.api_key = resend_api_key
        self.portfolio_email = portfolio_email
        self.base_url = "https://api.resend.com"

    def send_contact_form_email(
        self,
        *,
        name: str | None,
        subject: str,
        body: str,
        contact_email: str | None = None,
        phone: str | None = None,
        linkedin: str | None = None
    ) -> bool:
        """
        Send contact form submission to portfolio email
        """
        try:
            from_name = name if name else "Portfolio Contact Form"
            email_subject = f"Portfolio Contact: {subject}"

            html_body = self._build_contact_email_html(
                name = name,
                subject = subject,
                body = body,
                contact_email = contact_email,
                phone = phone,
                linkedin = linkedin
            )

            payload = {
                "from": f"{from_name} <noreply@certgames.com>",
                "to": [self.portfolio_email],
                "subject": email_subject,
                "html": html_body
            }

            if contact_email:
                payload["reply_to"] = contact_email

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            response = requests.post(
                f"{self.base_url}/emails",
                json = payload,
                headers = headers,
                timeout = 10
            )

            if response.status_code == 200:
                logger.info("Contact form email sent successfully")
                return True

            logger.error(
                "Failed to send email: %s - %s", response.status_code, response.text
            )
            return False

        except Exception as e:
            logger.error("Error sending contact form email: %s", str(e))
            return False

    def _build_contact_email_html(
        self,
        *,
        name: str | None,
        subject: str,
        body: str,
        contact_email: str | None,
        phone: str | None,
        linkedin: str | None
    ) -> str:
        """
        Build HTML email template for contact form submission using Jinja2
        """
        template_path = os.path.join(
            os.path.dirname(__file__),
            'templates',
            'contact_email.html'
        )

        with open(template_path, encoding='utf-8') as f:
            template_content = f.read()

        template = Template(template_content)

        html = template.render(
            name=name,
            subject=subject,
            body=body,
            contact_email=contact_email,
            phone=phone,
            linkedin=linkedin
        )

        return html
