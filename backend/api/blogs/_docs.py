"""
Blog Swagger Documentation
/api/blogs/_docs.py
"""

CREATE_BLOG_DOC = {
    'description': 'Create a new blog post (admin)',
    'responses': {
        201: 'Blog created successfully',
        400: 'Validation error',
        409: 'Duplicate slug',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

LIST_BLOGS_DOC = {
    'description': 'Get published blog posts (public)',
    'params': {
        'limit': 'Number of blogs to return (default: 10)',
        'offset': 'Number of blogs to skip (default: 0)'
    },
    'responses': {
        200: 'Blogs retrieved successfully',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

LIST_ALL_BLOGS_DOC = {
    'description': 'Get all blog posts including drafts (admin)',
    'params': {
        'limit': 'Number of blogs to return (default: 10)',
        'offset': 'Number of blogs to skip (default: 0)'
    },
    'responses': {
        200: 'Blogs retrieved successfully',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GET_BLOG_BY_SLUG_DOC = {
    'description': 'Get a published blog post by slug',
    'params': {'slug': 'Blog URL slug'},
    'responses': {
        200: 'Blog retrieved successfully',
        400: 'Blog is not published',
        404: 'Blog not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GET_BLOG_BY_ID_DOC = {
    'description': 'Get a blog post by ID (admin)',
    'params': {'blog_id': 'Blog ID'},
    'responses': {
        200: 'Blog retrieved successfully',
        404: 'Blog not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

UPDATE_BLOG_DOC = {
    'description': 'Update a blog post (admin)',
    'params': {'blog_id': 'Blog ID'},
    'responses': {
        200: 'Blog updated successfully',
        400: 'Validation error',
        404: 'Blog not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

DELETE_BLOG_DOC = {
    'description': 'Delete a blog post (admin)',
    'params': {'blog_id': 'Blog ID'},
    'responses': {
        200: 'Blog deleted successfully',
        404: 'Blog not found',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

PUBLISH_BLOG_DOC = {
    'description': 'Publish a draft blog post (admin)',
    'params': {'blog_id': 'Blog ID'},
    'responses': {
        200: 'Blog published successfully',
        404: 'Blog not found',
        409: 'Blog is already published',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

UNPUBLISH_BLOG_DOC = {
    'description': 'Unpublish a blog post to draft (admin)',
    'params': {'blog_id': 'Blog ID'},
    'responses': {
        200: 'Blog unpublished successfully',
        404: 'Blog not found',
        409: 'Blog is already unpublished',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

SEARCH_BLOGS_DOC = {
    'description': 'Search published blog posts',
    'responses': {
        200: 'Search results retrieved successfully',
        400: 'Invalid search parameters',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GET_BLOGS_BY_TAG_DOC = {
    'description': 'Get published blogs filtered by tag',
    'params': {
        'tag': 'Tag to filter by',
        'limit': 'Number of blogs to return (default: 10)'
    },
    'responses': {
        200: 'Blogs retrieved successfully',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}
