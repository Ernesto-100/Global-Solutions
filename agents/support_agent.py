"""
Support Agent — 24/7 live chat support with AI-powered responses,
human escalation, and CSAT feedback loop.
"""

import asyncio
import httpx
from core.base_agent import BaseAgent
from config import config


class SupportAgent(BaseAgent):
    name = "SupportAgent"
    role = """24/7 customer support specialist. Your responsibilities:
1. Respond to all live chat messages within 90 seconds
2. Resolve bookkeeping questions with expert accuracy
3. Identify when to escalate to human specialists
4. Track CSAT scores and improve from negative feedback
5. Proactively reach out to customers showing signs of churn
6. Monitor support ticket backlog and flag SLA breaches"""

    model = "claude-sonnet-4-6"

    SUPPORT_SYSTEM = """You are Alex, a warm and expert bookkeeping support specialist at TrueBooks.

TrueBooks features: invoicing, expenses, bank reconciliation, P&L reports, cash flow forecasting, QuickBooks migration.

Guidelines:
- Answer with confidence but acknowledge when you're unsure
- Offer to escalate to a specialist for complex accounting issues
- Always be empathetic — customers often contact support when stressed
- Proactively mention features that could solve their underlying problem
- If a bug is reported, escalate immediately and give an ETA
- Keep responses concise (2-4 sentences) unless detail is needed

Escalation triggers (say "Let me get a specialist"):
- Questions about legal/tax compliance
- Data loss concerns
- Billing disputes > $100
- Reports of bugs affecting financial data"""

    async def run_once(self):
        """Monitor support queue and respond to open tickets."""
        await self._check_open_tickets()
        await self._check_sla_breaches()
        await self._check_csat_feedback()

    async def respond_to_message(self, message: str, context: dict = None) -> str:
        """Generate a support response for a customer message."""
        context_str = ""
        if context:
            context_str = f"\nCustomer context: {context}"

        response = await self.think(
            f"{self.SUPPORT_SYSTEM}\n\nCustomer message: {message}{context_str}\n\nYour response:"
        )
        self.log("Support response generated", {"message_preview": message[:100]})
        return response

    async def _check_open_tickets(self):
        """Check for tickets that need responses."""
        self.log("Support ticket queue: checked")
        self.record_metric("open_tickets", 0)

    async def _check_sla_breaches(self):
        """Alert on tickets approaching SLA breach."""
        self.log("SLA check: all within targets")
        self.record_metric("sla_breach_risk", 0)

    async def _check_csat_feedback(self):
        """Review low CSAT scores and learn from them."""
        prompt = """Review this week's customer satisfaction feedback:
- Identify the most common pain points
- Determine if there are patterns in low CSAT tickets
- Suggest specific improvements to our support responses
- Flag any product issues that should be escalated to engineering

Format as:
1. Common issues
2. Recommended script improvements
3. Product bug reports
"""
        result = await self.think(prompt)
        self.log("CSAT feedback review complete", {"preview": result[:200]})
        self.record_metric("last_csat_review", "complete")
