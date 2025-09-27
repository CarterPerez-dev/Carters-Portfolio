"""
Flask-Redis Extension
/api/core/cache/extension.py
"""

import json
import redis
import logging
from typing import Any
from flask import Flask, current_app

from ....config import Config


logger = logging.getLogger(__name__)


class FlaskRedis:
    """
    Flask extension for Redis caching
    """
    def __init__(self, app: Flask | None = None):
        self.app = app
        self._redis_client: redis.Redis | None = None
        self._connection_pool: redis.ConnectionPool | None = None

        if app is not None:
            self.init_app(app)

    def init_app(self, app: Flask) -> None:
        """
        Initialize the Flask Redis extension
        """
        app.config.setdefault('REDIS_URL', Config.REDIS_URL)
        app.config.setdefault('CACHE_ENABLED', Config.CACHE_ENABLED)
        app.config.setdefault('REDIS_MAX_CONNECTIONS', Config.REDIS_MAX_CONNECTIONS)
        app.config.setdefault(
            'REDIS_SOCKET_CONNECT_TIMEOUT',
            Config.REDIS_SOCKET_CONNECT_TIMEOUT
        )
        app.config.setdefault('REDIS_SOCKET_TIMEOUT', Config.REDIS_SOCKET_TIMEOUT)
        app.config.setdefault(
            'REDIS_RETRY_ON_TIMEOUT',
            Config.REDIS_RETRY_ON_TIMEOUT
        )
        app.config.setdefault(
            'REDIS_HEALTH_CHECK_INTERVAL',
            Config.REDIS_HEALTH_CHECK_INTERVAL
        )

        app.extensions = getattr(app, 'extensions', {})
        app.extensions['redis'] = self

        with app.app_context():
            self._initialize_connection()

    def _initialize_connection(self) -> None:
        """
        Initialize Redis connection with app context
        """
        if not current_app.config.get('CACHE_ENABLED'):
            return

        try:
            self._connection_pool = redis.ConnectionPool.from_url(
                current_app.config['REDIS_URL'],
                max_connections = current_app.config['REDIS_MAX_CONNECTIONS'],
                socket_connect_timeout = current_app.
                config['REDIS_SOCKET_CONNECT_TIMEOUT'],
                socket_timeout = current_app.config['REDIS_SOCKET_TIMEOUT'],
                retry_on_timeout = current_app.config['REDIS_RETRY_ON_TIMEOUT'],
                health_check_interval = current_app.
                config['REDIS_HEALTH_CHECK_INTERVAL']
            )

            self._redis_client = redis.Redis(
                connection_pool = self._connection_pool,
                decode_responses = True
            )

            self._redis_client.ping()
            logger.info("Redis cache connected successfully")

        except (redis.ConnectionError, redis.TimeoutError) as e:
            logger.warning("Redis connection failed: %s", e)
            self._redis_client = None
        except (OSError, ValueError, TypeError) as e:
            logger.error("Unexpected Redis error: %s", e)
            self._redis_client = None

    @property
    def client(self) -> redis.Redis | None:
        """
        Get Redis client
        """
        if self._redis_client is None and current_app:
            self._initialize_connection()
        return self._redis_client

    def get(self, key: str) -> Any | None:
        """
        Get value from cache
        """
        if not self.client:
            return None

        try:
            value = self.client.get(key)
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None

        except (redis.ConnectionError, redis.TimeoutError) as e:
            logger.debug("Cache get failed for %s: %s", key, e)
            return None
        except (OSError, ValueError, TypeError) as e:
            logger.warning("Unexpected cache get error for %s: %s", key, e)
            return None

    def set(
        self,
        key: str,
        value: Any,
        ttl: int | None = None,
        nx: bool = False
    ) -> bool:
        """
        Set value in cache
        """
        if not self.client:
            return False

        try:
            if isinstance(value, dict | list | tuple) or not isinstance(value, str):
                value = json.dumps(value, default = str)

            if nx:
                result = self.client.set(key, value, ex = ttl, nx = True)
            else:
                if ttl:
                    result = self.client.setex(key, ttl, value)
                else:
                    result = self.client.set(key, value)

            return bool(result)

        except (redis.ConnectionError, redis.TimeoutError) as e:
            logger.debug("Cache set failed for %s: %s", key, e)
            return False
        except (OSError, ValueError, TypeError) as e:
            logger.warning("Unexpected cache set error for %s: %s", key, e)
            return False

    def delete(self, *keys: str) -> int:
        """
        Delete keys from cache
        """
        if not self.client or not keys:
            return 0

        try:
            return self.client.delete(*keys)
        except (redis.ConnectionError, redis.TimeoutError, OSError) as e:
            logger.debug("Cache delete failed: %s", e)
            return 0

    def delete_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching pattern
        """
        if not self.client:
            return 0

        try:
            keys = list(self.client.scan_iter(match = pattern, count = 100))
            if keys:
                return self.client.delete(*keys)
            return 0
        except (redis.ConnectionError, redis.TimeoutError, OSError) as e:
            logger.debug("Cache pattern delete failed: %s", e)
            return 0

    def exists(self, key: str) -> bool:
        """
        Check if key exists
        """
        if not self.client:
            return False

        try:
            return bool(self.client.exists(key))
        except (redis.ConnectionError, redis.TimeoutError, OSError):
            return False

    def health_check(self) -> bool:
        """
        Check Redis health
        """
        if not self.client:
            return False

        try:
            return self.client.ping()
        except (redis.ConnectionError, redis.TimeoutError, OSError):
            return False


flask_redis = FlaskRedis()
