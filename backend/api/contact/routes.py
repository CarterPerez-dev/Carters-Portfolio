"""
Contact API Routes
/api/contact/routes.py
"""

from flask import current_app, request
from flask_restx import Resource

from config import Config
from app.restx.ns import contact_ns
from api.core.middleware.schema import S

from .controllers import (
    create_contact,
    get_contact_by_id,
    get_recent_contacts_list,
)
from .schemas import (
    ContactCreateRequest,
    ContactCreateResponse,
    ContactResponse,
    ContactListResponse
)
from ._docs import (
    CREATE_CONTACT_DOC,
    LIST_CONTACTS_DOC,
    GET_CONTACT_DOC,
)


@contact_ns.route('')
class ContactListResource(Resource):
    """ 
    Routes for My Porfolio Contact Form
    """
    @contact_ns.doc(**CREATE_CONTACT_DOC)
    @current_app.limiter.limit(Config.CONTACT_RATE_LIMIT)
    @S(req = ContactCreateRequest, res = ContactCreateResponse)
    def post(self):
        """
        Submit a new contact form
        """
        return create_contact(), 201

    @contact_ns.doc(**LIST_CONTACTS_DOC)
    @S(res = ContactListResponse)
    def get(self):
        """
        Get recent contact submissions (admin)
        """
        limit = int(request.args.get('limit', Config.CONTACT_DEFAULT_LIST_LIMIT))
        return get_recent_contacts_list(limit)


@contact_ns.route('/<string:contact_id>')
class ContactResource(Resource):
    """
    Admin Route to GET Contact by ID
    """
    @contact_ns.doc(**GET_CONTACT_DOC)
    @current_app.limiter.limit(Config.CONTACT_RATE_LIMIT)
    @S(res = ContactResponse)
    def get(self, contact_id: str):
        """
        Get a contact by ID (admin)
        """
        return get_contact_by_id(contact_id)
