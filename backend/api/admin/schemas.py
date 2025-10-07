"""
Admin Authentication Schemas
/api/admin/auth/schemas.py
"""

import re
from pydantic import (
    BaseModel,
    Field,
    ConfigDict,
    field_validator,
)
from config import Config


class AdminLoginRequest(BaseModel):
    """
    Password login request
    """
    email: str = Field(..., description="Admin email")
    password: str = Field(
        ...,
        min_length=Config.ADMIN_PASSWORD_MIN_LENGTH,
        description="Admin password"
    )

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError("Invalid email format")
        return v.lower().strip()


class AdminTokenResponse(BaseModel):
    """
    JWT token response after successful login
    """
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int = Config.JWT_ACCESS_TOKEN_EXPIRES
    admin: 'AdminInfoResponse'

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
                "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
                "token_type": "Bearer",
                "expires_in": Config.JWT_ACCESS_TOKEN_EXPIRES,
                "admin": {
                    "id": "507f1f77bcf86cd799439011",
                    "email": "admin@portfolio.com",
                    "name": "Admin User",
                    "github_username": "admin-user"
                }
            }
        }
    )


class AdminInfoResponse(BaseModel):
    """
    Admin user information
    """
    id: str
    email: str
    name: str | None = None
    github_username: str | None = None
    github_avatar_url: str | None = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class AdminStatusResponse(BaseModel):
    """
    Admin authentication status
    """
    authenticated: bool
    admin: AdminInfoResponse | None = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "authenticated": True,
                "admin": {
                    "id": "507f1f77bcf86cd799439011",
                    "email": "admin@portfolio.com",
                    "name": "Admin User",
                    "github_username": "admin-user",
                    "is_active": True
                }
            }
        }
    )


class GitHubCallbackRequest(BaseModel):
    """
    GitHub OAuth callback parameters
    """
    code: str = Field(..., description="OAuth authorization code")
    state: str = Field(..., description="OAuth state parameter for CSRF protection")
