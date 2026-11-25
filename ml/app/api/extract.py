"""Endpoint modular Stage 1: ekstraksi teks mentah nota via Custom OCR lokal."""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.core.auth import verify_api_key
from app.pipeline.vision_extract import run_vision_extraction
from app.schemas.order import ExtractResponse

router = APIRouter()


@router.post("", response_model=ExtractResponse, dependencies=[Depends(verify_api_key)])
async def extract_order(file: UploadFile = File(...)):
    """
    Menerima foto nota, melakukan preprocessing OpenCV kolom kiri,
    dan mengekstrak teks mentah menggunakan model Custom OCR lokal.
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File gambar kosong.",
        )

    result = run_vision_extraction(image_bytes)
    if not result.get("valid_image", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format gambar tidak valid atau gagal didekode.",
        )

    return ExtractResponse(
        status="success",
        raw_text=result["raw_text"],
        items=result["items"],
        overall_confidence=result["overall_confidence"],
        perlu_tinjauan_manual=result["perlu_tinjauan_manual"],
    )
