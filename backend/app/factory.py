"""
Portfolio Website Application Factory
/app/factory.py
"""

from flask import Flask
from flask_jwt_extended import JWTManager

from config import config
from api.core.database.Base import init_db
from api.core.cache.extension import flask_redis
from api.core.utils.logging_config import setup_logging
from api.core.middleware.request_id import RequestIDMiddleware

from .restx.api import init_api
from .http.cors import setup_cors
from .http.jwt_config import setup_jwt_and_app_config
from .handlers.rate_handlers import setup_rate_limiting
from .handlers.error_handlers import setup_error_handlers

jwt = JWTManager()


def create_app(config_name: str = 'default') -> Flask:
    """
    Create and configure the Flask application
    """
    setup_logging()

    app = Flask(__name__)

    app.config.from_object(config[config_name])

    setup_cors(app)

    init_db(app)

    flask_redis.init_app(app)

    setup_jwt_and_app_config(app, jwt)

    RequestIDMiddleware(app)

    setup_error_handlers(app)

    setup_rate_limiting(app)

    with app.app_context():
        init_api(app)

    return app
