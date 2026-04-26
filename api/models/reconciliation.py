"""Reconciliation session model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Integer, Boolean, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from database import Base


class ReconciliationSession(Base):
    __tablename__ = "reconciliation_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False)

    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)

    # Statement values
    statement_opening_balance = Column(Float, nullable=False)
    statement_closing_balance = Column(Float, nullable=False)

    # Computed values
    book_balance = Column(Float, nullable=True)
    difference = Column(Float, nullable=True)
    match_rate = Column(Float, nullable=True)  # 0-100

    status = Column(
        Enum("in_progress", "completed", "needs_review", name="recon_status"),
        default="in_progress",
    )

    matched_count = Column(Integer, default=0)
    unmatched_count = Column(Integer, default=0)

    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
