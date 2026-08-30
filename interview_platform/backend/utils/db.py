"""
Database connection manager for PrepAI
Uses MySQL with connection pooling via PyMySQL
"""

import pymysql
import pymysql.cursors
from flask import current_app, g


def get_db():
    """Get database connection, reusing per-request connection if available."""
    if 'db' not in g:
        g.db = pymysql.connect(
            host=current_app.config['DB_HOST'],
            user=current_app.config['DB_USER'],
            password=current_app.config['DB_PASSWORD'],
            database=current_app.config['DB_NAME'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False
        )
    return g.db


def close_db(e=None):
    """Close the database connection at the end of a request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()


def query(sql, params=None, fetch='all'):
    """Execute a query and return results.

    Args:
        sql    : SQL string with %s placeholders
        params : tuple/list of parameters
        fetch  : 'all' | 'one' | 'none'
    Returns:
        list[dict] | dict | None
    """
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(sql, params or ())
        if fetch == 'all':
            return cursor.fetchall()
        elif fetch == 'one':
            return cursor.fetchone()
        else:
            db.commit()
            return cursor.lastrowid


def execute(sql, params=None):
    """Execute a write query (INSERT/UPDATE/DELETE) and commit.

    Returns:
        last inserted row id (int) or rows affected
    """
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(sql, params or ())
        db.commit()
        return cursor.lastrowid


def init_app(app):
    """Register database teardown with the Flask app."""
    app.teardown_appcontext(close_db)
