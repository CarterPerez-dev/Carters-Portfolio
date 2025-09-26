"""
Rate Limiting Setup
/app/handlers/rate_handlers.py
"""

from __future__ import annotations

import logging
from typing import Any, TYPE_CHECKING
from flask import Flask, jsonify, Response
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

if TYPE_CHECKING:
    class FlaskWithLimiter(Flask):
        limiter: Limiter
else:
    FlaskWithLimiter = Flask

logger = logging.getLogger(__name__)


def setup_rate_limiting(app: FlaskWithLimiter) -> Limiter:
    """
    Initialize Flask-Limiter with in-memory storage
    """
    limiter = Limiter(
        key_func=get_remote_address,
        app=app,
        storage_uri=app.config['RATELIMIT_STORAGE_URI'],
        strategy=app.config['RATELIMIT_STRATEGY'],
        default_limits=app.config['FLASK_LIMITER_BURST'],
        headers_enabled=app.config['RATELIMIT_HEADERS_ENABLED'],
        swallow_errors=app.config['RATELIMIT_SWALLOW_ERRORS'],
    )

    app.limiter = limiter

    @app.errorhandler(429)
    def handle_rate_limit_error(e: Any) -> Response:
        """
        Handle Flask-Limiter rate limit errors
        """
        logger.warning("Rate limit exceeded for %s", get_remote_address())

        response = jsonify({
            "error": "Rate limit exceeded",
            "code": "RATE_LIMIT_EXCEEDED",
            "description": str(e.description),
            "retry_after": getattr(e, 'retry_after', None)
        })
        response.status_code = 429

        if hasattr(e, 'retry_after') and e.retry_after:
            response.headers['Retry-After'] = str(e.retry_after)

        return response

    return limiter
