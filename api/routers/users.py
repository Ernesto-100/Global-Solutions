"""User management routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from database import get_db
from models.user import User
from middleware.auth import get_current_user, hash_password

router = APIRouter()


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class InviteUser(BaseModel):
    email: EmailStr
    name: str
    role: str = "viewer"


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "organization_id": str(current_user.organization_id),
        "created_at": current_user.created_at.isoformat(),
    }


@router.patch("/me")
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.name:
        current_user.name = data.name
    if data.email:
        existing = db.query(User).filter(
            User.email == data.email.lower(), User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(409, "Email already in use.")
        current_user.email = data.email.lower()
    db.commit()
    return {"message": "Profile updated."}


@router.get("/team")
async def list_team(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    members = db.query(User).filter(
        User.organization_id == current_user.organization_id,
        User.is_active == True,
    ).all()
    return [
        {
            "id": str(m.id),
            "name": m.name,
            "email": m.email,
            "role": m.role,
            "last_login": m.last_login.isoformat() if m.last_login else None,
        }
        for m in members
    ]


@router.post("/team/invite", status_code=201)
async def invite_user(
    data: InviteUser,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(403, "Only owners and admins can invite team members.")

    if data.role not in ["admin", "editor", "viewer", "accountant"]:
        raise HTTPException(400, "Invalid role.")

    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(409, "User with this email already exists.")

    # In production: send invite email with temp password
    new_user = User(
        name=data.name,
        email=data.email.lower(),
        hashed_password=hash_password("temp-password-change-on-login"),
        organization_id=current_user.organization_id,
        role=data.role,
    )
    db.add(new_user)
    db.commit()

    return {"message": f"Invitation sent to {data.email}.", "role": data.role}
