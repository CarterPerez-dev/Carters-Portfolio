"""
CORS and Proxy Configuration
/app/http/cors.py
"""

from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix


def setup_cors(app: Flask) -> None:
    """
    Configure CORS and proxy handling for portfolio website
    """
    app.wsgi_app = ProxyFix(
        app.wsgi_app,
        x_for=1,
        x_proto=1,
        x_host=1,
        x_port=1,
        x_prefix=1,
    )

    origins = []

    if app.config.get('DEBUG'):
        CORS(app, supports_credentials=True, origins="*")
    else:
        origins.extend(
            [
                "http://192.168.1.167",
                "https://carterperez.com",
                "https://www.carterperez.com",
                "https://github.com",
                "https://api.github.com",
                "https://cloud.mongodb.com",
            ]
        )
        CORS(app, supports_credentials=True, origins=origins)
