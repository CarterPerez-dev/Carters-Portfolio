"""
Blog Type Definitions
/api/blogs/types.py
"""

from datetime import datetime
from typing import TypedDict, NotRequired


class BlogDict(TypedDict):
    """
    Type definition for blog dictionary
    """
    _id: str
    title: str
    slug: str
    content: str
    excerpt: str
    author: str
    published: bool
    featured_image: str | None
    tags: list[str]
    meta_description: str
    created_at: datetime
    updated_at: datetime


class BlogPreviewDict(TypedDict):
    """
    Type definition for blog preview dictionary
    """
    _id: str
    title: str
    slug: str
    excerpt: str
    author: str
    published: bool
    featured_image: str | None
    tags: list[str]
    meta_description: str
    created_at: datetime
    updated_at: datetime


class BlogListDict(TypedDict):
    """
    Type definition for blog list response
    """
    blogs: list[BlogPreviewDict]
    total: int
    limit: int
    offset: NotRequired[int]


class BlogCreateDict(TypedDict):
    """
    Type definition for blog creation response
    """
    blog_id: str
    slug: str
    published: bool
