"""
Admin User Model
/api/admin/AdminUser.py
"""

from datetime import ( 
    UTC,
    datetime, 
    timedelta, 
)
from werkzeug.security import (
    generate_password_hash, 
    check_password_hash,
)
from mongoengine import fields

from config import Config
from api.core.database.Base import BaseDocument


class AdminUser(BaseDocument):
    """
    Simple admin user model for portfolio management
    """
    meta = {
        'collection': 'admin_users',
        'indexes': [
            'email',
            'github_id'
        ]
    }

    email = fields.EmailField(required=True, unique=True)
    password_hash = fields.StringField()

    github_id = fields.StringField(unique=True, sparse=True)
    github_username = fields.StringField()
    github_avatar_url = fields.URLField()

    name = fields.StringField(max_length=Config.ADMIN_NAME_MAX_LENGTH)
    is_active = fields.BooleanField(default=True)

    last_login_at = fields.DateTimeField()
    last_login_ip = fields.StringField()
    login_count = fields.IntField(default=0)

    failed_login_attempts = fields.IntField(default=0)
    locked_until = fields.DateTimeField()

    def set_password(self, password: str) -> None:
        """
        Set password hash
        """
        self.password_hash = generate_password_hash(password)
        self.save()

    def check_password(self, password: str) -> bool:
        """
        Verify password against hash
        """
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def is_locked(self) -> bool:
        """
        Check if account is locked due to failed attempts
        """
        if not self.locked_until:
            return False
        return bool(datetime.now(UTC) < self.locked_until)

    def record_failed_login(self) -> None:
        """
        Record failed login attempt and lock if necessary
        """
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= Config.ADMIN_MAX_FAILED_LOGIN_ATTEMPTS:
            self.locked_until = datetime.now(UTC) + timedelta(
                minutes=Config.ADMIN_LOCKOUT_DURATION_MINUTES
            )
        self.save()

    def record_successful_login(self, ip: str) -> None:
        """
        Record successful login
        """
        self.last_login_at = datetime.now(UTC)
        self.last_login_ip = ip
        self.login_count += 1
        self.failed_login_attempts = 0
        self.locked_until = None
        self.save()

    @classmethod
    def get_or_create_github_user(
        cls,
        *,
        email: str,
        github_id: str,
        github_username: str,
        github_avatar_url: str | None = None,
        name: str | None = None
    ) -> 'AdminUser':
        """
        Get or create admin user from GitHub OAuth
        """
        admin = cls.objects(email=email).first()

        if not admin:
            admin = cls(
                email=email,
                github_id=github_id,
                github_username=github_username,
                github_avatar_url=github_avatar_url,
                name=name or github_username
            )
            admin.save()
        else:
            admin.github_id = github_id
            admin.github_username = github_username
            if github_avatar_url:
                admin.github_avatar_url = github_avatar_url
            if name and not admin.name:
                admin.name = name
            admin.save()

        return admin

    def to_dict(self) -> dict:
        """
        Convert to dictionary for JWT claims
        """
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'github_username': self.github_username,
            'is_active': self.is_active
        }

    def __str__(self) -> str:
        return f"Admin: {self.email}"
