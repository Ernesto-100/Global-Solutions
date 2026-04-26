"""
Growth Agent — monitors business metrics, identifies growth opportunities,
tracks churn signals, and optimizes conversion/retention.
"""

from datetime import datetime
from core.base_agent import BaseAgent


class GrowthAgent(BaseAgent):
    name = "GrowthAgent"
    role = """Growth and retention specialist. Your responsibilities:
1. Monitor daily signups, activations, and churn signals
2. Identify customers showing churn risk (not logging in, support tickets, etc.)
3. Optimize trial-to-paid conversion — identify where trials drop off
4. Generate weekly growth metrics report (MRR, churn rate, LTV, CAC)
5. Suggest A/B tests for landing page and onboarding
6. Monitor NPS and CSAT trends
7. Identify expansion revenue opportunities (plan upgrades)"""

    async def run_once(self):
        """Daily growth analysis cycle."""
        await self._check_churn_signals()
        await self._analyze_trial_conversion()
        await self._generate_growth_report()

    async def _check_churn_signals(self):
        """Identify customers at risk of churning."""
        prompt = """Analyze these customer behavioral signals for churn risk:

High risk indicators:
- No login in 14+ days
- Filed 3+ support tickets in 30 days
- Downgraded plan
- Removed bank connection
- Exported all data

Medium risk:
- Login frequency dropped 50%
- CSAT score < 3
- Subscription expires in 7 days without renewal signal

For each risk level, recommend a specific outreach:
1. What to say
2. Who should reach out (AI, support human, or account manager)
3. What offer/help to provide

Current simulated data: 2 high-risk accounts, 5 medium-risk accounts."""

        result = await self.think(prompt)
        self.log("Churn risk analysis complete", {"preview": result[:300]})
        self.record_metric("high_churn_risk_accounts", 2)
        self.record_metric("medium_churn_risk_accounts", 5)

    async def _analyze_trial_conversion(self):
        """Optimize trial-to-paid conversion."""
        prompt = """Analyze our 14-day trial funnel:

Trial cohort (100 trials started this month):
- Day 1: 78 activated (imported data or created first invoice)
- Day 3: 52 had second session
- Day 7: 38 still active
- Day 14: 22 converted to paid (22% conversion rate)

Industry benchmark: 25-30% trial conversion

Identify:
1. Where do we lose the most trials? (activation gap)
2. What do the 22 converted users have in common?
3. 3 specific interventions to improve conversion to 28%
4. What email/in-app message should be sent on Day 3 to inactive trials?

Be specific — give exact copy for the Day 3 message."""

        result = await self.think(prompt)
        self.log("Trial conversion analysis complete", {"preview": result[:300]})
        self.record_metric("trial_conversion_rate", 22.0)

    async def _generate_growth_report(self):
        """Daily growth metrics summary."""
        prompt = """Generate a daily growth metrics report for TrueBooks CEO.

Simulated data:
- MRR: $48,200 (+$1,800 vs yesterday)
- New trials: 14
- Trial activations: 9 (64% activation rate)
- Churned accounts: 1 (reason: found cheaper alternative)
- Plan upgrades: 2 (Starter → Pro)
- NPS this week: 72
- Support CSAT: 4.6/5

Format as a 5-bullet executive summary with:
- Status (green/yellow/red) for each metric
- One key risk
- One key opportunity
- One recommended action for today"""

        result = await self.think(prompt)
        self.log("Daily growth report generated")
        self.record_metric("last_growth_report", datetime.utcnow().isoformat())
        self.record_metric("mrr", 48200)
        return result
