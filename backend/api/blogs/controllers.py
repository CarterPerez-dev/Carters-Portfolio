"""
Blog Controllers
/api/blogs/controllers.py
"""

from flask import g
from api.core.validation.exceptions import (
    ConflictError,
    ValidationError,
)
from api.core.cache import cached, cache_invalidate
from api.core.cache.enums import CacheNamespace

from ...config import Config
from .Blog import Blog
from .types import (
    BlogDict, 
    BlogPreviewDict, 
    BlogListDict, 
    BlogCreateDict,
)


@cache_invalidate(namespace = CacheNamespace.BLOG)
def create_blog() -> BlogCreateDict:
    """
    Create a new blog post
    """
    try:
        blog = Blog.create_blog(g.validated)

        return BlogCreateDict(
            blog_id = str(blog.id),
            slug = blog.slug,
            published = blog.published
        )
    except Exception as e:
        if "E11000" in str(e):
            raise ConflictError(
                message = "A blog with this slug already exists",
                error_code = "DUPLICATE_SLUG"
            ) from e
        raise


@cached(
    namespace = CacheNamespace.BLOG,
    ttl = Config.CACHE_BLOG_TTL,
    tag = 'blog_posts'
)
def get_blog_by_slug(slug: str) -> BlogDict:
    """
    Get a blog post by slug (only returns published blogs for public)
    """
    blog = Blog.get_by_slug(slug)

    if not blog.published:
        raise ValidationError("Blog is not published")

    return BlogDict(**blog.to_dict())


@cached(
    namespace = CacheNamespace.BLOG,
    ttl = Config.CACHE_BLOG_TTL,
    tag = 'blog_posts'
)
def get_blog_by_id(blog_id: str) -> BlogDict:
    """
    Get a blog post by ID (admin - returns all blogs)
    """
    blog = Blog.get_by_id(blog_id)
    return BlogDict(**blog.to_dict())


@cached(
    namespace = CacheNamespace.BLOG,
    ttl = Config.CACHE_BLOG_TTL,
    vary_on = ['limit',
               'offset']
)
def get_published_blogs(
    limit: int = Config.BLOG_DEFAULT_LIST_LIMIT,
    offset: int = 0
) -> BlogListDict:
    """
    Get published blog posts with pagination
    """
    blogs = Blog.get_published_posts(limit = limit)

    blog_previews = [BlogPreviewDict(**blog.to_preview_dict()) for blog in blogs]

    total_count = Blog.objects(published = True).count()

    return BlogListDict(
        blogs = blog_previews,
        total = total_count,
        limit = limit,
        offset = offset
    )


@cached(
    namespace = CacheNamespace.BLOG,
    ttl = Config.CACHE_ADMIN_TTL,
    vary_on = ['limit',
               'offset']
)
def get_all_blogs(
    limit: int = Config.BLOG_DEFAULT_LIST_LIMIT,
    offset: int = 0
) -> BlogListDict:
    """
    Get all blog posts including drafts (admin)
    """
    blogs = Blog.objects().order_by('-createdAt').skip(offset).limit(limit)

    blog_previews = [BlogPreviewDict(**blog.to_preview_dict()) for blog in blogs]

    total_count = Blog.objects().count()

    return BlogListDict(
        blogs = blog_previews,
        total = total_count,
        limit = limit,
        offset = offset
    )


@cache_invalidate(namespace = CacheNamespace.BLOG)
def update_blog(blog_id: str) -> BlogCreateDict:
    """
    Update an existing blog post
    """
    blog = Blog.get_by_id(blog_id)

    update_data = g.validated

    for field, value in update_data.items():
        if value is not None:
            setattr(blog, field, value)

    blog.save()

    return BlogCreateDict(
        blog_id = str(blog.id),
        slug = blog.slug,
        published = blog.published
    )


@cache_invalidate(namespace = CacheNamespace.BLOG)
def delete_blog(blog_id: str) -> dict[str, str | bool]:
    """
    Delete a blog post (admin)
    """
    blog = Blog.get_by_id(blog_id)
    blog.delete()

    return {"message": "Blog deleted successfully", "deleted": True}


def search_blogs_controller() -> BlogListDict:
    """
    Controller for blog search
    """
    search_data = g.validated
    query = search_data.get('query')
    tag = search_data.get('tag')
    limit = search_data.get('limit', Config.BLOG_DEFAULT_LIST_LIMIT)

    return search_blogs(query = query, tag = tag, limit = limit)


@cached(namespace = CacheNamespace.BLOG, ttl = Config.CACHE_BLOG_SEARCH_TTL)
def search_blogs(
    query: str,
    tag: str | None = None,
    limit: int = Config.BLOG_DEFAULT_LIST_LIMIT
) -> BlogListDict:
    """
    Search published blogs by query and/or tag
    """
    if tag:
        blogs = Blog.get_by_tag(tag = tag, limit = limit)
    else:
        blogs = Blog.search_published(query = query, limit = limit)

    blog_previews = [BlogPreviewDict(**blog.to_preview_dict()) for blog in blogs]

    return BlogListDict(
        blogs = blog_previews,
        total = len(blog_previews),
        limit = limit,
        offset = 0
    )


@cached(namespace = CacheNamespace.BLOG, ttl = Config.CACHE_BLOG_TTL)
def get_blogs_by_tag(
    tag: str,
    limit: int = Config.BLOG_DEFAULT_LIST_LIMIT
) -> BlogListDict:
    """
    Get published blogs filtered by tag
    """
    blogs = Blog.get_by_tag(tag = tag, limit = limit)

    blog_previews = [BlogPreviewDict(**blog.to_preview_dict()) for blog in blogs]

    total_count = Blog.objects(published = True, tags = tag.lower()).count()

    return BlogListDict(
        blogs = blog_previews,
        total = total_count,
        limit = limit,
        offset = 0
    )


@cache_invalidate(namespace = CacheNamespace.BLOG)
def publish_blog(blog_id: str) -> BlogCreateDict:
    """
    Publish a draft blog post
    """
    blog = Blog.get_by_id(blog_id)

    if blog.published:
        raise ConflictError(
            message = "Blog is already published",
            error_code = "ALREADY_PUBLISHED"
        )

    blog.published = True
    blog.save()

    return BlogCreateDict(
        blog_id = str(blog.id),
        slug = blog.slug,
        published = blog.published
    )


@cache_invalidate(namespace = CacheNamespace.BLOG)
def unpublish_blog(blog_id: str) -> BlogCreateDict:
    """
    Unpublish a blog post (convert to draft)
    """
    blog = Blog.get_by_id(blog_id)

    if not blog.published:
        raise ConflictError(
            message = "Blog is already unpublished",
            error_code = "ALREADY_UNPUBLISHED"
        )

    blog.published = False
    blog.save()

    return BlogCreateDict(
        blog_id = str(blog.id),
        slug = blog.slug,
        published = blog.published
    )
