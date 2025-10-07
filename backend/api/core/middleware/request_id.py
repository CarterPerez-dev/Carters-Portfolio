"""
Request ID Tracking Middleware
/api/core/middleware/request_id.py
"""

import uuid
import logging
from werkzeug.local import Local
from flask import Flask, request, g, has_request_context

local = Local()


class RequestIDMiddleware:
    """
    Middleware to add unique request ID to every request
    """
    def __init__(self, app: Flask | None = None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app: Flask) -> None:
        """
        Initialize request ID middleware with Flask app
        """
        app.before_request(self.before_request)
        app.after_request(self.after_request)

    def before_request(self) -> None:
        """
        Generate and store request ID before processing request
        """
        request_id = request.headers.get('X-Request-ID')

        if not request_id:
            request_id = str(uuid.uuid4())

        g.request_id = request_id
        local.request_id = request_id

    def after_request(self, response):
        """
        Add request ID to response headers
        """
        if hasattr(g, 'request_id'):
            response.headers['X-Request-ID'] = g.request_id
        return response


class RequestIDFilter(logging.Filter):
    """
    Logging filter to add request ID to all log records
    """
    def filter(self, record):
        if has_request_context() and hasattr(g, 'request_id'):
            record.request_id = g.request_id
        else:
            record.request_id = getattr(local, 'request_id', 'no-request')
        return True


def get_request_id() -> str:
    """
    Get current request ID from context
    """
    if has_request_context() and hasattr(g, 'request_id'):
        return g.request_id
    return getattr(local, 'request_id', 'no-request-id')
