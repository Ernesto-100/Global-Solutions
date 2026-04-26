"""QuickBooks / CSV / Wave import routes."""

import io
import csv
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from database import get_db
from models.transaction import Transaction
from models.user import User
from middleware.auth import get_current_user
from services.import_processor import process_quickbooks_export, process_csv_import

router = APIRouter()


@router.post("/quickbooks")
async def import_quickbooks(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.endswith((".qbo", ".iif", ".csv")):
        raise HTTPException(400, "Unsupported file format. Use .qbo, .iif, or .csv")

    content = await file.read()

    # Validate file size (50MB max)
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(400, "File too large. Maximum 50MB.")

    # Run import in background
    background_tasks.add_task(
        process_quickbooks_export,
        content,
        file.filename,
        str(current_user.organization_id),
        db,
    )

    return {
        "message": "Import started. You'll be notified when complete.",
        "filename": file.filename,
        "size_bytes": len(content),
    }


@router.post("/csv")
async def import_csv(
    file: UploadFile = File(...),
    date_column: str = "date",
    description_column: str = "description",
    amount_column: str = "amount",
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "File must be a .csv file")

    content = await file.read()
    text = content.decode("utf-8-sig")

    # Preview: count rows
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)

    if len(rows) == 0:
        raise HTTPException(400, "CSV file appears to be empty.")

    background_tasks.add_task(
        process_csv_import,
        rows,
        date_column,
        description_column,
        amount_column,
        str(current_user.organization_id),
        db,
    )

    return {
        "message": f"Importing {len(rows)} transactions in the background.",
        "row_count": len(rows),
    }


@router.get("/status")
async def import_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Return count of transactions imported this session
    count = db.query(Transaction).filter(
        Transaction.organization_id == current_user.organization_id,
        Transaction.imported_from.isnot(None),
    ).count()
    return {"imported_transactions": count}
