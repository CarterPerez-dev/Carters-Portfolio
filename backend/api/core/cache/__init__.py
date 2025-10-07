"""
Redis Cache Module
/api/core/cache/__init__.py
"""

from typing import Any
from .enums import CacheNamespace
from .extension import flask_redis
from .keys import CacheKeyBuilder, CacheTags
from .decorators import cached, cache_invalidate, cache_warmup


def invalidate_namespace(namespace: str) -> int:
    """
    Invalidate all cache entries in a namespace
    """
    pattern = CacheKeyBuilder.build_pattern(namespace, '*')
    return flask_redis.delete_pattern(pattern)


def invalidate_pattern(namespace: str, pattern: str) -> int:
    """
    Invalidate cache entries matching pattern in namespace
    """
    full_pattern = CacheKeyBuilder.build_pattern(namespace, pattern)
    return flask_redis.delete_pattern(full_pattern)


def invalidate_tag(tag: str) -> int:
    """
    Invalidate all cache entries with a specific tag
    """
    return CacheTags.invalidate_tag(flask_redis, tag)


def get_cache_stats() -> dict[str, Any]:
    """
    Get cache statistics
    """
    if not flask_redis.client:
        return {'connected': False, 'error': 'Redis not connected'}

    try:
        info = flask_redis.client.info('stats')
        return {
            'connected':
            True,
            'total_connections_received':
            info.get('total_connections_received',
                     0),
            'total_commands_processed':
            info.get('total_commands_processed',
                     0),
            'instantaneous_ops_per_sec':
            info.get('instantaneous_ops_per_sec',
                     0),
            'keyspace_hits':
            info.get('keyspace_hits',
                     0),
            'keyspace_misses':
            info.get('keyspace_misses',
                     0),
            'hit_rate':
            _calculate_hit_rate(
                info.get('keyspace_hits',
                         0),
                info.get('keyspace_misses',
                         0)
            )
        }
    except (AttributeError, TypeError, ValueError) as e:
        return {'connected': False, 'error': str(e)}


def _calculate_hit_rate(hits: int, misses: int) -> float:
    """
    Calculate cache hit rate percentage
    """
    total = hits + misses
    if total == 0:
        return 0.0
    return round((hits / total) * 100, 2)


__all__ = [
    'cached',
    'cache_invalidate',
    'cache_warmup',
    'flask_redis',
    'CacheKeyBuilder',
    'CacheTags',
    'CacheNamespace',
    'invalidate_namespace',
    'invalidate_pattern',
    'invalidate_tag',
    'get_cache_stats'
]
