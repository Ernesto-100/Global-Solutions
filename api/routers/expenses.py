"""Expense routes (wraps transactions with expense-specific logic)."""

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from middleware.auth import get_current_user

router = APIRouter()

@router.get("/")
async def list_expenses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from models.transaction import Transaction
    expenses = db.query(Transaction).filter(
        Transaction.organization_id == current_user.organization_id,
        Transaction.amount < 0,
    ).order_by(Transaction.date.desc()).limit(100).all()
    return {"items": [
        {"id": str(e.id), "description": e.description, "amount": abs(e.amount),
         "date": e.date.isoformat(), "category": e.category, "vendor": e.vendor,
         "ai_categorized": e.ai_categorized, "receipt_url": e.receipt_url}
        for e in expenses
    ]}


@router.post("/{expense_id}/receipt")
async def upload_receipt(
    expense_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from services.storage import upload_file
    from models.transaction import Transaction

    tx = db.query(Transaction).filter(
        Transaction.id == expense_id,
        Transaction.organization_id == current_user.organization_id,
    ).first()
    if not tx:
        from fastapi import HTTPException
        raise HTTPException(404, "Expense not found.")

    content = await file.read()
    url = await upload_file(content, file.filename, f"receipts/{expense_id}")
    tx.receipt_url = url
    db.commit()
    return {"receipt_url": url}
