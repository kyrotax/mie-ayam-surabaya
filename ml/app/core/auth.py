"""Verifikasi API Key untuk komunikasi internal antar-layanan."""

from typing import Optional
from fastapi import Header, HTTPException, status
from app.core.config import settings


async def verify_api_key(x_api_key: Optional[str] = Header(default=None)):
    """Memvalidasi header x-api-key bila proteksi API Key diaktifkan."""
    if not settings.is_api_key_enforced():
        if x_api_key is not None and x_api_key != settings.API_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API Key",
            )
        return

    if not x_api_key or x_api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
