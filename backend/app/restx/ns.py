"""
Portfolio Website Domain Based Namespace Definitions
/app/restx/ns.py
"""

from flask_restx import Namespace

# ============ PROJECTS DOMAIN =============
projects_ns = Namespace(
    'projects',
    description='Project showcase and details',
    path='/projects'
)

# ============ CONTACT DOMAIN =============
contact_ns = Namespace(
    'contact',
    description='Contact forms and information',
    path='/contact'
)

# ============ BLOG DOMAIN =============
blogs_ns = Namespace(
    'blogs',
    description='Blog posts and articles',
    path='/blogs'
)
