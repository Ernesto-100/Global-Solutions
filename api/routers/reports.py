"""Financial report generation routes."""

from datetime import datetime, date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from database import get_db
from models.transaction import Transaction
from models.invoice import Invoice
from models.user import User
from middleware.auth import get_current_user

router = APIRouter()


@router.get("/profit-loss")
async def profit_loss(
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    org_id = current_user.organization_id
    start = datetime.combine(start_date, datetime.min.time())
    end = datetime.combine(end_date, datetime.max.time())

    transactions = db.query(Transaction).filter(
        Transaction.organization_id == org_id,
        Transaction.date >= start,
        Transaction.date <= end,
    ).all()

    income = sum(t.amount for t in transactions if t.amount > 0)
    expenses = sum(abs(t.amount) for t in transactions if t.amount < 0)
    net = income - expenses

    # Group by category
    by_category: dict = {}
    for t in transactions:
        cat = t.category or "Uncategorized"
        by_category.setdefault(cat, 0)
        by_category[cat] += t.amount

    return {
        "period": {"start": str(start_date), "end": str(end_date)},
        "summary": {
            "total_income": round(income, 2),
            "total_expenses": round(expenses, 2),
            "net_profit": round(net, 2),
            "profit_margin": round((net / income * 100) if income > 0 else 0, 2),
        },
        "by_category": [
            {"category": cat, "amount": round(amt, 2)}
            for cat, amt in sorted(by_category.items(), key=lambda x: abs(x[1]), reverse=True)
        ],
    }


@router.get("/cash-flow")
async def cash_flow(
    months: int = Query(6, ge=1, le=24),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from dateutil.relativedelta import relativedelta
    org_id = current_user.organization_id
    now = datetime.utcnow()
    result = []

    for i in range(months - 1, -1, -1):
        month_start = (now - relativedelta(months=i)).replace(day=1, hour=0, minute=0, second=0)
        month_end = (month_start + relativedelta(months=1)) - relativedelta(seconds=1)

        transactions = db.query(Transaction).filter(
            Transaction.organization_id == org_id,
            Transaction.date >= month_start,
            Transaction.date <= month_end,
        ).all()

        income = sum(t.amount for t in transactions if t.amount > 0)
        expenses = sum(abs(t.amount) for t in transactions if t.amount < 0)

        result.append({
            "month": month_start.strftime("%b %Y"),
            "income": round(income, 2),
            "expenses": round(expenses, 2),
            "net": round(income - expenses, 2),
        })

    return {"data": result}


@router.get("/accounts-receivable")
async def accounts_receivable(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoices = db.query(Invoice).filter(
        Invoice.organization_id == current_user.organization_id,
        Invoice.status.in_(["sent", "viewed", "overdue"]),
    ).all()

    now = datetime.utcnow()
    aging: dict = {"0-30": 0, "31-60": 0, "61-90": 0, "90+": 0}

    for inv in invoices:
        if not inv.due_date:
            continue
        days_overdue = (now - inv.due_date).days
        if days_overdue <= 30:
            aging["0-30"] += inv.total
        elif days_overdue <= 60:
            aging["31-60"] += inv.total
        elif days_overdue <= 90:
            aging["61-90"] += inv.total
        else:
            aging["90+"] += inv.total

    return {
        "total_outstanding": round(sum(inv.total for inv in invoices), 2),
        "aging": aging,
        "invoices": [
            {
                "id": str(inv.id),
                "invoice_number": inv.invoice_number,
                "client": inv.client_name,
                "amount": inv.total,
                "due_date": inv.due_date.isoformat() if inv.due_date else None,
                "status": inv.status,
            }
            for inv in invoices
        ],
    }
