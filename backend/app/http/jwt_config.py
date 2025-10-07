"""
JWT and App Configuration
/app/http/jwt_config.py
"""

from flask import Flask
from flask_jwt_extended import JWTManager

from api.core.cache.extension import flask_redis


def setup_jwt_and_app_config(app: Flask, jwt: JWTManager) -> None:
    """
    Configure JWT and general app settings for portfolio
    """
    jwt.init_app(app)

    jwt.token_in_blocklist_loader(check_if_token_revoked)

    app.config["JSON_SORT_KEYS"] = False
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["PRESERVE_CONTEXT_ON_EXCEPTION"] = False

    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SECURE"] = not app.config.get('DEBUG', True)
    app.config["SESSION_COOKIE_SAMESITE"] = 'Lax'

    app.config["SESSION_PERMANENT"] = False
    
    
def check_if_token_revoked(jwt_header, jwt_payload):
    """
    Check if JWT token has been revoked
    """
    jti = jwt_payload['jti']
    if flask_redis.client:
        token_in_redis = flask_redis.client.get(f"jwt_blacklist:{jti}")
        return token_in_redis is not None
    return False    
