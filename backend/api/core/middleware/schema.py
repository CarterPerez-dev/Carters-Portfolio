"""
Portfolio API Unified Schema Decorator
"""

import json
import logging
import contextlib
from typing import Any
from functools import wraps
from flask import g, request
from collections.abc import Callable
from pydantic import BaseModel, ValidationError
from werkzeug.exceptions import (
    UnsupportedMediaType,
    BadRequest,
)


logger = logging.getLogger(__name__)


def schema(
    req: type[BaseModel] | None = None,
    res: type[BaseModel] | None = None
) -> Callable[[Callable[...,
                        Any]],
              Callable[...,
                       Any]]:
    """
    Unified Pydantic schema validation decorator for request and response
    """
    def decorator(f: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            if req:
                try:
                    data = None
                    content_type = request.content_type or ""

                    if content_type.startswith('application/json'):
                        data = request.get_json()
                    elif content_type.startswith(
                        ('application/x-www-form-urlencoded',
                         'multipart/form-data')):
                        data = {}
                        for key, value in request.form.items():
                            try:
                                data[key] = json.loads(
                                    value
                                ) if value.startswith(
                                    ('{',
                                     '[')
                                ) else value
                            except (json.JSONDecodeError, ValueError):
                                data[key] = value
                    else:
                        with contextlib.suppress(UnsupportedMediaType):
                            data = request.get_json(silent = True)

                        if not data and request.form:
                            data = dict(request.form)
                        elif not data:
                            data = dict(request.args)

                    if data is None:
                        data = {}

                    validated_data: BaseModel = req(**data)
                    g.validated = validated_data.model_dump()
                    g.validated_model = validated_data

                except ValidationError as e:
                    errors: dict[str, str] = {}
                    for error in e.errors():
                        field: str = ".".join(str(x) for x in error["loc"])
                        errors[field] = error["msg"]

                    return {"error": "Validation failed", "errors": errors}, 400
                except (UnsupportedMediaType, BadRequest) as e:
                    if isinstance(e, UnsupportedMediaType):
                        return {
                            "error": "Invalid content type",
                            "message": "Content-Type must be application/json"
                        }, 400
                    return {"error": "Invalid JSON", "message": "Request body must be valid JSON"}, 400
                except Exception as e:
                    logger.error("Schema validation error: %s", e)
                    return {"error": "Invalid request data"}, 400

            result = f(*args, **kwargs)

            if res:
                try:
                    if isinstance(result, tuple):
                        data, status_code = result
                        if isinstance(data, dict):
                            validated = res(**data)
                            return validated.model_dump(mode='json'), status_code
                        return result

                    if isinstance(result, dict):
                        validated = res(**result)
                        return validated.model_dump(mode = 'json')

                    if isinstance(result, BaseModel):
                        if isinstance(result, res):
                            return result.model_dump(mode = 'json')
                        validated = res(**result.model_dump())
                        return validated.model_dump(mode = 'json')

                    return result
                except Exception as e:
                    logger.error("Response validation error: %s", e)
                    return {"error": "Internal server error"}, 500

            return result

        return wrapper

    return decorator


S = schema
