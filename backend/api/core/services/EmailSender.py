"""
Email Service using Resend API
/api/core/services/EmailSender.py
"""

import requests
import logging


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
                "from": f"{from_name} <noreply@certgames.com.com>",
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
        Build HTML email template for contact form submission
        """
        contact_info = []

        if name:
            contact_info.append(f"<strong>Name:</strong> {name}")
        if contact_email:
            contact_info.append(
                f"<strong>Email:</strong> <a href='mailto:{contact_email}'>{contact_email}</a>"
            )
        if phone:
            contact_info.append(f"<strong>Phone:</strong> {phone}")
        if linkedin:
            contact_info.append(
                f"<strong>LinkedIn:</strong> <a href='{linkedin}' target='_blank'>{linkedin}</a>"
            )

        contact_section = "<br>".join(
            contact_info
        ) if contact_info else "<em>No contact information provided</em>"

        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Portfolio Contact Form</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">New Contact Form Submission</h2>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #495057;">Subject: {subject}</h3>
            </div>

            <div style="margin: 20px 0;">
                <h4 style="color: #495057;">Message:</h4>
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; border-radius: 0 5px 5px 0;">
                    {body.replace(chr(10), '<br>')}
                </div>
            </div>

            <div style="margin: 20px 0;">
                <h4 style="color: #495057;">Contact Information:</h4>
                <div style="padding: 10px 0;">
                    {contact_section}
                </div>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
                This email was sent from your portfolio website contact form.
            </p>
        </body>
        </html>
        """

        return html_template
