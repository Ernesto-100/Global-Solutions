"""Invoice and line item models."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, Boolean, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    invoice_number = Column(String, nullable=False)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=True)
    client_address = Column(Text, nullable=True)

    status = Column(
        Enum("draft", "sent", "viewed", "paid", "overdue", "cancelled", name="invoice_status"),
        default="draft",
    )

    issue_date = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=True)
    paid_date = Column(DateTime, nullable=True)

    subtotal = Column(Float, nullable=False, default=0)
    tax_rate = Column(Float, default=0)
    tax_amount = Column(Float, default=0)
    total = Column(Float, nullable=False, default=0)
    currency = Column(String, default="USD")

    notes = Column(Text, nullable=True)
    payment_terms = Column(String, default="net30")

    # Auto-reminder tracking
    reminder_sent_at = Column(DateTime, nullable=True)
    overdue_reminder_sent_at = Column(DateTime, nullable=True)

    # Audit
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="invoices")
    line_items = relationship("InvoiceLineItem", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=False)
    description = Column(String, nullable=False)
    quantity = Column(Float, default=1)
    unit_price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    sort_order = Column(Integer, default=0)

    invoice = relationship("Invoice", back_populates="line_items")
