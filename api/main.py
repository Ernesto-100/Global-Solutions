"""TrueBooks API — FastAPI application entry point."""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from routers import auth, users, invoices, expenses, transactions, reports, reconciliation, import_data, support, webhooks
from database import engine, Base
from config import settings

# Create tables (use Alembic for migrations in production)
Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="TrueBooks API",
    description="Reliable bookkeeping API for small businesses",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted hosts
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )

# Health check
@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(invoices.router, prefix="/invoices", tags=["Invoices"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(reconciliation.router, prefix="/reconciliation", tags=["Reconciliation"])
app.include_router(import_data.router, prefix="/import", tags=["Import"])
app.include_router(support.router, prefix="/support", tags=["Support"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Our team has been notified."},
    )
