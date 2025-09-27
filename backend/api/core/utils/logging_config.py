"""
Logging Configuration with Request ID
/api/core/utils/logging_config.py
"""

import logging
import logging.config
from api.core.middleware.request_id import RequestIDFilter


def setup_logging():
    """
    Configure logging with request ID tracking
    """
    logging_config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'default': {
                'format': '[%(asctime)s] [%(request_id)s] %(levelname)s in %(module)s: %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S'
            },
            'detailed': {
                'format': '[%(asctime)s] [%(request_id)s] %(levelname)s in %(module)s.%(funcName)s:%(lineno)d: %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S'
            }
        },
        'filters': {
            'request_id': {
                '()': RequestIDFilter
            }
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'INFO',
                'formatter': 'default',
                'filters': ['request_id'],
                'stream': 'ext://sys.stdout'
            },
            'file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'DEBUG',
                'formatter': 'detailed',
                'filters': ['request_id'],
                'filename': 'logs/portfolio.log',
                'maxBytes': 10485760,
                'backupCount': 5
            }
        },
        'loggers': {
            '': {
                'level': 'INFO',
                'handlers': ['console', 'file']
            },
            'api': {
                'level': 'DEBUG',
                'handlers': ['console', 'file'],
                'propagate': False
            },
            'werkzeug': {
                'level': 'WARNING',
                'handlers': ['console'],
                'propagate': False
            }
        }
    }

    logging.config.dictConfig(logging_config)
