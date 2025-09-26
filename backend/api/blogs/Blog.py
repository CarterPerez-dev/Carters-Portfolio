"""
Blog Model
/api/blogs/Blog.py
"""

from __future__ import annotations

import re
from ...config import Config
from datetime import datetime
from mongoengine import fields, ValidationError
from api.core.database.Base import BaseDocument
from api.core.validation.exceptions import NotFoundError


class Blog(BaseDocument):
    """
    Blog post model
    """
    meta = {
        'collection':
        'blogs',
        'indexes': [
            'slug',
            'published',
            'createdAt',
            '-createdAt',
            'tags',
            ('published',
             '-createdAt'),
        ]
    }

    title = fields.StringField(
        max_length = Config.BLOG_TITLE_MAX_LENGTH,
        required = True,
        min_length = 1
    )

    slug = fields.StringField(
        max_length = Config.BLOG_SLUG_MAX_LENGTH,
        required = True,
        unique = True
    )

    content = fields.StringField(required = True, min_length = 1)

    excerpt = fields.StringField(
        max_length = Config.BLOG_EXCERPT_MAX_LENGTH,
        required = True,
        min_length = 1
    )

    author = fields.StringField(
        max_length = Config.BLOG_AUTHOR_MAX_LENGTH,
        required = True,
        default = "Portfolio Author"
    )

    published = fields.BooleanField(default = False)

    featured_image = fields.URLField(required = False)

    tags = fields.ListField(
        fields.StringField(max_length = Config.BLOG_TAG_MAX_LENGTH),
        default = list
    )

    meta_description = fields.StringField(
        max_length = Config.BLOG_META_DESCRIPTION_MAX_LENGTH,
        required = True
    )

    def __str__(self) -> str:
        return f"Blog: {self.title} - {'Published' if self.published else 'Draft'}"

    def clean(self):
        """
        Custom validation before saving
        """
        super().clean()

        if not self.slug:
            self.slug = self._generate_slug_from_title()

        if self.slug:
            self.slug = self._clean_slug(self.slug)

        if self.tags:
            self.tags = self._clean_tags(self.tags)

    def _generate_slug_from_title(self) -> str:
        """
        Generate URL-friendly slug from title
        """
        if not self.title:
            return ""

        slug = re.sub(r'[^\w\s-]', '', self.title.lower())
        slug = re.sub(r'[\s_-]+', '-', slug)
        slug = slug.strip('-')
        return slug

    def _clean_slug(self, slug: str) -> str:
        """
        Clean and validate slug format
        """
        cleaned = re.sub(r'[^\w-]', '', slug.lower())
        cleaned = re.sub(r'-+', '-', cleaned)
        cleaned = cleaned.strip('-')

        if not cleaned:
            raise ValidationError('Slug cannot be empty after cleaning')

        if len(cleaned) < Config.BLOG_SLUG_MIN_LENGTH:
            raise ValidationError(
                f'Slug must be at least {Config.BLOG_SLUG_MIN_LENGTH} characters long'
            )

        return cleaned

    def _clean_tags(self, tags: list[str]) -> list[str]:
        """
        Clean and deduplicate tags
        """
        cleaned_tags = []
        seen = set()

        for tag in tags:
            if isinstance(tag, str):
                clean_tag = tag.strip().lower()
                if clean_tag and clean_tag not in seen:
                    cleaned_tags.append(clean_tag)
                    seen.add(clean_tag)

        return cleaned_tags

    @classmethod
    def get_published_posts(
        cls,
        limit: int = Config.BLOG_DEFAULT_LIST_LIMIT
    ) -> list[Blog]:
        """
        Get published blog posts ordered by creation date
        """
        return cls.objects(published = True
                           ).order_by('-createdAt').limit(limit)

    @classmethod
    def get_by_slug(cls, slug: str) -> Blog:
        """
        Get blog by slug, raise NotFoundError if not found
        """
        blog = cls.objects(slug = slug).first()
        if not blog:
            raise NotFoundError(resource_type = "Blog", resource_id = slug)
        return blog

    @classmethod
    def get_by_id(cls, blog_id: str) -> Blog:
        """
        Get blog by ID, raise NotFoundError if not found
        """
        blog = cls.objects(id = blog_id).first()
        if not blog:
            raise NotFoundError(
                resource_type = "Blog",
                resource_id = blog_id
            )
        return blog

    @classmethod
    def create_blog(cls, data: dict) -> Blog:
        """
        Create and save a new blog post
        """
        blog = cls(**data)
        blog.save()
        return blog

    @classmethod
    def get_by_tag(
        cls,
        tag: str,
        limit: int = Config.BLOG_DEFAULT_LIST_LIMIT
    ) -> list[Blog]:
        """
        Get published blogs by tag
        """
        return cls.objects(
            published = True,
            tags = tag.lower()
        ).order_by('-createdAt').limit(limit)

    @classmethod
    def search_published(
        cls,
        query: str,
        limit: int = Config.BLOG_DEFAULT_LIST_LIMIT
    ) -> list[Blog]:
        """
        Search published blogs by title or content
        """
        return cls.objects(
            published = True,
            title__icontains = query
        ).order_by('-createdAt').limit(limit)

    def to_dict(self) -> dict:
        """
        Convert blog to dict for API responses
        """
        return {
            "_id": str(self.id),
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "excerpt": self.excerpt,
            "author": self.author,
            "published": self.published,
            "featured_image": self.featured_image,
            "tags": self.tags,
            "meta_description": self.meta_description,
            "created_at": self.createdAt,
            "updated_at": self.updatedAt
        }

    def to_preview_dict(self) -> dict:
        """
        Convert blog to preview dict
        """
        return {
            "_id": str(self.id),
            "title": self.title,
            "slug": self.slug,
            "excerpt": self.excerpt,
            "author": self.author,
            "published": self.published,
            "featured_image": self.featured_image,
            "tags": self.tags,
            "meta_description": self.meta_description,
            "created_at": self.createdAt,
            "updated_at": self.updatedAt
        }
