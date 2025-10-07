"""
Admin Type Definitions
/api/admin/types.py
"""

from datetime import datetime
from typing import TypedDict, NotRequired


class AdminDict(TypedDict):
    """
    Type definition for admin user dictionary
    """
    id: str
    email: str
    name: str | None
    github_username: str | None
    github_avatar_url: str | None
    is_active: bool
    last_login_at: datetime | None
    login_count: int


class AdminTokenDict(TypedDict):
    """
    Type definition for JWT token response
    """
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    admin: AdminDict


class AdminStatusDict(TypedDict):
    """
    Type definition for admin status response
    """
    authenticated: bool
    admin: NotRequired[AdminDict]


class GitHubOAuthRedirectDict(TypedDict):
    """
    Type definition for GitHub OAuth initiation
    """
    redirect_url: str


class LogoutResponseDict(TypedDict):
    """
    Type definition for logout response
    """
    message: str
