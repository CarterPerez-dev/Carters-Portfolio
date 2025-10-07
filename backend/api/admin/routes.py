"""
Admin Authentication Routes
/api/admin/auth/routes.py
"""

from flask_restx import Resource
from flask import redirect, current_app
from flask_jwt_extended import jwt_required

from config import Config
from app.restx.ns import admin_auth_ns
from api.core.middleware.schema import S


from .schemas import (
    AdminLoginRequest,
    AdminTokenResponse,
    AdminStatusResponse,
)
from .controllers import (
    process_password_login,
    initiate_github_oauth,
    handle_github_callback,
    process_logout,
    get_admin_status,
    refresh_access_token,
    get_github_tokens_from_session
)
from .decorators import admin_endpoint


@admin_auth_ns.route('/login')
class AdminLogin(Resource):
    @current_app.limiter.limit(Config.ADMIN_AUTH_RATE_LIMIT)
    @S(req=AdminLoginRequest, res=AdminTokenResponse)
    def post(self):
        """
        Admin login with email/password
        """
        return process_password_login()


@admin_auth_ns.route('/github')
class AdminGitHubOAuth(Resource):
    @current_app.limiter.limit(Config.ADMIN_AUTH_RATE_LIMIT)
    def get(self):
        """
        Initiate GitHub OAuth flow
        """
        result = initiate_github_oauth()
        return redirect(result['redirect_url'])


@admin_auth_ns.route('/github/callback')
class AdminGitHubCallback(Resource):
    @current_app.limiter.limit(Config.ADMIN_AUTH_RATE_LIMIT)
    def get(self):
        """
        Handle GitHub OAuth callback and redirect to frontend
        """
        redirect_url = handle_github_callback()
        return redirect(redirect_url)


@admin_auth_ns.route('/github/tokens')
class AdminGitHubTokens(Resource):
    @current_app.limiter.limit(Config.ADMIN_AUTH_RATE_LIMIT)
    @S(res=AdminTokenResponse)
    def get(self):
        """
        Retrieve tokens from session after GitHub OAuth
        """
        return get_github_tokens_from_session()


@admin_auth_ns.route('/logout')
class AdminLogout(Resource):
    @current_app.limiter.limit(Config.ADMIN_AUTH_RATE_LIMIT)
    @admin_endpoint()
    def post(self):
        """
        Admin logout - requires authentication
        """
        return process_logout()


@admin_auth_ns.route('/status')
class AdminStatus(Resource):
    @current_app.limiter.limit(Config.ADMIN_AUTH_RATE_LIMIT)
    @admin_endpoint()
    @S(res=AdminStatusResponse)
    def get(self):
        """
        Check admin authentication status
        """
        return get_admin_status()


@admin_auth_ns.route('/refresh')
class AdminRefresh(Resource):
    @current_app.limiter.limit(Config.ADMIN_AUTH_RATE_LIMIT)
    @jwt_required(refresh=True)
    def post(self):
        """
        Refresh access token using refresh token
        """
        return refresh_access_token()
