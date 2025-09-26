"""
Portfolio Website Flask-RESTX Setup
/app/restx/api.py
"""

from flask import Flask
from flask_restx import Api


rest = Api(
    version='v1',
    title='Portfolio API',
    description='Portfolio Website API',
    doc='/docs/',
    authorizations={
        'BearerAuth': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'Enter your JWT in the format: Bearer <token>'
        }
    },
    security='BearerAuth',
    contact='your-email@domain.com',
    contact_email='your-email@domain.com',
    license='MIT',
)


def init_api(app: Flask) -> Api:
    """
    Initialize Flask-RESTX with all domain namespaces
    """
    rest.init_app(app)

    from app.restx.ns import (
        projects_ns,
        contact_ns,
        blogs_ns,
    )
    
    import api.contact.routes
    import api.projects.routes
    import api.blogs.routes
    
    rest.add_namespace(projects_ns)
    rest.add_namespace(contact_ns)
    rest.add_namespace(blogs_ns)

    return rest
