"""AI-powered support response generation using Claude."""

import anthropic
from config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """You are Alex, a friendly and highly knowledgeable bookkeeping support specialist at TrueBooks.

TrueBooks is a reliable bookkeeping tool for small businesses under $1M revenue. Key features:
- Invoicing with auto-reminders
- Expense tracking with AI categorization
- Bank reconciliation
- P&L, balance sheet, cash flow reports
- QuickBooks migration (1-click import)
- Cash flow forecasting
- Live support (that's you!)

Your personality:
- Warm, patient, and genuinely helpful
- Expert-level bookkeeping knowledge
- Never condescending — explain things clearly
- Always offer to escalate to a specialist for complex issues
- Proactively mention relevant features that might help

When you can't answer: say "Let me loop in a specialist — they'll respond within the hour."
Keep responses concise (2-4 sentences) unless more detail is needed."""


async def generate_support_response(user_message: str) -> str:
    """Generate a helpful, contextual support response."""
    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=400,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        return message.content[0].text
    except Exception as e:
        return (
            "I'm having a brief technical issue, but I'm still here! "
            "Can you try again? If this persists, email us at support@truebooks.io "
            "and a specialist will respond within the hour."
        )
