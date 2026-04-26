"""Invoice CRUD routes with auto-reminder logic."""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from database import get_db
from models.invoice import Invoice, InvoiceLineItem
from models.user import User
from middleware.auth import get_current_user
from services.email_service import send_invoice_email

router = APIRouter()


class LineItemCreate(BaseModel):
    description: str
    quantity: float = 1.0
    unit_price: float


class InvoiceCreate(BaseModel):
    client_name: str
    client_email: Optional[str] = None
    invoice_number: str
    issue_date: datetime
    payment_terms: str = "net30"
    tax_rate: float = 0
    notes: Optional[str] = None
    line_items: List[LineItemCreate]


def compute_due_date(issue_date: datetime, terms: str) -> datetime:
    days = {"immediate": 0, "net15": 15, "net30": 30, "net60": 60}
    return issue_date + timedelta(days=days.get(terms, 30))


@router.get("/")
async def list_invoices(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Invoice).filter(Invoice.organization_id == current_user.organization_id)
    if status:
        query = query.filter(Invoice.status == status)
    total = query.count()
    invoices = query.order_by(Invoice.created_at.desc()).offset(offset).limit(limit).all()
    return {"total": total, "items": [_serialize(inv) for inv in invoices]}


@router.post("/", status_code=201)
async def create_invoice(
    data: InvoiceCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    subtotal = sum(item.quantity * item.unit_price for item in data.line_items)
    tax_amount = subtotal * (data.tax_rate / 100)
    total = subtotal + tax_amount
    due_date = compute_due_date(data.issue_date, data.payment_terms)

    invoice = Invoice(
        organization_id=current_user.organization_id,
        invoice_number=data.invoice_number,
        client_name=data.client_name,
        client_email=data.client_email,
        issue_date=data.issue_date,
        due_date=due_date,
        subtotal=subtotal,
        tax_rate=data.tax_rate,
        tax_amount=tax_amount,
        total=total,
        notes=data.notes,
        payment_terms=data.payment_terms,
    )
    db.add(invoice)
    db.flush()

    for i, item in enumerate(data.line_items):
        li = InvoiceLineItem(
            invoice_id=invoice.id,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total=item.quantity * item.unit_price,
            sort_order=i,
        )
        db.add(li)

    db.commit()
    db.refresh(invoice)
    return _serialize(invoice)


@router.patch("/{invoice_id}/send", status_code=200)
async def send_invoice(
    invoice_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoice = _get_invoice(invoice_id, current_user, db)
    if invoice.status not in ["draft"]:
        raise HTTPException(400, "Invoice has already been sent.")
    invoice.status = "sent"
    db.commit()

    if invoice.client_email:
        background_tasks.add_task(send_invoice_email, invoice)

    return {"message": "Invoice sent.", "invoice": _serialize(invoice)}


@router.patch("/{invoice_id}/mark-paid")
async def mark_paid(
    invoice_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoice = _get_invoice(invoice_id, current_user, db)
    invoice.status = "paid"
    invoice.paid_date = datetime.utcnow()
    db.commit()
    return _serialize(invoice)


@router.delete("/{invoice_id}", status_code=204)
async def delete_invoice(
    invoice_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoice = _get_invoice(invoice_id, current_user, db)
    if invoice.status in ["paid"]:
        raise HTTPException(400, "Cannot delete a paid invoice.")
    invoice.status = "cancelled"
    db.commit()


def _get_invoice(invoice_id: str, user: User, db: Session) -> Invoice:
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.organization_id == user.organization_id,
    ).first()
    if not invoice:
        raise HTTPException(404, "Invoice not found.")
    return invoice


def _serialize(inv: Invoice) -> dict:
    return {
        "id": str(inv.id),
        "invoice_number": inv.invoice_number,
        "client_name": inv.client_name,
        "client_email": inv.client_email,
        "status": inv.status,
        "issue_date": inv.issue_date.isoformat() if inv.issue_date else None,
        "due_date": inv.due_date.isoformat() if inv.due_date else None,
        "paid_date": inv.paid_date.isoformat() if inv.paid_date else None,
        "subtotal": inv.subtotal,
        "tax_amount": inv.tax_amount,
        "total": inv.total,
        "currency": inv.currency,
        "notes": inv.notes,
        "line_items": [
            {
                "description": li.description,
                "quantity": li.quantity,
                "unit_price": li.unit_price,
                "total": li.total,
            }
            for li in inv.line_items
        ],
        "created_at": inv.created_at.isoformat(),
    }
