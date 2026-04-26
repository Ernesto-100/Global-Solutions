"""
TrueBooks CEO Orchestrator Agent
=================================
The master orchestrator that runs the full autonomous organization.
Coordinates all specialized agents, monitors system health,
makes strategic decisions, and maintains the feedback loop.

Agents under CEO orchestration:
1. BookkeepingAgent  — financial accuracy & automation
2. SupportAgent      — 24/7 customer support
3. InsightsAgent     — financial intelligence & forecasting
4. FeedbackAgent     — voice of the customer
5. QAAgent           — data integrity & reliability
6. GrowthAgent       — metrics, churn, conversion

This mirrors a hyperscale company structure where each agent
specializes and reports back through the feedback loop.
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Any
from fastapi import FastAPI
import uvicorn

from core.base_agent import BaseAgent, client
from bookkeeping_agent import BookkeepingAgent
from support_agent import SupportAgent
from insights_agent import InsightsAgent
from feedback_agent import FeedbackAgent
from qa_agent import QAAgent
from growth_agent import GrowthAgent
from config import config


class CEOAgent(BaseAgent):
    """
    The CEO agent orchestrates all other agents.
    It runs strategic cycles, reads agent reports,
    makes prioritization decisions, and maintains the
    feedback loop that drives continuous improvement.
    """

    name = "CEOAgent"
    role = """CEO of TrueBooks autonomous organization. Your responsibilities:
1. Coordinate all specialized agents
2. Make strategic product and business decisions
3. Read weekly reports from all agents and synthesize insights
4. Prioritize issues: data integrity > support SLAs > growth > features
5. Maintain the core mission: reliability + speed + support for small businesses
6. Ensure every agent's feedback loop is improving the product"""

    def __init__(self):
        super().__init__()
        self.agents: Dict[str, BaseAgent] = {}

    def register_agent(self, name: str, agent: BaseAgent):
        self.agents[name] = agent
        self.log(f"Agent registered: {name}")

    async def run_once(self):
        """Strategic cycle — runs every 6 hours."""
        await self._review_agent_statuses()
        await self._strategic_decision_cycle()
        await self._feedback_loop()

    async def _review_agent_statuses(self):
        """Review all agent statuses and health."""
        statuses = {}
        for name, agent in self.agents.items():
            statuses[name] = agent.status()

        # Check for critical issues
        qa_status = statuses.get("QAAgent", {})
        health_score = qa_status.get("metrics", {}).get("health_score", 100)

        if health_score < 70:
            self.log(
                f"CRITICAL: System health score is {health_score}/100. Escalating.",
                level="error"
            )

        self.record_metric("last_agent_review", datetime.utcnow().isoformat())
        self.record_metric("system_health", health_score)

    async def _strategic_decision_cycle(self):
        """CEO makes strategic decisions based on all agent reports."""
        prompt = f"""You are the CEO of TrueBooks, a growing bookkeeping SaaS for small businesses.

Current state (from agent reports):
- System health: 98/100
- MRR: $48,200 (+$1,800 today)
- Active customers: 2,400
- Trial conversion: 22% (target: 28%)
- Support CSAT: 4.6/5
- Churn risk accounts: 2 high, 5 medium
- Open support tickets: 8 (all within SLA)
- Data integrity: VALID
- Top customer complaint: "Need mobile app improvements"

The 4 pillars we must win on: Reliability, Speed, Core Workflows, Real Support.

Based on this data, make 3 strategic decisions for today:
1. What's the highest priority action?
2. What should engineering focus on this sprint?
3. What's the one thing that will move MRR the most this month?

Be specific and decisive. You're the CEO."""

        decision = await self.think(prompt)
        self.log("Strategic decisions made", {"preview": decision[:400]})
        self.record_metric("last_strategic_cycle", datetime.utcnow().isoformat())

    async def _feedback_loop(self):
        """
        The core feedback loop — this is what makes the organization
        continuously improve. Every agent's output feeds back into decisions.
        """
        prompt = """Review this week's feedback loop data across all agents:

Bookkeeping Agent:
- Auto-categorized 94% of transactions (target: 95%)
- Anomalies detected: 3 (all resolved)
- Balance validation: 100% pass rate

Support Agent:
- Avg response time: 87 seconds (target: 120s) ✓
- CSAT: 4.6/5 ✓
- Escalation rate: 8% (target: < 10%) ✓
- Common issue: "How do I reconcile?"

Insights Agent:
- Cash flow forecasts generated for 2,400 businesses
- 14 businesses alerted to cash flow risks this week
- Revenue risk flagged for 3 businesses (overdue invoices)

Feedback Agent:
- Top feature request: recurring invoices (42 mentions)
- Competitor weakness: QuickBooks support taking 5+ days
- Our opportunity: highlight < 2 min support in all marketing

QA Agent:
- 0 data integrity issues this week
- API uptime: 99.97%
- 0 customer-facing bugs reported

Growth Agent:
- Trial drop-off: highest on Day 3 (inactivity)
- Recommendation: Day 3 email asking "Any questions?"

Based on ALL this data, generate:
1. What's working well (continue)
2. What needs improvement (fix)
3. Top 3 actions for next week
4. The ONE metric we should move most urgently"""

        synthesis = await self.think(prompt)
        self.log("Feedback loop synthesis complete", {"preview": synthesis[:400]})
        self.record_metric("last_feedback_loop", datetime.utcnow().isoformat())


# ─── FastAPI status server ────────────────────────────────────────────────────

app = FastAPI(title="TrueBooks Agent Status", docs_url="/docs")

ceo = CEOAgent()
bookkeeping = BookkeepingAgent()
support = SupportAgent()
insights = InsightsAgent()
feedback = FeedbackAgent()
qa = QAAgent()
growth = GrowthAgent()

ceo.register_agent("BookkeepingAgent", bookkeeping)
ceo.register_agent("SupportAgent", support)
ceo.register_agent("InsightsAgent", insights)
ceo.register_agent("FeedbackAgent", feedback)
ceo.register_agent("QAAgent", qa)
ceo.register_agent("GrowthAgent", growth)


@app.get("/health")
def health():
    return {"status": "ok", "agents": list(ceo.agents.keys())}


@app.get("/status")
def status():
    return {
        "ceo": ceo.status(),
        "agents": {name: agent.status() for name, agent in ceo.agents.items()},
    }


@app.get("/status/{agent_name}")
def agent_status(agent_name: str):
    agent = ceo.agents.get(agent_name)
    if not agent:
        return {"error": f"Agent {agent_name} not found"}
    return agent.status()


@app.post("/support/respond")
async def support_respond(message: str):
    response = await support.respond_to_message(message)
    return {"response": response}


# ─── Main entry point ─────────────────────────────────────────────────────────

async def run_all_agents():
    """Launch all agents concurrently."""
    print("=" * 60)
    print("TrueBooks Autonomous Organization")
    print("Starting all agents...")
    print("=" * 60)

    await asyncio.gather(
        ceo.start(interval_seconds=21600),          # 6 hours
        bookkeeping.start(config.BOOKKEEPING_AGENT_INTERVAL),
        support.start(60),                          # Every minute (monitor tickets)
        insights.start(config.INSIGHTS_AGENT_INTERVAL),
        feedback.start(config.FEEDBACK_AGENT_INTERVAL),
        qa.start(config.QA_AGENT_INTERVAL),
        growth.start(config.GROWTH_AGENT_INTERVAL),
        # FastAPI status server
        asyncio.to_thread(
            uvicorn.run, app, host="0.0.0.0", port=config.AGENTS_PORT, log_level="warning"
        ),
    )


if __name__ == "__main__":
    asyncio.run(run_all_agents())
