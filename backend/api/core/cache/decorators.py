"""
Cache Decorators
/api/core/cache/decorators.py
"""

import redis
import logging
from typing import (
    Any,
    TypeVar,
    cast,
)
from config import Config
from functools import wraps
from flask import current_app
from collections.abc import Callable

from .enums import CacheNamespace
from .extension import flask_redis
from .keys import CacheKeyBuilder, CacheTags



logger = logging.getLogger(__name__)


F = TypeVar('F', bound = Callable[..., Any])


def cached(
    namespace: str | CacheNamespace,
    ttl: int = Config.CACHE_DEFAULT_TTL,
    key_builder: Callable[..., str] | None = None,
    vary_on: list[str] | None = None,
    unless: Callable[[], bool] | None = None,
    tag: str | None = None
) -> Callable[[F],
              F]:
    """
    Smart caching decorator for functions
    """
    def decorator(func: F) -> F:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            if unless and unless():
                logger.debug(
                    "Cache bypassed for %s due to unless condition",
                    func.__name__
                )
                return func(*args, **kwargs)

            if not current_app.config.get('CACHE_ENABLED', True):
                return func(*args, **kwargs)

            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            elif vary_on:
                cache_key = CacheKeyBuilder.build_from_request(
                    namespace = namespace,
                    identifier = func.__name__,
                    vary_on = vary_on
                )
            else:
                cache_key = CacheKeyBuilder.build(
                    namespace,
                    func.__name__,
                    *args,
                    **kwargs
                )

            cache_key = CacheKeyBuilder.hash_key(cache_key)

            cached_value = flask_redis.get(cache_key)
            if cached_value is not None:
                logger.debug("Cache HIT: %s", cache_key)
                return cached_value

            logger.debug("Cache MISS: %s", cache_key)

            result = func(*args, **kwargs)

            if result is not None:
                if isinstance(result, tuple) and len(result) == 2:
                    data, status_code = result
                    if status_code >= 400:
                        logger.debug("Not caching error response: %s", status_code)
                        return result

                if flask_redis.set(cache_key, result, ttl):
                    logger.debug("Cached with TTL %ss: %s", ttl, cache_key)

                    if tag:
                        CacheTags.add_to_tag(flask_redis, tag, cache_key)

            return result

        wrapper.invalidate = lambda: flask_redis.delete_pattern(
            CacheKeyBuilder.build_pattern(namespace, '*')
        )
        wrapper.cache_key_builder = CacheKeyBuilder

        return cast(F, wrapper)

    return decorator


def cache_invalidate(
    namespace: str | CacheNamespace,
    pattern: str | None = None,
    tag: str | None = None
) -> Callable[[F],
              F]:
    """
    Decorator to invalidate cache after function execution
    """
    def decorator(func: F) -> F:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            result = func(*args, **kwargs)

            try:
                if tag:
                    count = CacheTags.invalidate_tag(flask_redis, tag)
                    logger.info("Invalidated %s cached items for tag: %s", count, tag)
                else:
                    pattern_to_use = pattern or '*'
                    cache_pattern = CacheKeyBuilder.build_pattern(
                        namespace,
                        pattern_to_use
                    )
                    count = flask_redis.delete_pattern(cache_pattern)
                    logger.info(
                        "Invalidated %s cached items matching: %s",
                        count,
                        cache_pattern
                    )
            except (redis.ConnectionError, redis.TimeoutError, AttributeError) as e:
                logger.warning("Cache invalidation failed: %s", e)

            return result

        return cast(F, wrapper)

    return decorator


def cache_warmup(
    functions: list[tuple[Callable,
                          tuple,
                          dict]]
) -> None:
    """
    Warmup cache by pre populating with common queries
    """
    for func, args, kwargs in functions:
        try:
            func(*args, **kwargs)
            logger.debug(
                "Warmed up: %s with args=%s, kwargs=%s",
                func.__name__,
                args,
                kwargs
            )
        except (TypeError, ValueError, AttributeError) as e:
            logger.warning("Cache warmup failed for %s: %s", func.__name__, e)
