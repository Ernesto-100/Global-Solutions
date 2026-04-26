"""QuickBooks and CSV import processing."""

import csv
import io
from datetime import datetime
from typing import List, Dict
from sqlalchemy.orm import Session
from models.transaction import Transaction


async def process_quickbooks_export(
    content: bytes,
    filename: str,
    org_id: str,
    db: Session,
) -> dict:
    """Process a QuickBooks export file (.qbo, .iif, .csv)."""
    text = content.decode("utf-8-sig", errors="replace")

    if filename.endswith(".csv"):
        return await _process_qb_csv(text, org_id, db)
    elif filename.endswith(".iif"):
        return await _process_qb_iif(text, org_id, db)
    else:
        return await _process_qb_csv(text, org_id, db)


async def _process_qb_csv(text: str, org_id: str, db: Session) -> dict:
    reader = csv.DictReader(io.StringIO(text))
    imported = 0
    errors = []

    for i, row in enumerate(reader):
        try:
            # Flexible column name detection
            date_val = _find_value(row, ["Date", "date", "Transaction Date"])
            desc_val = _find_value(row, ["Description", "Memo", "Name", "description"])
            amount_val = _find_value(row, ["Amount", "amount", "Debit", "Credit"])

            if not date_val or not amount_val:
                continue

            # Parse date
            date = _parse_date(date_val)
            amount = _parse_amount(amount_val)

            # Deduplicate: skip if transaction with same external_id exists
            external_id = f"qb-csv-{i}-{date_val}-{amount_val}"
            existing = db.query(Transaction).filter(
                Transaction.organization_id == org_id,
                Transaction.external_id == external_id,
            ).first()
            if existing:
                continue

            tx = Transaction(
                organization_id=org_id,
                date=date,
                description=desc_val or "Imported transaction",
                amount=amount,
                imported_from="quickbooks",
                external_id=external_id,
            )
            db.add(tx)
            imported += 1

        except Exception as e:
            errors.append(f"Row {i + 1}: {str(e)}")

    db.commit()
    return {"imported": imported, "errors": errors}


async def _process_qb_iif(text: str, org_id: str, db: Session) -> dict:
    """Process QuickBooks IIF format."""
    imported = 0
    lines = text.split("\n")

    for line in lines:
        if not line.startswith("TRNS"):
            continue
        parts = line.split("\t")
        try:
            if len(parts) < 5:
                continue
            tx = Transaction(
                organization_id=org_id,
                date=_parse_date(parts[2]) if len(parts) > 2 else datetime.utcnow(),
                description=parts[4] if len(parts) > 4 else "Imported",
                amount=float(parts[5]) if len(parts) > 5 else 0,
                imported_from="quickbooks_iif",
            )
            db.add(tx)
            imported += 1
        except Exception:
            pass

    db.commit()
    return {"imported": imported}


async def process_csv_import(
    rows: List[Dict],
    date_col: str,
    desc_col: str,
    amount_col: str,
    org_id: str,
    db: Session,
) -> dict:
    imported = 0
    for row in rows:
        try:
            date = _parse_date(row.get(date_col, ""))
            amount = _parse_amount(row.get(amount_col, "0"))
            desc = row.get(desc_col, "Imported transaction")

            tx = Transaction(
                organization_id=org_id,
                date=date,
                description=desc,
                amount=amount,
                imported_from="csv",
            )
            db.add(tx)
            imported += 1
        except Exception:
            pass

    db.commit()
    return {"imported": imported}


def _find_value(row: dict, keys: list) -> str:
    for key in keys:
        if key in row and row[key]:
            return str(row[key]).strip()
    return ""


def _parse_date(val: str) -> datetime:
    formats = ["%m/%d/%Y", "%Y-%m-%d", "%d/%m/%Y", "%m-%d-%Y", "%Y/%m/%d"]
    val = val.strip()
    for fmt in formats:
        try:
            return datetime.strptime(val, fmt)
        except ValueError:
            pass
    return datetime.utcnow()


def _parse_amount(val: str) -> float:
    val = val.strip().replace(",", "").replace("$", "").replace("(", "-").replace(")", "")
    return float(val) if val else 0.0
