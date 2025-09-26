"""
Portfolio Website Application Factory
/app/factory.py
"""

from flask import Flask

from ..config import config
from api.core.database.Base import init_db

from .restx.api import init_api
from .handlers.rate_handlers import setup_rate_limiting
from .handlers.error_handlers import setup_error_handlers

def create_app(config_name: str = 'default') -> Flask:
    """
    Create and configure the Flask application
    """
    app = Flask(__name__)

    app.config.from_object(config[config_name])

    init_db(app)

    setup_error_handlers(app)

    setup_rate_limiting(app)

    with app.app_context():
        init_api(app)

    return app
