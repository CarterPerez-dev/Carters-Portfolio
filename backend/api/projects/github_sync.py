"""
GitHub Repository Sync Service
/api/projects/github_sync.py
"""

import logging
import requests
from typing import Any
from flask import current_app
from datetime import datetime, UTC
from api.core.cache.enums import CacheNamespace
from api.core.cache import cached, cache_invalidate
from api.core.validation.exceptions import NotFoundError

from .Project import Project
from .types import GitHubSyncDict


logger = logging.getLogger(__name__)


class GitHubSyncService:
    """
    Service to sync GitHub repositories with local project database
    """
    def __init__(self, access_token: str | None = None, username: str | None = None):
        """
        Initialize GitHub sync service
        """
        self.access_token = access_token or current_app.config.get(
            'GITHUB_ACCESS_TOKEN'
        )
        self.username = username or current_app.config.get(
            'GITHUB_USERNAME',
            'CarterPerez-dev'
        )
        self.base_url = "https://api.github.com"
        self.headers = {'Accept': 'application/vnd.github.v3+json'}

        if self.access_token:
            self.headers['Authorization'] = f'token {self.access_token}'

    @cached(namespace = CacheNamespace.GITHUB, ttl = 3600)  # TODO config
    def fetch_user_repos(self) -> list[dict[str, Any]]:
        """
        Fetch all repositories for a user from GitHub API
        """
        repos = []
        page = 1
        per_page = 100

        try:
            while True:
                url = f"{self.base_url}/users/{self.username}/repos"
                params = {
                    'page': page,
                    'per_page': per_page,
                    'type': 'all',
                    'sort': 'updated'
                }

                response = requests.get(
                    url,
                    headers = self.headers,
                    params = params,
                    timeout = 10
                )

                if response.status_code != 200:
                    logger.error(
                        "GitHub API error: %s - %s",
                        response.status_code,
                        response.text
                    )
                    break

                page_repos = response.json()
                if not page_repos:
                    break

                repos.extend(page_repos)

                if len(page_repos) < per_page:
                    break

                page += 1

            logger.info("Fetched %s repositories from GitHub", len(repos))
            return repos

        except requests.RequestException as e:
            logger.error("Error fetching GitHub repos: %s", e)
            return repos

    @cached(namespace = CacheNamespace.GITHUB, ttl = 3600)
    def fetch_repo_languages(self, repo_full_name: str) -> dict[str, int]:
        """
        Fetch language statistics for a repository
        """
        try:
            url = f"{self.base_url}/repos/{repo_full_name}/languages"
            response = requests.get(url, headers = self.headers, timeout = 10)

            if response.status_code == 200:
                return response.json()

            logger.warning(
                "Failed to fetch languages for %s: %s",
                repo_full_name,
                response.status_code
            )
            return {}

        except requests.RequestException as e:
            logger.error("Error fetching languages for %s: %s", repo_full_name, e)
            return {}

    @cache_invalidate(namespace = CacheNamespace.PROJECT)
    def sync_all_repos(self) -> GitHubSyncDict:
        """
        Sync all GitHub repositories to database
        """
        repos = self.fetch_user_repos()

        if not repos:
            logger.warning("No repositories fetched from GitHub")
            return GitHubSyncDict(
                synced = 0,
                created = 0,
                updated = 0,
                errors = ["No repositories fetched"],
                timestamp = datetime.now(UTC)
            )

        synced = 0
        created = 0
        updated = 0
        errors = []

        for repo_data in repos:
            try:
                if repo_data.get('description'):
                    if '[PORTFOLIO_HIDE]' in repo_data['description']:
                        logger.info(
                            "Skipping hidden repo: %s",
                            repo_data['full_name']
                        )
                        continue

                project, was_created = Project.get_or_create_from_github(repo_data)

                if project.github_full_name:
                    languages = self.fetch_repo_languages(project.github_full_name)
                    if languages:
                        total = sum(languages.values())
                        if total > 0:
                            project.languages = {
                                lang: round((bytes_count / total) * 100,
                                            1)
                                for lang, bytes_count in languages.items()
                            }
                            project.save()

                synced += 1
                if was_created:
                    created += 1
                    logger.info("Created project: %s", project.github_full_name)
                else:
                    updated += 1
                    logger.debug("Updated project: %s", project.github_full_name)

            except Exception as e:
                error_msg = f"Error syncing {repo_data.get('full_name', 'unknown')}: {e}"
                logger.error(error_msg)
                errors.append(error_msg)

        logger.info(
            "GitHub sync completed: %s synced, %s created, %s updated",
            synced,
            created,
            updated
        )

        return GitHubSyncDict(
            synced = synced,
            created = created,
            updated = updated,
            errors = errors,
            timestamp = datetime.now(UTC)
        )

    @cache_invalidate(namespace = CacheNamespace.PROJECT)
    def sync_single_repo(self, repo_name: str) -> dict[str, Any]:
        """
        Sync a single repository by name
        """
        try:
            url = f"{self.base_url}/repos/{self.username}/{repo_name}"
            response = requests.get(url, headers = self.headers, timeout = 10)

            if response.status_code != 200:
                raise ValueError(f"Repository not found: {repo_name}")

            repo_data = response.json()
            project, created = Project.get_or_create_from_github(repo_data)

            languages = self.fetch_repo_languages(project.github_full_name)
            if languages:
                total = sum(languages.values())
                if total > 0:
                    project.languages = {
                        lang: round((bytes_count / total) * 100,
                                    1)
                        for lang, bytes_count in languages.items()
                    }
                    project.save()

            return {
                "success": True,
                "project_id": str(project.id),
                "created": created,
                "github_id": project.github_id
            }

        except (ValueError, requests.RequestException, NotFoundError) as e:
            logger.error("Error syncing repo %s: %s", repo_name, e)
            return {"success": False, "error": str(e)}

    def get_rate_limit(self) -> dict[str, Any]:
        """
        Get current GitHub API rate limit status
        """
        try:
            url = f"{self.base_url}/rate_limit"
            response = requests.get(url, headers = self.headers, timeout = 10)

            if response.status_code == 200:
                data = response.json()
                return {
                    "limit": data['rate']['limit'],
                    "remaining": data['rate']['remaining'],
                    "reset": datetime.fromtimestamp(data['rate']['reset'],
                                                    UTC),
                    "authenticated": bool(self.access_token)
                }

            return {"error": f"Failed to get rate limit: {response.status_code}"}

        except (requests.RequestException, KeyError, ValueError) as e:
            logger.error("Error checking rate limit: %s", e)
            return {"error": str(e)}
