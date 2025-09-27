"""
GitHub Webhook Handler
/api/projects/webhooks.py
"""

import hmac
import hashlib
import logging
from typing import Any
from datetime import datetime, UTC
from flask import request, current_app
from api.core.validation.exceptions import ValidationError, NotFoundError

from .Project import Project, GitHubEventType


logger = logging.getLogger(__name__)


class GitHubWebhookHandler:
    """
    Handler for GitHub webhook events with signature validation
    """
    SUPPORTED_EVENTS = {event.value for event in GitHubEventType}

    def __init__(self, webhook_secret: str | None = None):
        """
        Initialize webhook handler with secret for validation
        """
        self.webhook_secret = webhook_secret or current_app.config.get(
            'GITHUB_WEBHOOK_SECRET'
        )

    def validate_signature(self, payload: bytes, signature: str) -> bool:
        """
        Validate GitHub webhook signature (HMAC-SHA256)
        """
        if not self.webhook_secret:
            logger.warning("No webhook secret configured, skipping validation")
            return True

        if not signature or not signature.startswith('sha256='):
            logger.error("Invalid signature format")
            return False

        expected_signature = 'sha256=' + hmac.new(
            self.webhook_secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(expected_signature, signature)

    def process_webhook(self) -> dict[str, Any]:
        """
        Process incoming GitHub webhook
        """
        event_type = request.headers.get('X-GitHub-Event')
        signature = request.headers.get('X-Hub-Signature-256')
        delivery_id = request.headers.get('X-GitHub-Delivery')

        logger.info(
            "Received GitHub webhook: event=%s, delivery=%s",
            event_type,
            delivery_id
        )

        if event_type not in self.SUPPORTED_EVENTS:
            logger.warning("Unsupported webhook event: %s", event_type)
            return {
                "status": "ignored",
                "reason": f"Unsupported event type: {event_type}"
            }

        raw_payload = request.get_data()

        if signature and not self.validate_signature(raw_payload, signature):
            logger.error("Invalid webhook signature for delivery %s", delivery_id)
            raise ValidationError("Invalid webhook signature")

        payload = request.get_json()

        result = self._route_event(event_type, payload)

        logger.info(
            "Processed webhook: event=%s, delivery=%s, result=%s",
            event_type,
            delivery_id,
            result
        )

        return {
            "status": "processed",
            "event": event_type,
            "delivery_id": delivery_id,
            "result": result
        }

    def _route_event(self,
                     event_type: str,
                     payload: dict[str,
                                   Any]) -> dict[str,
                                                 Any]:
        """
        Route event to appropriate handler
        """
        handlers = {
            GitHubEventType.PUSH.value: self._handle_push,
            GitHubEventType.REPOSITORY.value: self._handle_repository,
            GitHubEventType.STAR.value: self._handle_star,
            GitHubEventType.WATCH.value: self._handle_watch,
            GitHubEventType.FORK.value: self._handle_fork,
            GitHubEventType.ISSUES.value: self._handle_issues,
            GitHubEventType.PULL_REQUEST.value: self._handle_pull_request,
            GitHubEventType.RELEASE.value: self._handle_release,
            GitHubEventType.CREATE.value: self._handle_create,
            GitHubEventType.DELETE.value: self._handle_delete
        }

        handler = handlers.get(event_type)
        if handler:
            return handler(payload)

        return {"processed": False, "reason": "No handler for event"}

    def _handle_push(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle push event - commits pushed to repository
        """
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        try:
            project = Project.get_by_github_id(github_id)
            project.update_from_webhook('push', payload)
            project.save()

            return {
                "processed": True,
                "project_id": str(project.id),
                "commits": len(payload.get('commits',
                                           [])),
                "branch": payload.get('ref',
                                      '').split('/')[-1]
            }
        except (NotFoundError, ValueError, AttributeError) as e:
            logger.error("Error processing push event: %s", e)
            return {"processed": False, "error": str(e)}

    def _handle_repository(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle repository event - repository created, deleted, archived, etc.
        """
        action = payload.get('action')
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        try:
            if action == 'created':
                project, created = Project.get_or_create_from_github(repo)
                return {
                    "processed": True,
                    "action": action,
                    "created": created,
                    "project_id": str(project.id)
                }
            if action == 'deleted':
                project = Project.get_by_github_id(github_id)
                project.is_visible = False
                project.is_archived = True
                project.save()
                return {
                    "processed": True,
                    "action": action,
                    "project_id": str(project.id)
                }

            project = Project.get_by_github_id(github_id)
            project.update_from_webhook('repository', payload)
            project.save()
            return {
                "processed": True,
                "action": action,
                "project_id": str(project.id)
            }
        except (NotFoundError, ValueError, AttributeError) as e:
            logger.error("Error processing repository event: %s", e)
            return {"processed": False, "error": str(e)}

    def _handle_star(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle star event - repository starred/unstarred
        """
        action = payload.get('action')
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        try:
            project = Project.get_by_github_id(github_id)
            project.update_from_webhook('star', payload)
            project.save()

            return {
                "processed": True,
                "action": action,
                "project_id": str(project.id),
                "stars": project.stars_count
            }
        except (NotFoundError, ValueError, AttributeError) as e:
            logger.error("Error processing star event: %s", e)
            return {"processed": False, "error": str(e)}

    def _handle_watch(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle watch event - repository watched
        """
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        try:
            project = Project.get_by_github_id(github_id)
            project.watchers_count += 1
            project.save()

            return {
                "processed": True,
                "project_id": str(project.id),
                "watchers": project.watchers_count
            }
        except (NotFoundError, ValueError, AttributeError) as e:
            logger.error("Error processing watch event: %s", e)
            return {"processed": False, "error": str(e)}

    def _handle_fork(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle fork event - repository forked
        """
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        try:
            project = Project.get_by_github_id(github_id)
            project.update_from_webhook('fork', payload)
            project.save()

            return {
                "processed": True,
                "project_id": str(project.id),
                "forks": project.forks_count
            }
        except (NotFoundError, ValueError, AttributeError) as e:
            logger.error("Error processing fork event: %s", e)
            return {"processed": False, "error": str(e)}

    def _handle_issues(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle issues event - issue opened, closed, etc.
        """
        action = payload.get('action')
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        try:
            project = Project.get_by_github_id(github_id)
            project.update_from_webhook('issues', payload)
            project.save()

            return {
                "processed": True,
                "action": action,
                "project_id": str(project.id),
                "open_issues": project.open_issues_count
            }
        except (NotFoundError, ValueError, AttributeError) as e:
            logger.error("Error processing issues event: %s", e)
            return {"processed": False, "error": str(e)}

    def _handle_pull_request(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle pull request event
        """
        action = payload.get('action')
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        logger.info(
            "Pull request %s for repository %s",
            action,
            repo.get('full_name')
        )

        return {"processed": True, "action": action, "logged": True}

    def _handle_release(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle release event - new release published
        """
        action = payload.get('action')
        release = payload.get('release', {})
        repo = payload.get('repository', {})
        github_id = repo.get('id')

        if not github_id:
            return {"processed": False, "reason": "No repository ID"}

        if action == 'published':
            try:
                project = Project.get_by_github_id(github_id)
                project.last_webhook_at = datetime.now(UTC)
                project.webhook_events_count += 1
                project.save()

                return {
                    "processed": True,
                    "action": action,
                    "release": release.get('tag_name'),
                    "project_id": str(project.id)
                }
            except (NotFoundError, ValueError, AttributeError) as e:
                logger.error("Error processing release event: %s", e)
                return {"processed": False, "error": str(e)}

        return {"processed": False, "reason": f"Unhandled action: {action}"}

    def _handle_create(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle create event - branch or tag created
        """
        ref_type = payload.get('ref_type')
        ref = payload.get('ref')
        repo = payload.get('repository', {})

        logger.info(
            "Created %s '%s' in repository %s",
            ref_type,
            ref,
            repo.get('full_name')
        )

        return {"processed": True, "ref_type": ref_type, "ref": ref}

    def _handle_delete(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Handle delete event - branch or tag deleted
        """
        ref_type = payload.get('ref_type')
        ref = payload.get('ref')
        repo = payload.get('repository', {})

        logger.info(
            "Deleted %s '%s' in repository %s",
            ref_type,
            ref,
            repo.get('full_name')
        )

        return {"processed": True, "ref_type": ref_type, "ref": ref}
