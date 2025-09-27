"""
Project API Swagger Documentation
/api/projects/_docs.py
"""

GET_PROJECTS_DOC = {
    'description': 'Get visible portfolio projects',
    'params': {
        'limit': 'Number of projects to return (default: 12)',
        'featured_only': 'Only return featured projects (true/false)'
    },
    'responses': {
        200: 'Projects retrieved successfully',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GET_PROJECT_BY_ID_DOC = {
    'description': 'Get a specific project by MongoDB ID',
    'params': {
        'project_id': 'MongoDB project ID'
    },
    'responses': {
        200: 'Project retrieved successfully',
        404: 'Project not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

UPDATE_PROJECT_DOC = {
    'description': 'Update project display settings (admin)',
    'params': {
        'project_id': 'MongoDB project ID'
    },
    'responses': {
        200: 'Project updated successfully',
        400: 'Validation error',
        404: 'Project not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GET_PROJECT_BY_GITHUB_ID_DOC = {
    'description': 'Get project by GitHub repository ID',
    'params': {
        'github_id': 'GitHub repository ID'
    },
    'responses': {
        200: 'Project retrieved successfully',
        404: 'Project not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

TOGGLE_VISIBILITY_DOC = {
    'description': 'Toggle project visibility on/off (admin)',
    'params': {
        'project_id': 'MongoDB project ID'
    },
    'responses': {
        200: 'Visibility toggled successfully',
        404: 'Project not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

TOGGLE_FEATURED_DOC = {
    'description': 'Toggle project featured status (admin)',
    'params': {
        'project_id': 'MongoDB project ID'
    },
    'responses': {
        200: 'Featured status toggled successfully',
        404: 'Project not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GITHUB_WEBHOOK_DOC = {
    'description': 'Handle GitHub webhook events for real-time updates',
    'responses': {
        200: 'Webhook processed successfully',
        400: 'Invalid webhook signature or bad request',
        429: 'Rate limit exceeded',
        500: 'Processing error'
    }
}

GITHUB_SYNC_ALL_DOC = {
    'description': 'Sync all repositories from GitHub (admin)',
    'responses': {
        200: 'Sync completed successfully',
        429: 'Rate limit exceeded',
        500: 'Sync error'
    }
}

GITHUB_SYNC_SINGLE_DOC = {
    'description': 'Sync a single repository from GitHub (admin)',
    'params': {
        'repo_name': 'Repository name (without owner)'
    },
    'responses': {
        200: 'Repository synced successfully',
        404: 'Repository not found',
        429: 'Rate limit exceeded',
        500: 'Sync error'
    }
}

PROJECT_STATS_DOC = {
    'description': 'Get aggregate project statistics',
    'responses': {
        200: 'Statistics retrieved successfully',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

PROJECT_SEARCH_DOC = {
    'description': 'Search and filter projects',
    'responses': {
        200: 'Search results retrieved successfully',
        400: 'Invalid search parameters',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GITHUB_RATE_LIMIT_DOC = {
    'description': 'Check GitHub API rate limit status',
    'responses': {
        200: 'Rate limit status retrieved',
        429: 'Rate limit exceeded',
        500: 'Error checking rate limit'
    }
}
