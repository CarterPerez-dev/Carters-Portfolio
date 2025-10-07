"""
Cache Key Builder Utilities
/api/core/cache/keys.py
"""

import redis
import hashlib
from typing import Any
from flask import request
from .enums import CacheNamespace

from config import Config


class CacheKeyBuilder:
    """
    Utility class for building consistent cache keys
    """
    @staticmethod
    def build(
        namespace: str | CacheNamespace,
        identifier: str,
        *args: Any,
        version: str = Config.CACHE_KEY_VERSION,
        **kwargs: Any
    ) -> str:
        """
        Build a cache key with namespace and version
        """
        parts = [version, str(namespace), identifier]

        for arg in args:
            if arg is not None:
                parts.append(str(arg))

        for key in sorted(kwargs.keys()):
            value = kwargs[key]
            if value is not None:
                parts.append(f"{key}={value}")

        return ':'.join(parts)

    @staticmethod
    def build_from_request(
        namespace: str | CacheNamespace,
        identifier: str,
        vary_on: list[str] | None = None,
        include_path: bool = True
    ) -> str:
        """
        Build cache key from current Flask request
        """
        if not request:
            return CacheKeyBuilder.build(namespace, identifier)

        parts = [Config.CACHE_KEY_VERSION, str(namespace), identifier]

        if include_path:
            path = request.path.replace('/', ':')
            parts.append(path)

        if vary_on:
            for param in sorted(vary_on):
                value = request.args.get(param)
                if value is not None:
                    parts.append(f"{param}={value}")

        return ':'.join(parts)

    @staticmethod
    def hash_key(key: str, max_length: int = 200) -> str:
        """
        Hash a key if it's too long
        """
        if len(key) <= max_length:
            return key

        prefix = key[: 100]
        key_hash = hashlib.md5(key.encode()).hexdigest()[: 16]
        return f"{prefix}:{key_hash}"

    @staticmethod
    def build_pattern(namespace: str | CacheNamespace, pattern: str = '*') -> str:
        """
        Build pattern for cache invalidation
        """
        return f"{Config.CACHE_KEY_VERSION}:{namespace}:{pattern}"

    @staticmethod
    def extract_namespace(key: str) -> str | None:
        """
        Extract namespace from cache key
        """
        parts = key.split(':')
        if len(parts) >= 2:
            return parts[1]
        return None


class CacheTags:
    """
    Cache tagging system for grouped invalidation
    """
    @staticmethod
    def tag_key(tag: str) -> str:
        """
        Get key for storing tag members
        """
        return f"tag:{tag}:members"

    @staticmethod
    def add_to_tag(cache_manager: Any, tag: str, *keys: str) -> None:
        """
        Add keys to a tag for grouped invalidation
        """
        if cache_manager.client:
            try:
                tag_key = CacheTags.tag_key(tag)
                cache_manager.client.sadd(tag_key, *keys)
                cache_manager.client.expire(tag_key, Config.CACHE_TAG_TTL)
            except (AttributeError, TypeError, redis.RedisError):
                pass

    @staticmethod
    def invalidate_tag(cache_manager: Any, tag: str) -> int:
        """
        Invalidate all keys associated with a tag
        """
        if not cache_manager.client:
            return 0

        try:
            tag_key = CacheTags.tag_key(tag)
            members = cache_manager.client.smembers(tag_key)
            if members:
                count = cache_manager.delete(*members)
                cache_manager.delete(tag_key)
                return count
            return 0
        except (AttributeError, TypeError, redis.RedisError):
            return 0
