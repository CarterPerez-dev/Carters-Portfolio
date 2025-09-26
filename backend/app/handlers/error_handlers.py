"""
Global Error Handlers
/app/handlers/error_handlers.py
"""

from __future__ import annotations

import logging
from flask import Flask, request
from flask.typing import ResponseReturnValue
from api.core.validation.exceptions import AppError


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
        logger.warning(
            "AppError on route '%s': %s (%s)",
            request.path,
            error.message,
            error.error_code
        )

        response_data = {"error": error.message, "code": error.error_code}
        return response_data, error.status_code

    @app.errorhandler(Exception)
    def handle_generic_error(error: Exception) -> ResponseReturnValue:
        """
        Global catch all for any unhandled exception
        """
        logger.error(
            "Unhandled exception on route '%s': %s",
            request.path,
            str(error),
            exc_info=True
        )

        return {
            "error": "An internal server error occurred.",
            "code": "INTERNAL_SERVER_ERROR"
        }, 500
