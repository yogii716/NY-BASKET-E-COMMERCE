"""
NyBasket E-Commerce & Analytics Platform
Database Setup and Session Management
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from .models import Base

# Database paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "nybasket.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Create SQLite engine (with check_same_thread=False for multi-threaded Flask requests)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)

# Session factory
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


def init_db():
    """Create all database tables if they do not exist."""
    Base.metadata.create_all(bind=engine)
    print(f"Database initialized successfully at: {DB_PATH}")


def get_db():
    """Context helper or generator for database sessions."""
    db = SessionLocal()
    try:
        return db
    finally:
        pass
