"""Agent system configuration."""

from pydantic_settings import BaseSettings


class AgentConfig(BaseSettings):
    ANTHROPIC_API_KEY: str = ""
    DATABASE_URL: str = "postgresql://truebooks:truebooks@localhost:5432/truebooks"
    REDIS_URL: str = "redis://localhost:6379"
    API_BASE_URL: str = "http://localhost:8000"
    AGENTS_PORT: int = 8001

    # Agent check intervals (seconds)
    BOOKKEEPING_AGENT_INTERVAL: int = 300   # 5 minutes
    QA_AGENT_INTERVAL: int = 3600           # 1 hour
    FEEDBACK_AGENT_INTERVAL: int = 86400    # 24 hours
    GROWTH_AGENT_INTERVAL: int = 86400      # 24 hours
    INSIGHTS_AGENT_INTERVAL: int = 3600     # 1 hour

    class Config:
        env_file = ".env"


config = AgentConfig()
