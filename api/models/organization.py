"""Organization (company) model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Enum, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    currency = Column(String, default="USD")
    fiscal_year_start = Column(Integer, default=1)  # Month number: 1=Jan
    tax_id = Column(String, nullable=True)

    # Subscription
    plan = Column(Enum("starter", "pro", "business", name="plan_type"), default="pro")
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    trial_ends_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    # QuickBooks migration tracking
    qb_migrated = Column(Boolean, default=False)
    qb_migrated_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="organization")
    invoices = relationship("Invoice", back_populates="organization")
    transactions = relationship("Transaction", back_populates="organization")
    accounts = relationship("Account", back_populates="organization")
