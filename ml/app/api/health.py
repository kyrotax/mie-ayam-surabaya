"""Endpoint health check untuk layanan ML/AI."""

from fastapi import APIRouter
from app.core.catalog import get_official_menu_specs
from app.core.config import settings
from app.classifier.intent_service import get_intent_classifier
from app.ocr.ocr_service import get_ocr_service

router = APIRouter()


@router.get("")
async def health_check():
    """Mengembalikan status kesehatan service serta kesiapan model lokal."""
    ocr_ready = False
    intent_ready = False

    try:
        get_ocr_service()
        ocr_ready = True
    except Exception:
        ocr_ready = False

    try:
        get_intent_classifier()
        intent_ready = True
    except Exception:
        intent_ready = False

    return {
        "status": "healthy" if (ocr_ready and intent_ready) else "degraded",
        "model_name": settings.MODEL_NAME,
        "gemini_configured": bool(settings.get_gemini_api_key()),
        "models": {
            "ocr_ready": ocr_ready,
            "intent_ready": intent_ready,
        },
        "catalog_count": len(get_official_menu_specs()),
    }
