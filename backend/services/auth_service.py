"""
KelanaAI - Authentication Service
Handles password hashing (bcrypt), token generation/validation (JWT), and user registration/login.
"""

import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from models.users import Users
from database import get_db

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "kelana_ai_jwt_secret_key_2026_super_secure_token")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# HTTP Bearer scheme for token extraction from Authorization: Bearer <token>
# Using HTTPBearer allows Swagger UI (/docs) to authorize directly with the access_token
security = HTTPBearer(
    auto_error=False,
    description="Enter access_token obtained from /api/v1/auth/login",
)
oauth2_scheme = security  # Alias for backward compatibility


def hash_password(password: str) -> str:
    """
    Hash plain password with bcrypt.
    Never store plain text passwords in database.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify plain password against stored bcrypt hash.
    """
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate signed JWT containing user ID (sub), email, and expiration.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": now,
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate JWT signature and expiry.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


def register_user(db: Session, name: str, email: str, password: str) -> Users:
    """
    Register a new user with hashed password.
    Rejects duplicate email addresses.
    """
    clean_email = email.strip().lower()
    clean_name = name.strip()

    if not clean_email or not clean_name or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, email, and password are required."
        )

    # Check for existing user
    existing_user = db.query(Users).filter(Users.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )

    # Hash password with bcrypt
    hashed_pwd = hash_password(password)

    user = Users(
        name=clean_name,
        email=clean_email,
        password_hash=hashed_pwd,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> Dict[str, Any]:
    """
    Verify user credentials and generate JWT access token.
    """
    clean_email = email.strip().lower()
    user = db.query(Users).filter(Users.email == clean_email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token
    token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "name": user.name,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }
    }


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Users:
    """
    Strict FastAPI Dependency that validates Bearer JWT token and returns authenticated User.
    Raises HTTP 401 if missing or invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not auth or not auth.credentials:
        raise credentials_exception

    token = auth.credentials.strip()
    if token.lower().startswith("bearer "):
        token = token[7:].strip()

    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception

    try:
        user = db.query(Users).filter(Users.id == int(user_id)).first()
        if user is None:
            raise credentials_exception
        return user
    except Exception:
        raise credentials_exception


def get_optional_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[Users]:
    """
    Optional FastAPI Dependency for endpoints that can serve both guests and logged in users.
    Returns User if valid token is provided, None otherwise.
    """
    if not auth or not auth.credentials:
        return None

    token = auth.credentials.strip()
    if token.lower().startswith("bearer "):
        token = token[7:].strip()

    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    try:
        return db.query(Users).filter(Users.id == int(user_id)).first()
    except Exception:
        return None


def get_current_user_from_token(token: Optional[str], db: Session) -> Optional[Users]:
    """
    Helper to extract user from JWT token string.
    """
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    try:
        user = db.query(Users).filter(Users.id == int(user_id)).first()
        return user
    except Exception:
        return None


def seed_superadmin(db: Session) -> Users:
    """
    Ensure default accounts exist in database:
    - superadmin@gmail.com / superadmin
    - alice@gmail.com / alice
    """
    # 1. Super Admin
    admin_email = "superadmin@gmail.com"
    admin_password = "superadmin"
    admin = db.query(Users).filter(Users.email == admin_email).first()

    if not admin:
        admin = Users(
            name="Super Admin",
            email=admin_email,
            password_hash=hash_password(admin_password)
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"[Seed] Created superadmin: {admin_email} (ID: {admin.id})")
    else:
        if not verify_password(admin_password, admin.password_hash):
            admin.password_hash = hash_password(admin_password)
            db.commit()
            db.refresh(admin)
            print(f"[Seed] Updated superadmin password hash: {admin_email}")

    # 2. Alice
    alice_email = "alice@gmail.com"
    alice_password = "alice"
    alice = db.query(Users).filter(Users.email == alice_email).first()

    if not alice:
        alice = Users(
            name="Alice",
            email=alice_email,
            password_hash=hash_password(alice_password)
        )
        db.add(alice)
        db.commit()
        db.refresh(alice)
        print(f"[Seed] Created alice: {alice_email} (ID: {alice.id})")
    else:
        if not verify_password(alice_password, alice.password_hash):
            alice.password_hash = hash_password(alice_password)
            db.commit()
            db.refresh(alice)
            print(f"[Seed] Updated alice password hash: {alice_email}")

    return admin
