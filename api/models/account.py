"""Chart of accounts model."""

import uuid
from sqlalchemy import Column, String, Float, Boolean, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    name = Column(String, nullable=False)
    code = Column(String, nullable=True)  # Account number e.g. "1000"
    type = Column(
        Enum(
            "asset", "liability", "equity", "revenue", "expense",
            name="account_type"
        ),
        nullable=False,
    )
    subtype = Column(String, nullable=True)  # e.g. "bank", "accounts_receivable"
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_bank_account = Column(Boolean, default=False)
    balance = Column(Float, default=0.0)
    sort_order = Column(Integer, default=0)

    # Import tracking
    external_id = Column(String, nullable=True)

    organization = relationship("Organization", back_populates="accounts")
