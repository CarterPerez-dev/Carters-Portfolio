"""
Cache Enums
/api/core/cache/enums.py
"""

from enum import Enum


class CacheNamespace(str, Enum):
    """
    Cache namespace enumeration
    """
    BLOG = 'blog'
    CONTACT = 'contact'
    PROJECT = 'project'
    GITHUB = 'github'

    def __str__(self) -> str:
        return self.value
