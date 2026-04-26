"""Auth routes: register, login, refresh, logout."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import uuid

from database import get_db
from models.user import User
from models.organization import Organization
from middleware.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: str
    plan: str = "pro"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    # Create organization
    slug = req.company.lower().replace(" ", "-")[:50] + "-" + str(uuid.uuid4())[:8]
    org = Organization(
        name=req.company,
        slug=slug,
        plan=req.plan if req.plan in ["starter", "pro", "business"] else "pro",
        trial_ends_at=datetime.utcnow().replace(day=datetime.utcnow().day + 14),
    )
    db.add(org)
    db.flush()

    user = User(
        name=req.name,
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        organization_id=org.id,
        role="owner",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "org": str(org.id)})
    return TokenResponse(
        access_token=token,
        user={"id": str(user.id), "name": user.name, "email": user.email, "role": user.role},
    )


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated.")

    user.last_login = datetime.utcnow()
    db.commit()

    token = create_access_token({"sub": str(user.id), "org": str(user.organization_id)})
    return TokenResponse(
        access_token=token,
        user={"id": str(user.id), "name": user.name, "email": user.email, "role": user.role},
    )


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "organization_id": str(current_user.organization_id),
    }
