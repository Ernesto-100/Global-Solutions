"""Base agent class — all agents inherit from this."""

import anthropic
import json
import asyncio
from datetime import datetime
from typing import Any, Dict, List, Optional
from config import config

client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)


class BaseAgent:
    """
    Base class for all TrueBooks AI agents.
    Each agent has a role, tools, and a feedback loop mechanism.
    """

    name: str = "BaseAgent"
    role: str = "General Agent"
    model: str = "claude-sonnet-4-6"
    max_tokens: int = 2000

    def __init__(self):
        self.logs: List[Dict] = []
        self.metrics: Dict[str, Any] = {}
        self.started_at = datetime.utcnow()
        self.run_count = 0
        self.error_count = 0

    def system_prompt(self) -> str:
        return f"""You are {self.name}, a specialized AI agent for TrueBooks — a reliable bookkeeping platform for small businesses.

Your role: {self.role}

Core principles:
1. Accuracy first — never make assumptions about financial data
2. Flag uncertainty — if unsure, escalate to the CEO agent or human
3. Continuous improvement — log every action and its outcome
4. Trust through transparency — every decision is auditable

Current time: {datetime.utcnow().isoformat()}"""

    async def think(self, prompt: str, tools: Optional[List[Dict]] = None) -> str:
        """Send a prompt to Claude and get a response."""
        kwargs = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "system": self.system_prompt(),
            "messages": [{"role": "user", "content": prompt}],
        }
        if tools:
            kwargs["tools"] = tools

        message = client.messages.create(**kwargs)
        return message.content[0].text

    def log(self, action: str, details: Dict = None, level: str = "info"):
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent": self.name,
            "action": action,
            "level": level,
            "details": details or {},
        }
        self.logs.append(entry)
        print(f"[{level.upper()}] [{self.name}] {action}", details or "")

    def record_metric(self, key: str, value: Any):
        self.metrics[key] = value
        self.metrics[f"{key}_at"] = datetime.utcnow().isoformat()

    async def run_once(self):
        """Override in subclass — called on each scheduled cycle."""
        raise NotImplementedError

    async def start(self, interval_seconds: int):
        """Start the agent's continuous loop."""
        self.log(f"Agent started (interval: {interval_seconds}s)")
        while True:
            try:
                self.run_count += 1
                await self.run_once()
                self.log(f"Cycle {self.run_count} complete")
            except Exception as e:
                self.error_count += 1
                self.log(f"Error in cycle {self.run_count}: {e}", level="error")
            await asyncio.sleep(interval_seconds)

    def status(self) -> Dict:
        uptime = (datetime.utcnow() - self.started_at).total_seconds()
        return {
            "agent": self.name,
            "role": self.role,
            "run_count": self.run_count,
            "error_count": self.error_count,
            "uptime_seconds": round(uptime),
            "metrics": self.metrics,
            "last_logs": self.logs[-10:],
        }
