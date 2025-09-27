"""
Global Error Handlers
/app/handlers/error_handlers.py
"""

from __future__ import annotations

import logging
from flask import Flask, request
from flask.typing import ResponseReturnValue
from api.core.validation.exceptions import AppError
from api.core.middleware.request_id import get_request_id


logger = logging.getLogger(__name__)


def setup_error_handlers(app: Flask) -> None:
    """
    Register all error handlers
    """
    @app.errorhandler(AppError)
    def handle_custom_app_error(error: AppError) -> ResponseReturnValue:
        """
        Global error handler for all custom business logic errors
        """
        request_id = get_request_id()

        logger.warning(
            "AppError on route '%s': %s (%s)",
            request.path,
            error.message,
            error.error_code
        )

        response_data = {
            "error": error.message,
            "code": error.error_code,
            "request_id": request_id
        }
        return response_data, error.status_code

    @app.errorhandler(Exception)
    def handle_generic_error(error: Exception) -> ResponseReturnValue:
        """
        Global catch all for any unhandled exception
        """
        request_id = get_request_id()

        logger.error(
            "Unhandled exception on route '%s': %s",
            request.path,
            str(error),
            exc_info=True
        )

        return {
            "error": "An internal server error occurred.",
            "code": "INTERNAL_SERVER_ERROR",
            "request_id": request_id
        }, 500
