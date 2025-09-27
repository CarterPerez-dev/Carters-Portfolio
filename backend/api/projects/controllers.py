"""
Project Controllers
/api/projects/controllers.py
"""

import logging
from typing import Any
from flask import g
from api.core.cache.enums import CacheNamespace
from api.core.cache import (
    cached, 
    cache_invalidate,
    invalidate_namespace,
)
from api.core.validation.exceptions import (
    NotFoundError,
)
from ...config import Config
from .Project import Project
from .types import (
    ProjectDict,
    ProjectPreviewDict,
    ProjectListDict,
    ProjectUpdateDict,
    WebhookResponseDict
)
from .webhooks import GitHubWebhookHandler


logger = logging.getLogger(__name__)


@cached(
    namespace = CacheNamespace.PROJECT,
    ttl = Config.CACHE_BLOG_TTL,
    tag = 'projects'
)
def get_projects(
    limit: int = Config.PROJECT_DEFAULT_LIST_LIMIT,
    featured_only: bool = False
) -> ProjectListDict:
    """
    Get visible projects for portfolio display
    """
    projects = Project.get_visible_projects(
        limit = limit,
        featured_only = featured_only
    )

    project_previews = [
        ProjectPreviewDict(**project.to_preview_dict()) for project in projects
    ]

    featured_count = sum(1 for p in project_previews if p['featured'])

    return ProjectListDict(
        projects = project_previews,
        total = len(project_previews),
        limit = limit,
        featured_count = featured_count
    )


@cached(
    namespace = CacheNamespace.PROJECT,
    ttl = Config.CACHE_BLOG_TTL,
    tag = 'projects'
)
def get_project_by_id(project_id: str) -> ProjectDict:
    """
    Get a project by MongoDB ID
    """
    try:
        project = Project.objects(id = project_id, is_visible = True).first()
        if not project:
            raise NotFoundError(resource_type = "Project", resource_id = project_id)

        return ProjectDict(**project.to_dict())
    except Exception as e:
        logger.error("Error getting project %s: %s", project_id, e)
        raise


@cached(
    namespace = CacheNamespace.PROJECT,
    ttl = Config.CACHE_BLOG_TTL,
    tag = 'projects'
)
def get_project_by_github_id(github_id: int) -> ProjectDict:
    """
    Get a project by GitHub ID
    """
    project = Project.get_by_github_id(github_id)

    if not project.is_visible:
        raise NotFoundError(resource_type = "Project", resource_id = str(github_id))

    return ProjectDict(**project.to_dict())


@cache_invalidate(namespace = CacheNamespace.PROJECT, tag = 'projects')
def update_project(project_id: str) -> ProjectUpdateDict:
    """
    Update project display settings (admin)
    """
    project = Project.objects(id = project_id).first()
    if not project:
        raise NotFoundError(resource_type = "Project", resource_id = project_id)

    update_data = g.validated
    updated_fields = []

    allowed_fields = [
        'custom_title',
        'custom_description',
        'long_description',
        'featured',
        'display_order',
        'is_visible',
        'tech_stack',
        'project_type',
        'demo_url',
        'documentation_url',
        'case_study_url',
        'screenshots',
        'thumbnail_url'
    ]

    for field in allowed_fields:
        if field in update_data:
            setattr(project, field, update_data[field])
            updated_fields.append(field)

    if updated_fields:
        project.popularity_score = project.calculate_popularity_score()
        project.activity_score = project.calculate_activity_score()
        project.save()

    return ProjectUpdateDict(
        project_id = str(project.id),
        github_id = project.github_id,
        updated_fields = updated_fields
    )


@cache_invalidate(namespace = CacheNamespace.PROJECT)
def toggle_project_visibility(project_id: str) -> dict[str, str | bool]:
    """
    Toggle project visibility (admin)
    """
    project = Project.objects(id = project_id).first()
    if not project:
        raise NotFoundError(resource_type = "Project", resource_id = project_id)

    project.is_visible = not project.is_visible
    project.save()

    logger.info(
        "Project %s visibility toggled to %s",
        project.github_full_name,
        project.is_visible
    )

    return {"project_id": str(project.id), "is_visible": project.is_visible}


@cache_invalidate(namespace = CacheNamespace.PROJECT)
def toggle_project_featured(project_id: str) -> dict[str, str | bool]:
    """
    Toggle project featured status (admin)
    """
    project = Project.objects(id = project_id).first()
    if not project:
        raise NotFoundError(resource_type = "Project", resource_id = project_id)

    project.featured = not project.featured
    project.save()

    logger.info(
        "Project %s featured status toggled to %s",
        project.github_full_name,
        project.featured
    )

    return {"project_id": str(project.id), "featured": project.featured}


def process_github_webhook() -> WebhookResponseDict:
    """
    Process incoming GitHub webhook
    """
    handler = GitHubWebhookHandler()
    result = handler.process_webhook()

    if result.get('status') == 'processed':        
        invalidate_namespace(CacheNamespace.PROJECT)

    return WebhookResponseDict(
        status = result.get('status',
                            'unknown'),
        event = result.get('event'),
        delivery_id = result.get('delivery_id'),
        result = result.get('result')
    )


@cached(
    namespace = CacheNamespace.PROJECT,
    ttl = 300,  # TODO config
    tag = 'stats'
)
def get_project_stats() -> dict[str, int | float | dict[str, int]]:
    """
    Get aggregate project statistics
    """
    visible_projects = Project.objects(is_visible = True, is_private = False)

    total_stars = sum(p.stars_count for p in visible_projects)
    total_forks = sum(p.forks_count for p in visible_projects)

    active_projects = [p for p in visible_projects if p.activity_score > 50]

    featured_projects = [p for p in visible_projects if p.featured]

    languages: dict[str, int] = {}
    for project in visible_projects:
        if project.primary_language:
            languages[project.primary_language
                      ] = languages.get(project.primary_language,
                                        0) + 1

    return {
        "total_projects":
        visible_projects.count(),
        "featured_projects":
        len(featured_projects),
        "active_projects":
        len(active_projects),
        "total_stars":
        total_stars,
        "total_forks":
        total_forks,
        "top_languages":
        dict(sorted(languages.items(),
                    key = lambda x: x[1],
                    reverse = True)[: 5])
    }


def search_projects_controller() -> ProjectListDict:
    """
    Controller for project search
    """
    search_data = g.validated
    query = search_data.get('query')
    language = search_data.get('language')
    project_type = search_data.get('project_type')
    limit = search_data.get('limit', Config.PROJECT_DEFAULT_LIST_LIMIT)

    return search_projects(
        query = query,
        language = language,
        project_type = project_type,
        limit = limit
    )


@cached(
    namespace = CacheNamespace.PROJECT,
    ttl = Config.CACHE_BLOG_TTL,
    vary_on = ['language',
               'project_type']
)
def search_projects(
    query: str | None = None,
    language: str | None = None,
    project_type: str | None = None,
    limit: int = Config.PROJECT_DEFAULT_LIST_LIMIT
) -> ProjectListDict:
    """
    Search and filter projects
    """
    filters: dict[str, Any] = {'is_visible': True, 'is_private': False}

    if language:
        filters['primary_language'] = language

    if project_type:
        filters['project_type'] = project_type

    projects = Project.objects(**filters)

    if query:
        query_lower = query.lower()
        projects = [
            p for p in projects if (
                query_lower in (p.custom_title or p.github_repo_name).lower()
                or query_lower in (
                    p.custom_description or p.github_description or ''
                ).lower() or any(query_lower in topic.lower() for topic in p.topics)
            )
        ]
    else:
        projects = list(projects)

    projects.sort(key = lambda p: (p.featured, p.popularity_score), reverse = True)
    projects = projects[: limit]

    project_previews = [
        ProjectPreviewDict(**project.to_preview_dict()) for project in projects
    ]

    return ProjectListDict(
        projects = project_previews,
        total = len(project_previews),
        limit = limit
    )
