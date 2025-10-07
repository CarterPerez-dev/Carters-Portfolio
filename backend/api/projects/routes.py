"""
Project API Routes
/api/projects/routes.py
"""

from flask import current_app, request
from flask_restx import Resource

from app.restx.ns import projects_ns
from api.core.middleware.schema import S

from .controllers import (
    get_projects,
    get_project_by_id,
    get_project_by_github_id,
    update_project,
    toggle_project_visibility,
    toggle_project_featured,
    process_github_webhook,
    get_project_stats,
    search_projects_controller
)
from .github_sync import GitHubSyncService
from .schemas import (
    ProjectUpdateRequest,
    ProjectResponse,
    ProjectListResponse,
    ProjectStatsResponse,
    ProjectSearchRequest,
    GitHubSyncResponse
)
from ._docs import (
    GET_PROJECTS_DOC,
    GET_PROJECT_BY_ID_DOC,
    UPDATE_PROJECT_DOC,
    GET_PROJECT_BY_GITHUB_ID_DOC,
    TOGGLE_VISIBILITY_DOC,
    TOGGLE_FEATURED_DOC,
    GITHUB_WEBHOOK_DOC,
    GITHUB_SYNC_ALL_DOC,
    GITHUB_SYNC_SINGLE_DOC,
    PROJECT_STATS_DOC,
    PROJECT_SEARCH_DOC,
    GITHUB_RATE_LIMIT_DOC
)
from config import Config


@projects_ns.route('')
class ProjectListResource(Resource):
    """
    Routes for project list operations
    """
    @projects_ns.doc(**GET_PROJECTS_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    @S(res = ProjectListResponse)
    def get(self):
        """
        Get portfolio projects
        """
        limit = int(request.args.get('limit', Config.PROJECT_DEFAULT_LIST_LIMIT))
        featured_only = request.args.get('featured_only', 'false').lower() == 'true'
        return get_projects(limit = limit, featured_only = featured_only)


@projects_ns.route('/<string:project_id>')
class ProjectResource(Resource):
    """
    Routes for individual project operations
    """
    @projects_ns.doc(**GET_PROJECT_BY_ID_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    @S(res = ProjectResponse)
    def get(self, project_id: str):
        """
        Get a specific project
        """
        return get_project_by_id(project_id)

    @projects_ns.doc(**UPDATE_PROJECT_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    @S(req = ProjectUpdateRequest)
    def put(self, project_id: str):
        """
        Update project settings (admin)
        """
        return update_project(project_id)


@projects_ns.route('/github/<int:github_id>')
class ProjectByGitHubResource(Resource):
    """
    Get project by GitHub ID
    """
    @projects_ns.doc(**GET_PROJECT_BY_GITHUB_ID_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    @S(res = ProjectResponse)
    def get(self, github_id: int):
        """
        Get project by GitHub ID
        """
        return get_project_by_github_id(github_id)


@projects_ns.route('/<string:project_id>/visibility')
class ProjectVisibilityResource(Resource):
    """
    Toggle project visibility
    """
    @projects_ns.doc(**TOGGLE_VISIBILITY_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    def post(self, project_id: str):
        """
        Toggle project visibility (admin)
        """
        return toggle_project_visibility(project_id)


@projects_ns.route('/<string:project_id>/featured')
class ProjectFeaturedResource(Resource):
    """
    Toggle project featured status
    """
    @projects_ns.doc(**TOGGLE_FEATURED_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    def post(self, project_id: str):
        """
        Toggle project featured status (admin)
        """
        return toggle_project_featured(project_id)


@projects_ns.route('/webhook/github')
class GitHubWebhookResource(Resource):
    """
    GitHub webhook endpoint
    """
    @projects_ns.doc(**GITHUB_WEBHOOK_DOC)
    @current_app.limiter.limit(Config.PROJECT_WEBHOOK_RATE_LIMIT)
    def post(self):
        """
        Process GitHub webhook
        """
        return process_github_webhook()


@projects_ns.route('/sync/github')
class GitHubSyncResource(Resource):
    """
    Sync projects from GitHub
    """
    @projects_ns.doc(**GITHUB_SYNC_ALL_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    @S(res = GitHubSyncResponse)
    def post(self):
        """
        Sync all repositories from GitHub (admin)
        """
        sync_service = GitHubSyncService()
        return sync_service.sync_all_repos()


@projects_ns.route('/sync/github/<string:repo_name>')
class GitHubSyncSingleResource(Resource):
    """
    Sync single repository from GitHub
    """
    @projects_ns.doc(**GITHUB_SYNC_SINGLE_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    def post(self, repo_name: str):
        """
        Sync single repository from GitHub (admin)
        """
        sync_service = GitHubSyncService()
        return sync_service.sync_single_repo(repo_name)


@projects_ns.route('/stats')
class ProjectStatsResource(Resource):
    """
    Get project statistics
    """
    @projects_ns.doc(**PROJECT_STATS_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    @S(res = ProjectStatsResponse)
    def get(self):
        """
        Get project statistics
        """
        return get_project_stats()


@projects_ns.route('/search')
class ProjectSearchResource(Resource):
    """
    Search projects
    """
    @projects_ns.doc(**PROJECT_SEARCH_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    @S(req = ProjectSearchRequest, res = ProjectListResponse)
    def post(self):
        """
        Search projects
        """
        return search_projects_controller()


@projects_ns.route('/github/rate-limit')
class GitHubRateLimitResource(Resource):
    """
    Check GitHub API rate limit
    """
    @projects_ns.doc(**GITHUB_RATE_LIMIT_DOC)
    @current_app.limiter.limit(Config.PROJECT_RATE_LIMIT)
    def get(self):
        """
        Get GitHub API rate limit
        """
        sync_service = GitHubSyncService()
        return sync_service.get_rate_limit()
