"""
Admin Authentication Decorators
/api/admin/decorators.py
"""

from flask import g
from functools import wraps
from flask_jwt_extended import (
    verify_jwt_in_request, 
    get_jwt_identity, 
    get_jwt,
)

from .AdminUser import AdminUser
from api.core.validation.exceptions import (
    AuthenticationError, 
    AuthorizationError,
)


def admin_endpoint():
    """
    Decorator for admin only endpoints
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                raise AuthenticationError(f"Invalid or missing token: {str(e)}") from e

            admin_id = get_jwt_identity()
            if not admin_id:
                raise AuthenticationError("Invalid token identity")

            admin = AdminUser.objects(id=admin_id, is_active=True).first()
            if not admin:
                raise AuthorizationError("Admin user not found or inactive")

            if admin.is_locked():
                raise AuthorizationError("Account is temporarily locked")

            g.admin = admin
            g.jwt_data = get_jwt()

            return f(*args, **kwargs)

        return wrapper
    return decorator
