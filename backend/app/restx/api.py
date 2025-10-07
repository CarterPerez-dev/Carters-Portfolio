"""
Portfolio Website Flask-RESTX Setup
/app/restx/api.py
"""

from flask import Flask
from flask_restx import Api


rest = Api(
    version='v1',
    prefix='/v1',
    title='Carters Portfolio API',
    description='Carters Portfolio Website API',
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
    contact='carterperez@certgames.com',
    contact_email='carterperez@certgames.com',
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
        admin_auth_ns,
    )

    import api.contact.routes
    import api.projects.routes
    import api.blogs.routes
    import api.admin.routes

    rest.add_namespace(projects_ns)
    rest.add_namespace(contact_ns)
    rest.add_namespace(blogs_ns)
    rest.add_namespace(admin_auth_ns)

    return rest
