"""Bank reconciliation routes."""

from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models.reconciliation import ReconciliationSession
from models.transaction import Transaction
from models.user import User
from middleware.auth import get_current_user

router = APIRouter()


class ReconciliationStart(BaseModel):
    account_id: str
    period_start: datetime
    period_end: datetime
    statement_opening_balance: float
    statement_closing_balance: float


class MatchPair(BaseModel):
    book_transaction_id: str
    bank_transaction_id: str


@router.post("/start", status_code=201)
async def start_reconciliation(
    data: ReconciliationStart,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = ReconciliationSession(
        organization_id=current_user.organization_id,
        account_id=data.account_id,
        period_start=data.period_start,
        period_end=data.period_end,
        statement_opening_balance=data.statement_opening_balance,
        statement_closing_balance=data.statement_closing_balance,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Auto-run matching
    matched, unmatched = _auto_match(
        str(current_user.organization_id),
        data.period_start,
        data.period_end,
        db,
    )

    session.matched_count = matched
    session.unmatched_count = unmatched
    session.match_rate = round(matched / max(matched + unmatched, 1) * 100, 1)
    db.commit()

    return {
        "session_id": str(session.id),
        "matched": matched,
        "unmatched": unmatched,
        "match_rate": session.match_rate,
    }


@router.post("/{session_id}/complete")
async def complete_reconciliation(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = db.query(ReconciliationSession).filter(
        ReconciliationSession.id == session_id,
        ReconciliationSession.organization_id == current_user.organization_id,
    ).first()
    if not session:
        raise HTTPException(404, "Session not found.")

    session.status = "completed"
    session.completed_at = datetime.utcnow()

    # Mark all matched transactions as reconciled
    db.query(Transaction).filter(
        Transaction.organization_id == current_user.organization_id,
        Transaction.reconciliation_session_id == session.id,
    ).update({"reconciled": True, "reconciled_at": datetime.utcnow()})

    db.commit()
    return {"message": "Reconciliation completed.", "session_id": session_id}


def _auto_match(org_id: str, start: datetime, end: datetime, db: Session):
    transactions = db.query(Transaction).filter(
        Transaction.organization_id == org_id,
        Transaction.date >= start,
        Transaction.date <= end,
    ).all()

    matched = sum(1 for t in transactions if t.bank_transaction_id)
    unmatched = len(transactions) - matched
    return matched, unmatched
