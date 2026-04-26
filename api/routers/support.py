"""Support routes including WebSocket live chat."""

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import Dict
import json
import asyncio

from database import get_db
from models.user import User
from models.support_ticket import SupportTicket, SupportMessage
from middleware.auth import get_current_user
from services.support_ai import generate_support_response

router = APIRouter()

# Active WebSocket connections per organization
active_connections: Dict[str, WebSocket] = {}


@router.websocket("/ws/{org_id}")
async def support_websocket(websocket: WebSocket, org_id: str):
    await websocket.accept()
    active_connections[org_id] = websocket

    # Send connection confirmation
    await websocket.send_json({
        "type": "connected",
        "message": "Connected to TrueBooks Support. You're talking to Alex — a real person is monitoring this chat.",
    })

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            # Echo user message
            await websocket.send_json({
                "type": "user_message",
                "content": message.get("content", ""),
            })

            # Show typing indicator
            await websocket.send_json({"type": "agent_typing"})
            await asyncio.sleep(0.5)

            # Generate AI-powered support response
            response = await generate_support_response(message.get("content", ""))

            await websocket.send_json({
                "type": "agent_message",
                "agent": "Alex",
                "content": response,
            })

    except WebSocketDisconnect:
        active_connections.pop(org_id, None)


@router.get("/tickets")
async def list_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tickets = db.query(SupportTicket).filter(
        SupportTicket.organization_id == current_user.organization_id
    ).order_by(SupportTicket.created_at.desc()).limit(50).all()
    return [{"id": str(t.id), "subject": t.subject, "status": t.status, "priority": t.priority} for t in tickets]


@router.post("/tickets", status_code=201)
async def create_ticket(
    subject: str,
    initial_message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ticket = SupportTicket(
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        subject=subject,
    )
    db.add(ticket)
    db.flush()

    msg = SupportMessage(
        ticket_id=ticket.id,
        role="user",
        content=initial_message,
    )
    db.add(msg)
    db.commit()
    return {"id": str(ticket.id), "subject": ticket.subject}
