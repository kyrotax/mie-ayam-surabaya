"""Stage 1 ekstraksi teks mentah menggunakan Custom OCR lokal (tanpa Gemini Vision)."""

from typing import Any, Dict
from app.ocr.ocr_service import get_ocr_service


def run_vision_extraction(image_bytes: bytes) -> Dict[str, Any]:
    """
    Menjalankan Stage 1 ekstraksi nota kolom kiri dengan model Custom OCR lokal.
    """
    ocr = get_ocr_service()
    return ocr.extract_raw_rows(image_bytes)
