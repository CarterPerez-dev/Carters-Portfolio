"""
Blog API Schemas
/api/blogs/schemas.py
"""

import re
from pydantic import (
    BaseModel,
    Field,
    HttpUrl,
    validator,
)
from datetime import datetime

from config import Config


class BlogCreateRequest(BaseModel):
    """
    Request schema for creating a new blog post
    """
    title: str = Field(
        ...,
        min_length = 1,
        max_length = Config.BLOG_TITLE_MAX_LENGTH,
        description = "Blog post title"
    )

    slug: str | None = Field(
        None,
        min_length = Config.BLOG_SLUG_MIN_LENGTH,
        max_length = Config.BLOG_SLUG_MAX_LENGTH,
        description = "URL-friendly slug (auto-generated if not provided)"
    )

    content: str = Field(
        ...,
        min_length = 1,
        description = "Blog post content (HTML/Markdown supported)"
    )

    excerpt: str = Field(
        ...,
        min_length = 1,
        max_length = Config.BLOG_EXCERPT_MAX_LENGTH,
        description = "Short preview of the blog post"
    )

    author: str = Field(
        default = "Portfolio Author",
        max_length = Config.BLOG_AUTHOR_MAX_LENGTH,
        description = "Author name"
    )

    published: bool = Field(default = False, description = "Publication status")

    featured_image: HttpUrl | None = Field(None, description = "Featured image URL")

    tags: list[str] = Field(default_factory = list, description = "List of tags")

    meta_description: str = Field(
        ...,
        min_length = 1,
        max_length = Config.BLOG_META_DESCRIPTION_MAX_LENGTH,
        description = "SEO meta description"
    )

    @validator('title', 'content', 'excerpt', 'meta_description')
    def strip_whitespace(cls, v: str) -> str:
        """
        Strip whitespace from text fields
        """
        return v.strip()

    @validator('slug')
    def validate_slug(cls, v: str | None) -> str | None:
        """
        Validate slug format if provided
        """
        if v:
            cleaned = re.sub(r'[^\w-]', '', v.lower())
            return cleaned.strip('-') if cleaned else None
        return v

    @validator('tags')
    def clean_tags(cls, v: list[str]) -> list[str]:
        """
        Clean and validate tags
        """
        cleaned_tags = []
        for tag in v:
            if isinstance(tag, str):
                clean_tag = tag.strip().lower()
                if clean_tag and len(clean_tag) <= Config.BLOG_TAG_MAX_LENGTH:
                    cleaned_tags.append(clean_tag)
        return list(set(cleaned_tags))


class BlogUpdateRequest(BaseModel):
    """
    Request schema for updating a blog post
    """
    title: str | None = Field(
        None,
        min_length = 1,
        max_length = Config.BLOG_TITLE_MAX_LENGTH,
        description = "Blog post title"
    )

    content: str | None = Field(None, min_length = 1, description = "Blog post content")

    excerpt: str | None = Field(
        None,
        min_length = 1,
        max_length = Config.BLOG_EXCERPT_MAX_LENGTH,
        description = "Short preview"
    )

    author: str | None = Field(
        None,
        max_length = Config.BLOG_AUTHOR_MAX_LENGTH,
        description = "Author name"
    )

    published: bool | None = Field(None, description = "Publication status")

    featured_image: HttpUrl | None = Field(None, description = "Featured image URL")

    tags: list[str] | None = Field(None, description = "List of tags")

    meta_description: str | None = Field(
        None,
        min_length = 1,
        max_length = Config.BLOG_META_DESCRIPTION_MAX_LENGTH,
        description = "SEO meta description"
    )

    @validator('title', 'content', 'excerpt', 'meta_description')
    def strip_whitespace(cls, v: str | None) -> str | None:
        """
        Strip whitespace from text fields
        """
        return v.strip() if v else None

    @validator('tags')
    def clean_tags(cls, v: list[str] | None) -> list[str] | None:
        """
        Clean and validate tags
        """
        if v is None:
            return None
        cleaned_tags = []
        for tag in v:
            if isinstance(tag, str):
                clean_tag = tag.strip().lower()
                if clean_tag and len(clean_tag) <= Config.BLOG_TAG_MAX_LENGTH:
                    cleaned_tags.append(clean_tag)
        return list(set(cleaned_tags)) if cleaned_tags else None


class BlogResponse(BaseModel):
    """
    Response schema for full blog post
    """
    id: str = Field(..., alias = "_id", description = "Blog post ID")
    title: str = Field(..., description = "Blog post title")
    slug: str = Field(..., description = "URL-friendly slug")
    content: str = Field(..., description = "Blog post content")
    excerpt: str = Field(..., description = "Short preview")
    author: str = Field(..., description = "Author name")
    published: bool = Field(..., description = "Publication status")
    featured_image: str | None = Field(None, description = "Featured image URL")
    tags: list[str] = Field(..., description = "List of tags")
    meta_description: str = Field(..., description = "SEO meta description")
    created_at: datetime = Field(..., description = "Creation timestamp")
    updated_at: datetime = Field(..., description = "Last update timestamp")


class BlogPreviewResponse(BaseModel):
    """
    Response schema for blog post preview (list view)
    """
    id: str = Field(..., alias = "_id", description = "Blog post ID")
    title: str = Field(..., description = "Blog post title")
    slug: str = Field(..., description = "URL-friendly slug")
    excerpt: str = Field(..., description = "Short preview")
    author: str = Field(..., description = "Author name")
    published: bool = Field(..., description = "Publication status")
    featured_image: str | None = Field(None, description = "Featured image URL")
    tags: list[str] = Field(..., description = "List of tags")
    meta_description: str = Field(..., description = "SEO meta description")
    created_at: datetime = Field(..., description = "Creation timestamp")
    updated_at: datetime = Field(..., description = "Last update timestamp")


class BlogListResponse(BaseModel):
    """
    Response schema for blog list
    """
    blogs: list[BlogPreviewResponse] = Field(..., description = "List of blog previews")
    total: int = Field(..., description = "Total number of blogs")
    limit: int = Field(..., description = "Results limit")
    offset: int = Field(default = 0, description = "Results offset")


class BlogCreateResponse(BaseModel):
    """
    Response schema for successful blog creation
    """
    blog_id: str = Field(..., description = "Created blog ID")
    slug: str = Field(..., description = "Generated slug")
    published: bool = Field(..., description = "Publication status")


class BlogSearchRequest(BaseModel):
    """
    Request schema for blog search
    """
    query: str = Field(..., min_length = 1, description = "Search query")
    tag: str | None = Field(None, description = "Filter by tag")
    limit: int = Field(
        default = Config.BLOG_DEFAULT_LIST_LIMIT,
        ge = 1,
        le = 100,
        description = "Results limit"
    )
