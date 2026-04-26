"""File storage service (AWS S3)."""

import boto3
from config import settings


async def upload_file(content: bytes, filename: str, prefix: str = "") -> str:
    """Upload a file to S3 and return the public URL."""
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        key = f"{prefix}/{filename}" if prefix else filename
        s3.put_object(
            Bucket=settings.AWS_S3_BUCKET,
            Key=key,
            Body=content,
            ContentType=_content_type(filename),
        )
        return f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
    except Exception as e:
        print(f"[Storage] Upload failed: {e}")
        return ""


def _content_type(filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower()
    types = {"pdf": "application/pdf", "png": "image/png", "jpg": "image/jpeg",
             "jpeg": "image/jpeg", "csv": "text/csv"}
    return types.get(ext, "application/octet-stream")
