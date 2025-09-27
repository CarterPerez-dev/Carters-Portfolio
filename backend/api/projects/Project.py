"""
Project Model with GitHub Integration
/api/projects/Project.py
"""

from __future__ import annotations

from enum import Enum
from typing import Any
from mongoengine import fields
from datetime import datetime, UTC
from api.core.database.Base import BaseDocument
from api.core.validation.exceptions import NotFoundError

from ...config import Config


class ProjectType(str, Enum):
    """
    Project type enumeration
    """
    WEB_APP = 'web-app'
    CLI_TOOL = 'cli-tool'
    LIBRARY = 'library'
    MOBILE_APP = 'mobile-app'
    API = 'api'
    OTHER = 'other'

    def __str__(self) -> str:
        return self.value


class GitHubEventType(str, Enum):
    """
    GitHub webhook event types
    """
    PUSH = 'push'
    REPOSITORY = 'repository'
    STAR = 'star'
    WATCH = 'watch'
    FORK = 'fork'
    ISSUES = 'issues'
    PULL_REQUEST = 'pull_request'
    RELEASE = 'release'
    CREATE = 'create'
    DELETE = 'delete'

    def __str__(self) -> str:
        return self.value


class Project(BaseDocument):
    """
    Project model with GitHub webhook integration
    """
    meta = {
        'collection':
        'projects',
        'indexes': [
            'github_id',
            'github_repo_name',
            'featured',
            'display_order',
            '-stars',
            '-last_push_at',
            'is_visible',
            ('featured',
             '-display_order',
             '-stars')
        ]
    }

    github_id = fields.IntField(unique = True, required = True)
    github_repo_name = fields.StringField(
        required = True,
        max_length = Config.PROJECT_GITHUB_REPO_MAX_LENGTH
    )
    github_owner = fields.StringField(
        required = True,
        max_length = Config.PROJECT_GITHUB_OWNER_MAX_LENGTH
    )
    github_full_name = fields.StringField(required = True)

    custom_title = fields.StringField(max_length = Config.PROJECT_TITLE_MAX_LENGTH)
    custom_description = fields.StringField(
        max_length = Config.PROJECT_DESCRIPTION_MAX_LENGTH
    )
    long_description = fields.StringField()
    featured = fields.BooleanField(default = False)
    display_order = fields.IntField(default = 0)
    is_visible = fields.BooleanField(default = True)

    tech_stack = fields.ListField(
        fields.StringField(max_length = Config.PROJECT_TECH_STACK_ITEM_MAX_LENGTH),
        default = list
    )
    project_type = fields.StringField(
        max_length = Config.PROJECT_TYPE_MAX_LENGTH,
        choices = [t.value for t in ProjectType],
        default = ProjectType.OTHER.value
    )

    demo_url = fields.URLField()
    documentation_url = fields.URLField()
    case_study_url = fields.URLField()
    screenshots = fields.ListField(fields.URLField(), default = list)
    thumbnail_url = fields.URLField()

    github_description = fields.StringField()
    stars_count = fields.IntField(default = 0)
    forks_count = fields.IntField(default = 0)
    watchers_count = fields.IntField(default = 0)
    open_issues_count = fields.IntField(default = 0)

    primary_language = fields.StringField()
    languages = fields.DictField()
    topics = fields.ListField(fields.StringField(), default = list)

    is_fork = fields.BooleanField(default = False)
    is_archived = fields.BooleanField(default = False)
    is_private = fields.BooleanField(default = False)
    has_issues = fields.BooleanField(default = True)
    has_wiki = fields.BooleanField(default = False)
    has_pages = fields.BooleanField(default = False)

    github_url = fields.URLField(required = True)
    homepage_url = fields.URLField()
    clone_url = fields.URLField()

    created_at_github = fields.DateTimeField()
    last_push_at = fields.DateTimeField()
    last_commit_message = fields.StringField()
    last_commit_sha = fields.StringField()

    last_webhook_at = fields.DateTimeField()
    webhook_events_count = fields.IntField(default = 0)

    total_commits = fields.IntField(default = 0)
    total_contributors = fields.IntField(default = 0)
    code_frequency = fields.ListField(fields.DictField(), default = list)

    popularity_score = fields.FloatField(default = 0.0)
    activity_score = fields.FloatField(default = 0.0)

    def __str__(self) -> str:
        return f"Project: {self.github_full_name} ({'Featured' if self.featured else 'Standard'})"

    def calculate_popularity_score(self) -> float:
        """
        Calculate popularity based on GitHub metrics
        """
        score = 0.0
        score += self.stars_count * 10
        score += self.forks_count * 5
        score += self.watchers_count * 2

        if self.last_push_at:
            days_since_push = (datetime.now(UTC) - self.last_push_at).days
            if days_since_push < 30:
                score += 50
            elif days_since_push < 90:
                score += 20

        if self.is_archived:
            score *= 0.1
        if self.is_fork:
            score *= 0.5

        return score

    def calculate_activity_score(self) -> float:
        """
        Calculate activity score based on recent commits
        """
        if not self.last_push_at:
            return 0.0

        days_inactive = (datetime.now(UTC) - self.last_push_at).days

        if days_inactive <= 7:
            return 100.0
        if days_inactive <= 30:
            return 80.0
        if days_inactive <= 90:
            return 50.0
        if days_inactive <= 365:
            return 20.0
        return 5.0

    def update_from_webhook(self, event_type: str, payload: dict[str, Any]) -> None:
        """
        Update project from GitHub webhook payload
        """
        self.last_webhook_at = datetime.now(UTC)
        self.webhook_events_count += 1

        event_handlers = {
            GitHubEventType.PUSH.value: self._handle_push_event,
            GitHubEventType.REPOSITORY.value: self._handle_repository_event,
            GitHubEventType.STAR.value: self._handle_star_event,
            GitHubEventType.WATCH.value: self._handle_star_event,
            GitHubEventType.FORK.value: self._handle_fork_event,
            GitHubEventType.ISSUES.value: self._handle_issues_event,
        }

        handler = event_handlers.get(event_type)
        if handler:
            handler(payload)

        self.popularity_score = self.calculate_popularity_score()
        self.activity_score = self.calculate_activity_score()

    def _handle_push_event(self, payload: dict[str, Any]) -> None:
        """
        Handle push webhook event
        """
        self.last_push_at = datetime.now(UTC)

        if payload.get('head_commit'):
            self.last_commit_message = payload['head_commit']['message']
            self.last_commit_sha = payload['head_commit']['id']

        if payload.get('repository'):
            repo = payload['repository']
            self.total_commits = repo.get('size', self.total_commits)

    def _handle_repository_event(self, payload: dict[str, Any]) -> None:
        """
        Handle repository update event
        """
        if payload.get('repository'):
            repo = payload['repository']
            self.github_description = repo.get('description', '')
            self.stars_count = repo.get('stargazers_count', 0)
            self.forks_count = repo.get('forks_count', 0)
            self.watchers_count = repo.get('watchers_count', 0)
            self.open_issues_count = repo.get('open_issues_count', 0)
            self.primary_language = repo.get('language', '')
            self.topics = repo.get('topics', [])
            self.is_archived = repo.get('archived', False)
            self.is_private = repo.get('private', False)
            self.homepage_url = repo.get('homepage', '')

    def _handle_star_event(self, payload: dict[str, Any]) -> None:
        """
        Handle star/unstar event
        """
        action = payload.get('action')
        if action == 'created':
            self.stars_count += 1
        elif action == 'deleted':
            self.stars_count = max(0, self.stars_count - 1)

    def _handle_fork_event(self, payload: dict[str, Any]) -> None:
        """
        Handle fork event
        """
        self.forks_count += 1

    def _handle_issues_event(self, payload: dict[str, Any]) -> None:
        """
        Handle issues event
        """
        action = payload.get('action')
        if action == 'opened':
            self.open_issues_count += 1
        elif action == 'closed':
            self.open_issues_count = max(0, self.open_issues_count - 1)

    @classmethod
    def get_or_create_from_github(cls,
                                  repo_data: dict[str,
                                                  Any]) -> tuple[Project,
                                                                 bool]:
        """
        Get or create project from GitHub API data
        """
        github_id = repo_data['id']

        project = cls.objects(github_id = github_id).first()
        created = False

        if not project:
            project = cls(github_id = github_id)
            created = True

        project.github_repo_name = repo_data['name']
        project.github_owner = repo_data['owner']['login']
        project.github_full_name = repo_data['full_name']
        project.github_description = repo_data.get('description', '')
        project.stars_count = repo_data.get('stargazers_count', 0)
        project.forks_count = repo_data.get('forks_count', 0)
        project.watchers_count = repo_data.get('watchers_count', 0)
        project.open_issues_count = repo_data.get('open_issues_count', 0)
        project.primary_language = repo_data.get('language', '')
        project.topics = repo_data.get('topics', [])
        project.is_fork = repo_data.get('fork', False)
        project.is_archived = repo_data.get('archived', False)
        project.is_private = repo_data.get('private', False)
        project.github_url = repo_data['html_url']
        project.clone_url = repo_data.get('clone_url', '')
        project.homepage_url = repo_data.get('homepage', '')
        project.created_at_github = datetime.fromisoformat(
            repo_data['created_at'].replace('Z',
                                            '+00:00')
        )
        project.last_push_at = datetime.fromisoformat(
            repo_data['pushed_at'].replace('Z',
                                           '+00:00')
        )

        project.popularity_score = project.calculate_popularity_score()
        project.activity_score = project.calculate_activity_score()

        project.save()
        return project, created

    @classmethod
    def get_visible_projects(
        cls,
        limit: int = Config.PROJECT_DEFAULT_LIST_LIMIT,
        featured_only: bool = False
    ) -> list[Project]:
        """
        Get visible projects for portfolio display
        """
        query = {'is_visible': True, 'is_private': False}
        if featured_only:
            query['featured'] = True

        return cls.objects(
            **query
        ).order_by('-featured',
                   'display_order',
                   '-popularity_score').limit(limit)

    @classmethod
    def get_by_github_id(cls, github_id: int) -> Project:
        """
        Get project by GitHub ID
        """
        project = cls.objects(github_id = github_id).first()
        if not project:
            raise NotFoundError(
                resource_type = "Project",
                resource_id = str(github_id)
            )
        return project

    def to_dict(self) -> dict:
        """
        Convert to dict for API responses
        """
        return {
            "_id": str(self.id),
            "github_id": self.github_id,
            "name": self.custom_title or self.github_repo_name,
            "description": self.custom_description or self.github_description,
            "long_description": self.long_description,
            "github_url": self.github_url,
            "demo_url": self.demo_url,
            "tech_stack": self.tech_stack,
            "project_type": self.project_type,
            "screenshots": self.screenshots,
            "stars": self.stars_count,
            "forks": self.forks_count,
            "language": self.primary_language,
            "topics": self.topics,
            "last_updated": self.last_push_at,
            "activity_score": self.activity_score,
            "featured": self.featured,
            "is_active": self.activity_score > 50
        }

    def to_preview_dict(self) -> dict:
        """
        Lightweight dict for list views
        """
        return {
            "_id": str(self.id),
            "github_id": self.github_id,
            "name": self.custom_title or self.github_repo_name,
            "description": self.custom_description or self.github_description,
            "thumbnail": self.thumbnail_url,
            "github_url": self.github_url,
            "demo_url": self.demo_url,
            "stars": self.stars_count,
            "language": self.primary_language,
            "featured": self.featured,
            "activity_score": self.activity_score
        }
