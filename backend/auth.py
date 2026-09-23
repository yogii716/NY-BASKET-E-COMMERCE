"""
NyBasket Authentication Helper Module
Provides secure password hashing, verification, and user management.
"""

from werkzeug.security import generate_password_hash, check_password_hash
from .models import User


def hash_password(password: str) -> str:
    """Hash a plaintext password using Werkzeug's secure hashing."""
    return generate_password_hash(password, method="pbkdf2:sha256")


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a plaintext password against its stored hash."""
    if not password or not password_hash:
        return False
    return check_password_hash(password_hash, password)


def create_user(db_session, name: str, email: str, password: str, role: str = "customer"):
    """Create a new user with hashed password."""
    email_clean = email.strip().lower()
    existing_user = db_session.query(User).filter_by(email=email_clean).first()
    if existing_user:
        return None, "Email address is already registered."

    user = User(
        name=name.strip(),
        email=email_clean,
        password_hash=hash_password(password),
        role=role
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user, None


def authenticate_user(db_session, email: str, password: str):
    """Authenticate a user by email and plaintext password."""
    email_clean = email.strip().lower()
    user = db_session.query(User).filter_by(email=email_clean).first()
    if not user:
        return None, "Invalid email or password."

    if not verify_password(password, user.password_hash):
        return None, "Invalid email or password."

    return user, None
