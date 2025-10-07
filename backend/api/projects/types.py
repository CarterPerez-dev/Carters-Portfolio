"""
Project Type Definitions
/api/projects/types.py
"""

from datetime import datetime
from typing import TypedDict, NotRequired


class ProjectDict(TypedDict):
    """
    Type definition for full project dictionary
    """
    _id: str
    github_id: int
    name: str
    description: str
    long_description: str | None
    github_url: str
    demo_url: str | None
    tech_stack: list[str]
    project_type: str
    screenshots: list[str]
    stars: int
    forks: int
    language: str | None
    topics: list[str]
    last_updated: datetime | None
    activity_score: float
    featured: bool
    is_active: bool


class ProjectPreviewDict(TypedDict):
    """
    Type definition for project preview (list view)
    """
    _id: str
    github_id: int
    name: str
    description: str
    thumbnail: str | None
    github_url: str
    demo_url: str | None
    stars: int
    language: str | None
    featured: bool
    activity_score: float


class ProjectListDict(TypedDict):
    """
    Type definition for project list response
    """
    projects: list[ProjectPreviewDict]
    total: int
    limit: int
    featured_count: NotRequired[int]


class ProjectCreateDict(TypedDict):
    """
    Type definition for project creation response
    """
    project_id: str
    github_id: int
    created: bool


class ProjectUpdateDict(TypedDict):
    """
    Type definition for project update response
    """
    project_id: str
    github_id: int
    updated_fields: list[str]


class WebhookResponseDict(TypedDict):
    """
    Type definition for webhook processing response
    """
    status: str
    event: str | None
    delivery_id: str | None
    result: dict | None


class GitHubSyncDict(TypedDict):
    """
    Type definition for GitHub sync response
    """
    synced: int
    created: int
    updated: int
    errors: list[str]
    timestamp: datetime
