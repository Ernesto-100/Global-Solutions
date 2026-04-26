"""AI-powered transaction categorization using Claude."""

import anthropic
from dataclasses import dataclass
from typing import Optional
from config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

CATEGORIES = [
    "Advertising & Marketing", "Bank Fees", "Business Meals",
    "Contractor Payments", "Equipment", "Insurance", "Interest Expense",
    "Legal & Professional", "Office Supplies", "Payroll", "Rent",
    "Sales Revenue", "Software & SaaS", "Travel", "Utilities",
    "Other Income", "Other Expense",
]


@dataclass
class CategorizationResult:
    category: str
    confidence: float
    reasoning: Optional[str] = None


async def categorize_transaction(
    description: str,
    amount: float,
    vendor: Optional[str] = None,
) -> CategorizationResult:
    """Use Claude to categorize a transaction with high accuracy."""

    prompt = f"""You are an expert bookkeeper. Categorize this transaction into exactly one of the categories below.

Transaction:
- Description: {description}
- Amount: ${abs(amount):.2f} ({'income' if amount > 0 else 'expense'})
- Vendor: {vendor or 'unknown'}

Categories:
{chr(10).join(f"- {c}" for c in CATEGORIES)}

Respond in this exact JSON format:
{{"category": "<exact category name>", "confidence": <0.0-1.0>, "reasoning": "<one sentence>"}}"""

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}],
        )
        import json
        result = json.loads(message.content[0].text)
        return CategorizationResult(
            category=result.get("category", "Other Expense"),
            confidence=float(result.get("confidence", 0.7)),
            reasoning=result.get("reasoning"),
        )
    except Exception:
        # Fallback: rule-based categorization
        return _rule_based_categorize(description, amount, vendor)


def _rule_based_categorize(
    description: str, amount: float, vendor: Optional[str]
) -> CategorizationResult:
    desc = (description + " " + (vendor or "")).lower()

    rules = [
        (["payroll", "gusto", "adp", "salary", "w-2"], "Payroll"),
        (["aws", "azure", "google cloud", "heroku", "vercel", "figma", "github", "stripe", "slack", "zoom"], "Software & SaaS"),
        (["rent", "lease", "office"], "Rent"),
        (["insurance", "allstate", "travelers", "liberty mutual"], "Insurance"),
        (["restaurant", "cafe", "food", "dining", "lunch", "dinner"], "Business Meals"),
        (["hotel", "airline", "flight", "uber", "lyft", "travel"], "Travel"),
        (["attorney", "legal", "accountant", "cpa", "consulting"], "Legal & Professional"),
        (["office depot", "staples", "office supplies", "paper", "printer"], "Office Supplies"),
        (["google ads", "facebook ads", "marketing", "advertising"], "Advertising & Marketing"),
    ]

    for keywords, category in rules:
        if any(kw in desc for kw in keywords):
            return CategorizationResult(category=category, confidence=0.8)

    if amount > 0:
        return CategorizationResult(category="Sales Revenue", confidence=0.6)
    return CategorizationResult(category="Other Expense", confidence=0.5)
