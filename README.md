# TrueBooks — The Bookkeeping Platform Small Businesses Actually Trust

> "Switch from QuickBooks in one day. Never worry about your books again."

## The Problem We Solve

Thousands of small business owners on Reddit and review sites say the same thing:

> *"I'm paying more every year for a tool that still doesn't fully work for me, and support is useless when something breaks."*

That's three problems in one sentence: **cost**, **reliability**, and **support**.

TrueBooks solves all three — at once.

---

## The 4 Pillars We Win On

| Pillar | Our Approach |
|--------|-------------|
| **Reliability** | Zero data loss. Validated double-entry. Real-time reconciliation checks. Immutable audit trail. |
| **Speed** | Sub-200ms load times. Instant categorization. No spinners. |
| **Complete Workflows** | Invoicing, expenses, reconciliation, reporting — done right, not "simplified to useless." |
| **Real Support** | Live chat with bookkeeping experts. < 2 min response. Free QB migration. No bots. |

---

## Ecosystem Architecture

```
truebooks/
├── apps/
│   ├── web/          # Marketing website (truebooks.io) — Next.js 14
│   ├── app/          # Bookkeeping application (app.truebooks.io) — Next.js 14
│   └── admin/        # Operations dashboard (admin.truebooks.io) — Next.js 14
├── api/              # REST API + WebSocket (api.truebooks.io) — FastAPI
├── agents/           # 24/7 AI agent organization — Python + Claude
│   ├── orchestrator.py     # CEO Agent — coordinates all agents
│   ├── bookkeeping_agent.py # Auto-categorization, anomaly detection
│   ├── support_agent.py    # 24/7 live chat AI
│   ├── insights_agent.py   # Cash flow forecasting, financial intelligence
│   ├── feedback_agent.py   # Voice of the customer, competitor analysis
│   ├── qa_agent.py         # Data integrity, system health
│   └── growth_agent.py     # Churn detection, conversion optimization
├── infrastructure/
│   ├── nginx/        # Reverse proxy + SSL termination
│   └── scripts/      # Setup + deployment automation
└── docker-compose.yml
```

### The Autonomous Organization

TrueBooks runs as a **24/7 autonomous organization** where AI agents handle operations:

| Agent | Role | Interval |
|-------|------|----------|
| **CEO Agent** | Orchestrates all agents, strategic decisions | 6 hours |
| **Bookkeeping Agent** | Auto-categorizes, detects anomalies, validates balances | 5 min |
| **Support Agent** | Live chat, ticket monitoring, CSAT feedback | 1 min |
| **Insights Agent** | Cash flow forecasts, revenue risk alerts | 1 hour |
| **Feedback Agent** | Product intelligence, competitor analysis | 24 hours |
| **QA Agent** | Data integrity, API health, system health score | 1 hour |
| **Growth Agent** | Churn risk, trial conversion, MRR tracking | 24 hours |

The **feedback loop** is built into every agent — each cycle improves the product.

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker + Docker Compose
- Python 3.12+ (for local API/agents dev)
- Anthropic API key
- Stripe account (for payments)

### Setup

```bash
git clone https://github.com/ernesto-100/global-solutions.git
cd global-solutions

# Run the setup wizard
chmod +x infrastructure/scripts/setup.sh
./infrastructure/scripts/setup.sh

# Edit your environment variables
nano .env

# Start everything
docker compose up
```

### Development

```bash
npm install          # Install all workspace dependencies
npm run dev          # Start all apps in parallel
```

| URL | Service |
|-----|---------|
| http://localhost:3000 | Marketing website |
| http://localhost:3001 | Bookkeeping app |
| http://localhost:3002 | Admin dashboard |
| http://localhost:8000/docs | API documentation |
| http://localhost:8001/docs | Agent status API |

---

## Pricing

| Plan | Price | Target |
|------|-------|--------|
| **Starter** | $19/mo | Freelancers, solo operators |
| **Pro** | $49/mo | Growing businesses (most popular) |
| **Business** | $99/mo | Established businesses near $1M |

vs. QuickBooks: $55–$189/mo for equivalent features.

**Our pricing promise:** We never raise prices on existing customers.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend API | FastAPI (Python), SQLAlchemy, PostgreSQL |
| AI Agents | Anthropic Claude (claude-sonnet-4-6, claude-haiku-4-5) |
| Caching | Redis |
| File Storage | AWS S3 |
| Email | Resend |
| Payments | Stripe |
| Proxy | Nginx |
| Containers | Docker + Docker Compose |

---

## Deployment

### Production

```bash
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh production
```

The script does zero-downtime rolling restarts and validates API health before completing.

### Environment Variables

See `.env.example` for all required variables.

Critical ones:
- `ANTHROPIC_API_KEY` — for AI agents and support
- `DATABASE_URL` — PostgreSQL connection string
- `STRIPE_SECRET_KEY` — for payment processing
- `NEXTAUTH_SECRET` — for session security

---

## The Feedback Loop

Every agent reports back to the CEO agent, which synthesizes insights weekly:

1. **Bookkeeping Agent** → categorization accuracy, anomalies detected
2. **Support Agent** → CSAT scores, common ticket themes
3. **Insights Agent** → forecast accuracy, risks flagged
4. **Feedback Agent** → top feature requests, competitor weaknesses
5. **QA Agent** → integrity scores, bugs found
6. **Growth Agent** → MRR, churn, conversion rates

The CEO agent reads all reports and generates the **weekly strategic plan** — what to build, fix, and optimize next week.

This is the compounding flywheel that makes TrueBooks get better every week without human intervention.

---

## Core Features

### For Customers
- Professional invoicing with auto-reminders
- Expense tracking with AI auto-categorization (94%+ accuracy)
- Bank reconciliation wizard
- P&L, Balance Sheet, Cash Flow reports
- Cash flow forecasting (AI-powered, 4-month horizon)
- 1-click QuickBooks migration
- Receipt capture + OCR
- Multi-currency support
- Live chat with real humans (< 2 min response)

### For Operations (Admin Dashboard)
- Real-time agent monitoring
- System health score (0-100)
- MRR and growth metrics
- Churn risk alerts
- Feedback loop status
- Audit log viewer

---

## Security

- AES-256 encryption at rest
- TLS 1.3 in transit
- JWT authentication with 7-day expiry
- Immutable audit trail for every financial change
- Read-only bank connections via Plaid
- Rate limiting on all API endpoints
- SOC 2 Type II certification (planned)

---

## License

MIT License — see LICENSE file.

Built with ❤️ for small business owners who deserve better than QuickBooks.
