"""Support ticket and message models."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    subject = Column(String, nullable=False)
    status = Column(
        Enum("open", "in_progress", "resolved", "closed", name="ticket_status"),
        default="open",
    )
    priority = Column(
        Enum("low", "medium", "high", "urgent", name="ticket_priority"),
        default="medium",
    )

    # CSAT tracking
    satisfaction_score = Column(String, nullable=True)  # 1-5
    satisfaction_feedback = Column(Text, nullable=True)

    first_response_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("SupportMessage", back_populates="ticket", order_by="SupportMessage.created_at")


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("support_tickets.id"), nullable=False)

    role = Column(Enum("user", "agent", "ai", name="message_role"), nullable=False)
    content = Column(Text, nullable=False)
    agent_name = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("SupportTicket", back_populates="messages")
