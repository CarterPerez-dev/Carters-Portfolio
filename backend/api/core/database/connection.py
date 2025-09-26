"""
Database helper utilities
/api/core/database/connection.py
"""

from typing import Any
from mongoengine import connection
from pymongo.database import Database
from pymongo.mongo_client import MongoClient


def get_db() -> Database[Any]:
    """
    Get the PyMongo db object from MongoEngine connection
    """
    return connection.get_db()


def get_client() -> MongoClient[Any]:
    """
    Get the PyMongo client from MongoEngine connection
    """
    return connection.get_connection()


class LazyDB:
    """
    Lazy database connection that only connects when accessed
    """
    def __getattr__(self, name: str) -> Any:
        """
        Get database collections or attributes on first access
        """
        database: Database[Any] = get_db()
        return getattr(database, name)


db: LazyDB = LazyDB()
