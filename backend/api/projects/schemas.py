"""
Project API Schemas
/api/projects/schemas.py
"""

from pydantic import (
    BaseModel,
    Field,
    HttpUrl,
    validator,
)
from typing import Any
from datetime import datetime

from config import Config
from .Project import ProjectType


class ProjectUpdateRequest(BaseModel):
    """
    Request schema for updating project display settings
    """
    custom_title: str | None = Field(
        None,
        max_length = Config.PROJECT_TITLE_MAX_LENGTH,
        description = "Custom project title"
    )

    custom_description: str | None = Field(
        None,
        max_length = Config.PROJECT_DESCRIPTION_MAX_LENGTH,
        description = "Custom project description"
    )

    long_description: str | None = Field(
        None,
        description = "Detailed project description (Markdown supported)"
    )

    featured: bool | None = Field(None, description = "Featured status")

    display_order: int | None = Field(
        None,
        ge = 0,
        le = 999,
        description = "Display order (lower = higher priority)"
    )

    is_visible: bool | None = Field(None, description = "Visibility status")

    tech_stack: list[str] | None = Field(None, description = "Technology stack")

    project_type: str | None = Field(None, description = "Project type")

    demo_url: HttpUrl | None = Field(None, description = "Demo URL")

    documentation_url: HttpUrl | None = Field(
        None,
        description = "Documentation URL"
    )

    case_study_url: HttpUrl | None = Field(None, description = "Case study URL")

    screenshots: list[HttpUrl] | None = Field(
        None,
        description = "Screenshot URLs"
    )

    thumbnail_url: HttpUrl | None = Field(None, description = "Thumbnail URL")

    @validator('tech_stack')
    def validate_tech_stack(cls, v: list[str] | None) -> list[str] | None:
        """
        Validate tech stack items
        """
        if v is None:
            return None

        cleaned = []
        for tech in v:
            if isinstance(tech, str):
                clean_tech = tech.strip()
                if clean_tech and len(clean_tech
                                      ) <= Config.PROJECT_TECH_STACK_ITEM_MAX_LENGTH:
                    cleaned.append(clean_tech)

        return list(set(cleaned)) if cleaned else None

    @validator('screenshots')
    def validate_screenshots(cls, v: list[HttpUrl] | None) -> list[HttpUrl] | None:
        """
        Validate screenshots list length
        """
        if v is not None and len(v) > 10:
            raise ValueError("Maximum 10 screenshots allowed")
        return v

    @validator('project_type')
    def validate_project_type(cls, v: str | None) -> str | None:
        """
        Validate project type against enum
        """
        if v is None:
            return None

        valid_types = [t.value for t in ProjectType]
        if v not in valid_types:
            raise ValueError(
                f"Project type must be one of: {', '.join(valid_types)}"
            )

        return v


class ProjectResponse(BaseModel):
    """
    Response schema for full project details
    """
    id: str = Field(..., alias = "_id", description = "Project ID")
    github_id: int = Field(..., description = "GitHub repository ID")
    name: str = Field(..., description = "Project name")
    description: str | None = Field(None, description = "Project description")
    long_description: str | None = Field(None, description = "Detailed description")
    github_url: str = Field(..., description = "GitHub repository URL")
    demo_url: str | None = Field(None, description = "Demo URL")
    tech_stack: list[str] = Field(..., description = "Technology stack")
    project_type: str = Field(..., description = "Project type")
    screenshots: list[str] = Field(..., description = "Screenshot URLs")
    stars: int = Field(..., description = "GitHub stars count")
    forks: int = Field(..., description = "GitHub forks count")
    language: str | None = Field(None, description = "Primary programming language")
    topics: list[str] = Field(..., description = "GitHub topics")
    last_updated: datetime | None = Field(None, description = "Last push timestamp")
    activity_score: float = Field(..., description = "Activity score (0-100)")
    featured: bool = Field(..., description = "Featured status")
    is_active: bool = Field(..., description = "Active project indicator")


class ProjectPreviewResponse(BaseModel):
    """
    Response schema for project preview (list view)
    """
    id: str = Field(..., alias = "_id", description = "Project ID")
    github_id: int = Field(..., description = "GitHub repository ID")
    name: str = Field(..., description = "Project name")
    description: str | None = Field(None, description = "Project description")
    long_description: str | None = Field(None, description = "Detailed description")
    thumbnail: str | None = Field(None, description = "Thumbnail URL")
    github_url: str = Field(..., description = "GitHub repository URL")
    github_owner: str | None = Field(None, description = "GitHub repository owner")
    github_full_name: str | None = Field(None, description = "GitHub repository full name")
    demo_url: str | None = Field(None, description = "Demo URL")
    documentation_url: str | None = Field(None, description = "Documentation URL")
    case_study_url: str | None = Field(None, description = "Case study URL")
    stars: int = Field(..., description = "GitHub stars count")
    watchers: int | None = Field(None, description = "GitHub watchers count")
    forks: int = Field(..., description = "GitHub forks count")
    open_issues: int | None = Field(None, description = "GitHub open issues count")
    language: str | None = Field(None, description = "Primary programming language")
    tech_stack: list[str] = Field(..., description = "Technology stack")
    topics: list[str] = Field(..., description = "GitHub topics")
    project_type: str = Field(..., description = "Project type")
    featured: bool = Field(..., description = "Featured status")
    is_visible: bool = Field(default=True, description = "Visibility status")
    activity_score: float = Field(..., description = "Activity score (0-100)")
    last_updated: datetime | None = Field(None, description = "Last push timestamp")
    created_at: datetime | None = Field(None, description = "Repository creation timestamp")
    clone_url: str | None = Field(None, description = "Git clone URL")
    homepage_url: str | None = Field(None, description = "Project homepage URL")
    screenshots: list[str] = Field(..., description = "Screenshot URLs")


class ProjectListResponse(BaseModel):
    """
    Response schema for project list
    """
    projects: list[ProjectPreviewResponse] = Field(
        ...,
        description = "List of projects"
    )
    total: int = Field(..., description = "Total number of projects")
    limit: int = Field(..., description = "Results limit")
    featured_count: int | None = Field(
        None,
        description = "Number of featured projects"
    )


class ProjectStatsResponse(BaseModel):
    """
    Response schema for project statistics
    """
    total_projects: int = Field(..., description = "Total visible projects")
    featured_projects: int = Field(..., description = "Number of featured projects")
    active_projects: int = Field(..., description = "Number of active projects")
    total_stars: int = Field(..., description = "Total GitHub stars")
    total_forks: int = Field(..., description = "Total GitHub forks")
    top_languages: dict[str,
                        int] = Field(...,
                                     description = "Top programming languages")


class ProjectSearchRequest(BaseModel):
    """
    Request schema for project search
    """
    query: str | None = Field(None, description = "Search query")
    language: str | None = Field(
        None,
        description = "Filter by programming language"
    )
    project_type: str | None = Field(None, description = "Filter by project type")
    limit: int = Field(
        default = Config.PROJECT_DEFAULT_LIST_LIMIT,
        ge = 1,
        le = 100,  # config TODO
        description = "Results limit"
    )

    @validator('project_type')
    def validate_project_type(cls, v: str | None) -> str | None:
        """
        Validate project type
        """
        if v is None:
            return None

        valid_types = [t.value for t in ProjectType]
        if v not in valid_types:
            raise ValueError(
                f"Project type must be one of: {', '.join(valid_types)}"
            )

        return v


class GitHubSyncResponse(BaseModel):
    """
    Response schema for GitHub sync operation
    """
    synced: int = Field(..., description = "Number of repositories synced")
    created: int = Field(..., description = "Number of new projects created")
    updated: int = Field(..., description = "Number of projects updated")
    errors: list[str] = Field(..., description = "List of sync errors")
    timestamp: datetime = Field(..., description = "Sync timestamp")


class WebhookResponse(BaseModel):
    """
    Response schema for webhook processing
    """
    status: str = Field(..., description = "Processing status")
    event: str | None = Field(None, description = "GitHub event type")
    delivery_id: str | None = Field(None, description = "GitHub delivery ID")
    result: dict[str, Any] | None = Field(None, description = "Processing result")
