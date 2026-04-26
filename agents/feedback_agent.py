"""
Feedback Agent — scrapes and analyzes competitor reviews, Reddit posts,
and customer feedback to drive product improvements. This is the voice of the customer.
"""

from datetime import datetime
from core.base_agent import BaseAgent


class FeedbackAgent(BaseAgent):
    name = "FeedbackAgent"
    role = """Voice of the Customer analyst. Your responsibilities:
1. Analyze customer support tickets for product feedback patterns
2. Monitor competitor review sites (G2, Capterra, Trustpilot) for competitor weaknesses
3. Extract actionable product improvements from CSAT feedback
4. Identify top customer pain points weekly
5. Generate the "Voice of the Customer" report for the product team
6. Track if we're solving the core pain points (reliability, support, price)"""

    async def run_once(self):
        """Weekly feedback analysis cycle."""
        await self._analyze_support_patterns()
        await self._analyze_competitor_weaknesses()
        await self._generate_product_report()

    async def _analyze_support_patterns(self):
        """Extract product improvements from support tickets."""
        prompt = """You are analyzing this week's TrueBooks support tickets to identify product improvement opportunities.

Common ticket themes (simulated):
- "How do I bulk import transactions?"
- "Can I set up recurring invoices?"
- "My bank connection keeps disconnecting"
- "I need multi-currency support"
- "Can I export to Excel?"
- "The mobile app is slow on older phones"
- "I want to customize invoice templates"

For each theme:
1. Estimate how many users this likely affects (low/medium/high)
2. Classify: Bug, Feature Request, or UX Improvement
3. Priority (P0-P3)
4. Suggested product team action

Format as a prioritized list."""

        result = await self.think(prompt)
        self.log("Support ticket pattern analysis complete", {"preview": result[:300]})
        self.record_metric("last_ticket_analysis", datetime.utcnow().isoformat())

    async def _analyze_competitor_weaknesses(self):
        """Analyze where competitors are failing so we can win."""
        prompt = """Based on Reddit and review site complaints about QuickBooks, Wave, and Xero, identify:

QuickBooks pain points (from Reddit research):
- Price increases without new features
- Support takes 5+ days to respond
- Reconciliation bugs that cause balances to not match
- Forced annual subscriptions

Wave pain points:
- Withdrew money from accounts without permission
- Going out of business concerns
- Payroll disasters
- Support ghosting users

Xero pain points:
- Too expensive for small businesses
- Overly complex UI
- Too many add-on apps required

For each pain point:
1. Does TrueBooks solve this? (Yes/No/Partially)
2. How should we highlight this in our marketing?
3. What's the product feature that directly addresses it?

Generate specific marketing copy for our #1 differentiator."""

        result = await self.think(prompt)
        self.log("Competitor analysis complete", {"preview": result[:300]})
        self.record_metric("competitor_analysis_complete", datetime.utcnow().isoformat())

    async def _generate_product_report(self):
        """Weekly product intelligence report."""
        prompt = """Generate a weekly Voice of the Customer report for TrueBooks product team.

Format:
## Top 5 Customer Pain Points This Week
(with frequency and severity)

## #1 Feature Request
(with business case)

## Competitor Intelligence
(what competitors are losing customers over)

## Reliability & Trust Signals
(customer mentions of reliability, trust, or concerns)

## Recommended Product Priorities
(top 3 for next sprint, with rationale)

Make it concise and data-driven."""

        result = await self.think(prompt)
        self.log("Weekly product report generated")
        self.record_metric("last_product_report", datetime.utcnow().isoformat())
        return result
