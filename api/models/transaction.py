"""Transaction model — core of the double-entry bookkeeping system."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Boolean, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)

    # Core fields
    date = Column(DateTime, nullable=False, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)  # Positive=income, negative=expense
    currency = Column(String, default="USD")

    # Categorization
    category = Column(String, nullable=True, index=True)
    ai_categorized = Column(Boolean, default=False)
    ai_confidence = Column(Float, nullable=True)  # 0-1

    # Vendor / Payee
    vendor = Column(String, nullable=True)

    # Bank connection
    bank_account_id = Column(String, nullable=True)
    bank_transaction_id = Column(String, nullable=True)  # Plaid transaction ID
    bank_pending = Column(Boolean, default=False)

    # Reconciliation
    reconciled = Column(Boolean, default=False)
    reconciled_at = Column(DateTime, nullable=True)
    reconciliation_session_id = Column(UUID(as_uuid=True), nullable=True)

    # Receipt
    receipt_url = Column(String, nullable=True)

    # Double-entry reference
    debit_account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=True)
    credit_account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=True)

    # Import tracking
    imported_from = Column(String, nullable=True)  # "quickbooks", "wave", "csv", etc.
    external_id = Column(String, nullable=True)  # Original ID from source system

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="transactions")
    debit_account = relationship("Account", foreign_keys=[debit_account_id])
    credit_account = relationship("Account", foreign_keys=[credit_account_id])
