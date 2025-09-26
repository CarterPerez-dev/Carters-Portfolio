"""
Portfolio Website Configuration
/backend/config.py
"""

import os


class Config:
    CONTACT_NAME_MAX_LENGTH = 100
    CONTACT_SUBJECT_MAX_LENGTH = 200
    CONTACT_BODY_MAX_LENGTH = 2000
    CONTACT_EMAIL_MAX_LENGTH = 254
    CONTACT_PHONE_MAX_LENGTH = 20
    CONTACT_LINKEDIN_MAX_LENGTH = 500
    CONTACT_DEFAULT_LIST_LIMIT = 10
    CONTACT_RATE_LIMIT = "10/minute, 50/hour"

    # Blog Field Limits
    BLOG_TITLE_MAX_LENGTH = 200
    BLOG_SLUG_MAX_LENGTH = 250
    BLOG_EXCERPT_MAX_LENGTH = 500
    BLOG_AUTHOR_MAX_LENGTH = 100
    BLOG_TAG_MAX_LENGTH = 50
    BLOG_META_DESCRIPTION_MAX_LENGTH = 160
    BLOG_SLUG_MIN_LENGTH = 3
    BLOG_DEFAULT_LIST_LIMIT = 10
    
    PORTFOLIO_EMAIL = os.getenv('PORTFOLIO_EMAIL')
    RESEND_API_KEY = os.getenv('RESEND_API_KEY')

    MONGO_URI = os.getenv('MONGO_URI')

    RATELIMIT_STORAGE_URI = os.getenv('RATELIMIT_STORAGE_URI')
    RATELIMIT_STRATEGY = "moving-window"
    RATELIMIT_HEADERS_ENABLED = True
    RATELIMIT_SWALLOW_ERRORS = True
    FLASK_LIMITER_BURST = "50/second"

    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
