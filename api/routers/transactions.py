"""Transaction routes with AI auto-categorization."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models.transaction import Transaction
from models.user import User
from middleware.auth import get_current_user
from services.ai_categorizer import categorize_transaction

router = APIRouter()


class TransactionCreate(BaseModel):
    date: datetime
    description: str
    amount: float
    vendor: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
async def list_transactions(
    limit: int = 100,
    offset: int = 0,
    category: Optional[str] = None,
    reconciled: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(
        Transaction.organization_id == current_user.organization_id
    )
    if category:
        query = query.filter(Transaction.category == category)
    if reconciled is not None:
        query = query.filter(Transaction.reconciled == reconciled)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    total = query.count()
    items = query.order_by(Transaction.date.desc()).offset(offset).limit(limit).all()
    return {"total": total, "items": [_serialize(t) for t in items]}


@router.post("/", status_code=201)
async def create_transaction(
    data: TransactionCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = Transaction(
        organization_id=current_user.organization_id,
        date=data.date,
        description=data.description,
        amount=data.amount,
        vendor=data.vendor,
        category=data.category,
        notes=data.notes,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    # AI auto-categorize if no category provided
    if not data.category:
        background_tasks.add_task(_auto_categorize, str(tx.id), db)

    return _serialize(tx)


@router.patch("/{tx_id}/categorize")
async def update_category(
    tx_id: str,
    category: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = _get_tx(tx_id, current_user, db)
    tx.category = category
    tx.ai_categorized = False
    db.commit()
    return _serialize(tx)


@router.post("/bulk-categorize")
async def bulk_categorize(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    uncategorized = db.query(Transaction).filter(
        Transaction.organization_id == current_user.organization_id,
        Transaction.category == None,
    ).all()

    for tx in uncategorized:
        background_tasks.add_task(_auto_categorize, str(tx.id), db)

    return {"message": f"Queued {len(uncategorized)} transactions for AI categorization."}


async def _auto_categorize(tx_id: str, db: Session):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        return
    result = await categorize_transaction(tx.description, tx.amount, tx.vendor)
    tx.category = result.category
    tx.ai_categorized = True
    tx.ai_confidence = result.confidence
    db.commit()


def _get_tx(tx_id: str, user: User, db: Session) -> Transaction:
    tx = db.query(Transaction).filter(
        Transaction.id == tx_id,
        Transaction.organization_id == user.organization_id,
    ).first()
    if not tx:
        raise HTTPException(404, "Transaction not found.")
    return tx


def _serialize(tx: Transaction) -> dict:
    return {
        "id": str(tx.id),
        "date": tx.date.isoformat(),
        "description": tx.description,
        "amount": tx.amount,
        "category": tx.category,
        "ai_categorized": tx.ai_categorized,
        "ai_confidence": tx.ai_confidence,
        "vendor": tx.vendor,
        "reconciled": tx.reconciled,
        "receipt_url": tx.receipt_url,
        "notes": tx.notes,
        "created_at": tx.created_at.isoformat(),
    }
