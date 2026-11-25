"""Skema Pydantic untuk endpoint ekstraksi, matching, OCR recap, dan chatbot."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ExtractedLineItem(BaseModel):
    """Satu baris kandidat teks mentah hasil Custom OCR lokal (Stage 1)."""

    raw_text: str
    qty: int = Field(default=1, ge=1)
    raw_item: str
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    metode_bayar: Optional[str] = None
    bbox: Optional[List[int]] = None


class ExtractResponse(BaseModel):
    """Response endpoint POST /extract."""

    status: str = "success"
    raw_text: str = ""
    items: List[ExtractedLineItem] = Field(default_factory=list)
    overall_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    perlu_tinjauan_manual: bool = True


class MatchItemInput(BaseModel):
    """Satu item mentah untuk dicocokkan ke katalog resmi."""

    raw_text: Optional[str] = None
    raw_item: Optional[str] = None
    qty: Optional[int] = Field(default=None, ge=1)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    metode_bayar: Optional[str] = None


class MatchRequest(BaseModel):
    """Request body untuk endpoint POST /match."""

    items: List[MatchItemInput | str] = Field(default_factory=list)


class MatchedItem(BaseModel):
    """Hasil pencocokan satu item terhadap 8 menu resmi."""

    menu_code: Optional[str] = None
    nama_menu: str
    qty: int = Field(default=1, ge=1)
    harga_satuan: int = Field(default=0, ge=0)
    subtotal: int = Field(default=0, ge=0)
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    matched: bool = False
    raw_text: str = ""
    raw_item: str = ""
    metode_bayar: str = "Tunai"


class MatchResponse(BaseModel):
    """Response endpoint POST /match."""

    status: str = "success"
    matched: List[MatchedItem] = Field(default_factory=list)
    unmatched_count: int = 0
    grand_total: int = 0


class OcrRecapItem(BaseModel):
    """Satu baris item pada laporan rekapitulasi nota."""

    teks_mentah_ocr: str
    ocr_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    menu_code: Optional[str] = None
    nama_menu: str
    qty: int = Field(default=1, ge=1)
    harga_satuan: int = Field(default=0, ge=0)
    subtotal: int = Field(default=0, ge=0)
    metode_bayar: str = "Tunai"
    matched: bool = True


class OcrRecapResponse(BaseModel):
    """Response endpoint orchestrator POST /api/v1/ai/ocr-recap."""

    status: str = "success"
    engine_used: str
    tanggal_catatan: str
    raw_text: str = ""
    items: List[OcrRecapItem] = Field(default_factory=list)
    total_tunai: int = 0
    total_qris: int = 0
    grand_total: int = 0
    ringkasan_harian: str = ""
    perlu_tinjauan_manual: bool = False


class ChatRequest(BaseModel):
    """Request body untuk endpoint POST /api/v1/ai/chat."""

    message: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    """Response endpoint POST /api/v1/ai/chat."""

    status: str = "success"
    predicted_intent: str
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    reply: str
    escalate_to_owner: bool = False
    sources: List[str] = Field(default_factory=list)
