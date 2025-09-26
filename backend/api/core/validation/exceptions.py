"""
Portfolio Website Custom Exceptions
/api/core/validation/exceptions.py
"""

from typing import Any


class AppError(Exception):
    """
    Base class for all custom application exceptions
    """
    def __init__(
        self,
        message: str = "An error occurred.",
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        context: dict[str,
                      Any] | None = None,
    ) -> None:
        self.message: str = message
        self.status_code: int = status_code
        self.error_code: str = error_code
        self.context: dict[str, Any] = context or {}
        super().__init__(self.message)


# --- CATEGORY: Input & Validation Errors (4xx) ---
class ValidationError(AppError):
    """
    Raised when user-provided data fails validation checks
    """
    def __init__(
        self,
        message: str = "Input validation failed.",
        context: dict[str,
                      Any] | None = None
    ) -> None:
        super().__init__(message, 400, "VALIDATION_ERROR", context)


class RateLimitError(AppError):
    """
    Raised when a user exceeds a rate limit
    """
    def __init__(
        self,
        message: str = "Rate limit exceeded. Please try again later.",
        context: dict[str,
                      Any] | None = None,
    ) -> None:
        super().__init__(message, 429, "RATE_LIMIT_EXCEEDED", context)


# --- CATEGORY: Resource & State Errors (4xx) ---
class NotFoundError(AppError):
    """
    Raised when a requested resource cannot be found
    """
    def __init__(
        self,
        resource_type: str = "Resource",
        resource_id: str | int | None = None,
        message: str | None = None,
    ) -> None:
        if message is None:
            message = f"{resource_type} not found."
        context: dict[str,
                      Any] = {
                          "resource_type": resource_type,
                          "resource_id":
                          str(resource_id) if resource_id else None,
                      }
        super().__init__(message, 404, "NOT_FOUND", context)


class ConflictError(AppError):
    """
    Raised for state conflicts
    """
    def __init__(
        self,
        message: str = "A conflict occurred.",
        error_code: str = "CONFLICT",
        context: dict[str,
                      Any] | None = None,
    ) -> None:
        super().__init__(message, 409, error_code, context)


# --- CATEGORY: External Service Errors (5xx) ---
class ServiceError(AppError):
    """
    Raised for failures in external services
    """
    def __init__(
        self,
        service_name: str = "External service",
        message: str | None = None,
        context: dict[str,
                      Any] | None = None,
    ) -> None:
        if message is None:
            message = f"An error occurred with {service_name}."
        super().__init__(message, 502, "EXTERNAL_SERVICE_FAILURE", context)


class DatabaseError(AppError):
    """
    Error for when a database operation fails unexpectedly
    """
    def __init__(
        self,
        message: str = "A database error occurred.",
        context: dict[str,
                      Any] | None = None,
    ) -> None:
        super().__init__(message, 500, "DATABASE_ERROR", context)


class EmailServiceError(ServiceError):
    """
    Specific error for email sending failures
    """
    def __init__(
        self,
        message: str = "Failed to send email.",
        context: dict[str,
                      Any] | None = None,
    ) -> None:
        super().__init__(
            service_name = "Email service",
            message = message,
            context = context
        )
