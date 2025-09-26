"""
Contact Swagger Docs
"""

CREATE_CONTACT_DOC = {
    'description': 'Submit a new contact form',
    'responses': {
        201: 'Contact created successfully',
        400: 'Validation error',
        429: 'Rate limit exceeded',
        500: 'Internal server error'
    }
}

GET_CONTACT_DOC = {
    'description': 'Get a contact by ID (admin)',
    'params': {'contact_id': 'Contact ID'},
    'responses': {
        200: 'Contact retrieved successfully',
        404: 'Contact not found',
        500: 'Internal server error'
    }
}

LIST_CONTACTS_DOC = {
    'description': 'Get recent contact submissions (admin)',
    'params': {'limit': 'Number of contacts to return (default: 10)'},
    'responses': {
        200: 'Contacts retrieved successfully',
        500: 'Internal server error'
    }
}

