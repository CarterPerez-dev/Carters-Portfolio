"""
Admin Authentication Controllers
/api/admin/auth/controllers.py
"""

import os
import secrets
import requests
from datetime import timedelta
from flask import g, session, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity
)
from config import Config
from api.core.validation.exceptions import (
    AuthenticationError,
    ValidationError,
)
from api.core.cache.extension import flask_redis

from .AdminUser import AdminUser
from .types import (
    AdminTokenDict,
    AdminStatusDict,
    GitHubOAuthRedirectDict,
    LogoutResponseDict,
)


def process_password_login() -> AdminTokenDict:
    """
    Process admin login with email/password
    """
    data = g.validated
    email = data['email']
    password = data['password']

    admin_email = os.getenv('ADMIN_EMAIL')
    if email != admin_email:
        raise AuthenticationError("Unauthorized email")

    admin = AdminUser.objects(email=email).first()

    if not admin:
        admin = AdminUser(email=email)
        admin.set_password(password)
        admin.save()
    else:
        if not admin.check_password(password):
            admin.record_failed_login()
            raise AuthenticationError("Invalid credentials")

        if admin.is_locked():
            raise AuthenticationError("Account is temporarily locked")

    ip = g.get('request_ip', 'unknown')
    admin.record_successful_login(ip)

    return _generate_tokens(admin)


def initiate_github_oauth() -> GitHubOAuthRedirectDict:
    """
    Initiate GitHub OAuth flow
    """
    client_id = os.getenv('GH_CLIENT_ID')
    if not client_id:
        raise ValidationError("GitHub OAuth not configured")

    state = secrets.token_urlsafe(32)
    session['oauth_state'] = state

    backend_url = os.getenv('BACKEND_URL')
    if not backend_url:
        raise ValidationError("BACKEND_URL not configured")

    redirect_uri = f"{backend_url}/api/v1/admin/auth/github/callback"
    github_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=user:email"
        f"&state={state}"
    )

    return {'redirect_url': github_url}


def handle_github_callback() -> str:
    """
    Handle GitHub OAuth callback and return frontend redirect URL
    """
    code = request.args.get('code')
    state = request.args.get('state')

    if not code:
        raise ValidationError("Missing authorization code")

    if not state:
        raise ValidationError("Missing state parameter")

    if state != session.get('oauth_state'):
        raise ValidationError("Invalid OAuth state")

    session.pop('oauth_state', None)

    client_id = os.getenv('GH_CLIENT_ID')
    client_secret = os.getenv('GH_CLIENT_SECRET')

    token_response = requests.post(
        'https://github.com/login/oauth/access_token',
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code
        },
        headers={'Accept': 'application/json'},
        timeout=30
    )

    if token_response.status_code != 200:
        raise AuthenticationError("Failed to exchange OAuth code")

    token_data = token_response.json()
    access_token = token_data.get('access_token')

    if not access_token:
        raise AuthenticationError("No access token received")

    user_response = requests.get(
        'https://api.github.com/user',
        headers={
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/json'
        },
        timeout=30
    )

    if user_response.status_code != 200:
        raise AuthenticationError("Failed to get user info from GitHub")

    user_info = user_response.json()

    email_response = requests.get(
        'https://api.github.com/user/emails',
        headers={
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/json'
        },
        timeout=30
    )

    emails = email_response.json() if email_response.status_code == 200 else []
    primary_email = next(
        (e['email'] for e in emails if e.get('primary') and e.get('verified')),
        user_info.get('email')
    )

    if not primary_email:
        raise AuthenticationError("No verified email found")

    admin_email = os.getenv('ADMIN_EMAIL')
    if primary_email != admin_email:
        raise AuthenticationError(f"Unauthorized email: {primary_email}")

    admin = AdminUser.get_or_create_github_user(
        email=primary_email,
        github_id=str(user_info['id']),
        github_username=user_info['login'],
        github_avatar_url=user_info.get('avatar_url'),
        name=user_info.get('name')
    )

    ip = g.get('request_ip', 'unknown')
    admin.record_successful_login(ip)

    tokens = _generate_tokens(admin)
    session['github_auth_tokens'] = tokens

    frontend_url = os.getenv('FRONTEND_URL')
    if not frontend_url:
        raise ValidationError("FRONTEND_URL not configured")

    return f"{frontend_url}/admin/auth/github/callback"


def get_github_tokens_from_session() -> AdminTokenDict:
    """
    Retrieve GitHub OAuth tokens from session
    """
    tokens = session.pop('github_auth_tokens', None)
    if not tokens:
        raise AuthenticationError("No tokens found in session")
    return tokens


def process_logout() -> LogoutResponseDict:
    """
    Process admin logout
    """
    jti = get_jwt()['jti']

    if flask_redis.client:
        flask_redis.client.setex(
            f"jwt_blacklist:{jti}",
            Config.JWT_BLACKLIST_TOKEN_EXPIRES,
            'true'
        )

    return {'message': 'Successfully logged out'}


def get_admin_status() -> AdminStatusDict:
    """
    Get current admin authentication status
    """
    admin = g.get('admin')

    if not admin:
        return {
            'authenticated': False,
            'admin': None
        }

    return {
        'authenticated': True,
        'admin': {
            'id': str(admin.id),
            'email': admin.email,
            'name': admin.name,
            'github_username': admin.github_username,
            'github_avatar_url': admin.github_avatar_url,
            'is_active': admin.is_active
        }
    }


def refresh_access_token() -> AdminTokenDict:
    """
    Refresh access token using refresh token
    """
    identity = get_jwt_identity()
    admin = AdminUser.objects(id=identity, is_active=True).first()

    if not admin:
        raise AuthenticationError("Invalid refresh token")

    access_token = create_access_token(
        identity=str(admin.id),
        additional_claims=admin.to_dict()
    )

    return {
        'access_token': access_token,
        'token_type': 'Bearer',
        'expires_in': Config.JWT_ACCESS_TOKEN_EXPIRES
    }


def _generate_tokens(admin: AdminUser) -> AdminTokenDict:
    """
    Generate JWT tokens for admin
    """
    additional_claims = admin.to_dict()

    access_token = create_access_token(
        identity=str(admin.id),
        additional_claims=additional_claims,
        expires_delta=timedelta(seconds=Config.JWT_ACCESS_TOKEN_EXPIRES)
    )

    refresh_token = create_refresh_token(
        identity=str(admin.id),
        additional_claims=additional_claims,
        expires_delta=timedelta(seconds=Config.JWT_REFRESH_TOKEN_EXPIRES)
    )

    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': Config.JWT_ACCESS_TOKEN_EXPIRES, 
        'admin': {
            'id': str(admin.id),
            'email': admin.email,
            'name': admin.name,
            'github_username': admin.github_username,
            'github_avatar_url': admin.github_avatar_url,
            'is_active': admin.is_active
        }
    }
