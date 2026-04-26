"""
Insights Agent — generates financial insights, cash flow forecasts,
and proactive alerts for each business using Claude.
"""

import httpx
from datetime import datetime, timedelta
from core.base_agent import BaseAgent
from config import config


class InsightsAgent(BaseAgent):
    name = "InsightsAgent"
    role = """Financial intelligence analyst. Your responsibilities:
1. Generate weekly financial insights for each business
2. Build and refine cash flow forecasts using ML patterns
3. Identify expense trends and savings opportunities
4. Detect revenue risks (overdue invoices, customer concentration)
5. Alert on cash flow issues BEFORE they become problems
6. Generate monthly bookkeeper-quality commentary on financial performance"""

    async def run_once(self):
        """Run insight generation cycle."""
        await self._generate_cash_flow_forecasts()
        await self._detect_revenue_risks()
        await self._generate_expense_insights()

    async def _generate_cash_flow_forecasts(self):
        """Generate AI-powered cash flow forecasts."""
        prompt = """You are a financial analyst reviewing a small business's cash flow data.

Historical data (last 6 months):
- Monthly revenue: $28,400, $32,100, $27,800, $35,200, $31,600, $38,900
- Monthly expenses: $18,200, $21,000, $19,500, $22,300, $20,100, $24,600
- Current cash balance: $86,800

Generate a 4-month cash flow forecast including:
1. Expected revenue range (low/mid/high scenarios)
2. Expected expense projections
3. Projected cash balance trajectory
4. Key risks to the forecast
5. One specific action the business owner should take this month

Be specific and actionable, not generic."""

        result = await self.think(prompt)
        self.log("Cash flow forecast generated", {"preview": result[:300]})
        self.record_metric("last_forecast_generated_at", datetime.utcnow().isoformat())

    async def _detect_revenue_risks(self):
        """Identify revenue concentration and invoice risks."""
        prompt = """Analyze this accounts receivable aging:
- INV-0051: $8,500 due in 9 days (Acme Corp)
- INV-0050: $3,200 due in 3 days (Bright Ideas)
- INV-0047: $5,400 overdue by 15 days (Everest Group)

Revenue concentration:
- Acme Corp: 35% of revenue
- All other clients: each < 10%

Identify:
1. Collection risk (which invoices are at risk?)
2. Concentration risk
3. Specific recommended actions (when to call each client, when to escalate)
4. Cash flow impact if Acme pays 30 days late"""

        result = await self.think(prompt)
        self.log("Revenue risk analysis complete", {"preview": result[:200]})
        self.record_metric("last_revenue_risk_check", datetime.utcnow().isoformat())

    async def _generate_expense_insights(self):
        """Find savings opportunities in expense data."""
        prompt = """Analyze these April 2026 expenses for a $38,900/month revenue business:
- Payroll: $12,800 (33% of revenue)
- Software/SaaS: $3,100 (AWS, Stripe, Figma, Slack, Zoom, Linear, etc.)
- Rent: $2,400
- Marketing: $1,800
- Other: $4,500

Identify:
1. Any expenses that seem high relative to revenue
2. Software subscription audit — what might be duplicated or unused?
3. Benchmarks vs similar-sized businesses
4. Top 2 specific ways to reduce expenses by 10%

Be specific, not generic."""

        result = await self.think(prompt)
        self.log("Expense insights generated", {"preview": result[:200]})
        self.record_metric("last_expense_insights", datetime.utcnow().isoformat())
