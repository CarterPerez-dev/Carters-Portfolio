"""
Base database model with MongoEngine
/api/core/database/Base.py
"""

import os
from flask import Flask
from datetime import datetime, UTC
from typing import Any, TypeVar, cast
from mongoengine import Document, connect, fields


T = TypeVar("T", bound = "BaseDocument")


class BaseDocument(Document):
    """
    Base document class with common fields and methods
    """

    meta = {"abstract": True}

    createdAt = fields.DateTimeField(default = lambda: datetime.now(UTC))
    updatedAt = fields.DateTimeField(default = lambda: datetime.now(UTC))

    def save(self: T, *args: Any, **kwargs: Any) -> T:
        """
        Override save to update timestamp
        """
        self.updatedAt = datetime.now(UTC)
        return cast(T, super().save(*args, **kwargs))


def init_db(app: Flask | None = None) -> bool:
    """
    Initialize MongoDB connection with MongoEngine
    """
    mongo_uri: str | None = app.config["MONGO_URI"] if app else os.getenv(
        "MONGO_URI"
    )

    connect(
        host = mongo_uri,
        alias = "default",
        maxPoolSize = 100,
        minPoolSize = 25,
        maxIdleTimeMS = 45000,
        socketTimeoutMS = 20000,
        serverSelectionTimeoutMS = 5000,
        connect = False,
        uuidRepresentation = 'standard',
    )
    return True
