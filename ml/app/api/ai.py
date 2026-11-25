"""Router AI Capstone (/api/v1/ai/*): OCR Recap Orchestrator & Chatbot Intent/RAG Stub."""

from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.classifier.intent_service import get_intent_classifier
from app.core.auth import verify_api_key
from app.core.catalog import get_official_menu_specs
from app.pipeline.postprocess import postprocess_extraction
from app.pipeline.vision_extract import run_vision_extraction
from app.schemas.order import ChatRequest, ChatResponse, OcrRecapResponse

router = APIRouter()

_GREETING_KEYWORDS = ("halo", "hai", "pagi", "siang", "sore", "malam", "assalamualaikum", "terima kasih", "makasih")
_DOMAIN_KEYWORDS = (
    "mie", "ayam", "pangsit", "bakso", "komplit", "teh", "teler", "mineral", "aqua",
    "ma", "mp", "mb", "mk", "map", "mab", "mak", "menu", "porsi", "pesen", "pesan",
    "order", "buka", "tutup", "libur", "jam", "lokasi", "alamat", "warung", "toko",
    "gofood", "gojek", "grab", "wa", "whatsapp", "halal", "kuah", "sambal", "keluhan",
)
_OOT_KEYWORDS = (
    "saham", "crypto", "bitcoin", "politik", "presiden", "pemilu", "cuaca",
    "hujan", "mendung", "bola", "sepak bola", "film", "resep rahasia", "coding",
    "python", "matematika", "pr sekolah", "dollar", "kurs", "emas",
)


def _is_out_of_topic(message: str) -> bool:
    """Mendeteksi pertanyaan di luar konteks bisnis Mie Ayam Surabaya (anti-OOT guardrail)."""
    lower_msg = message.lower()
    has_oot = any(kw in lower_msg for kw in _OOT_KEYWORDS)
    has_domain = any(kw in lower_msg for kw in _DOMAIN_KEYWORDS)
    return has_oot and not has_domain


def _format_menu_list_reply() -> str:
    specs = get_official_menu_specs()
    lines = [f"- {item.name} ({item.code}): Rp{item.price:,}".replace(",", ".") for item in specs]
    return "\n".join(lines)


def _build_chat_reply(intent: str, message: str) -> tuple[str, bool, list[str]]:
    """
    Menghasilkan balasan chatbot terstruktur sementara (RAG stub) berdasarkan intent terprediksi.
    """
    lower_msg = message.lower()

    if intent == "keluhan":
        return (
            "Mohon maaf atas ketidaknyamanannya, Kak. Keluhan Kakak sudah kami catat dan segera "
            "kami teruskan langsung ke pemilik Mie Ayam Surabaya agar cepat ditindaklanjuti.",
            True,
            ["escalation_policy.md"],
        )

    if intent == "pemesanan":
        return (
            "Halo Kak! Untuk pemesanan Mie Ayam Surabaya, Kakak bisa kirim format order lewat WhatsApp "
            "(nama, daftar menu & jumlah, serta metode ambil/antar) atau pesan langsung melalui GoFood/Gojek.",
            False,
            ["order_guide.md", "menu_catalog.md"],
        )

    if intent == "tanya_produk":
        if any(kw in lower_msg for kw in ("jam", "buka", "tutup", "libur", "lokasi", "alamat")):
            return (
                "Halo Kak! Mie Ayam Surabaya buka setiap hari pukul 09.00 - 21.00 WIB di "
                "Jl. Raya Taman Pinang Indah, Sidoarjo. Berikut daftar menu resmi kami:\n"
                f"{_format_menu_list_reply()}",
                False,
                ["operational_hours.md", "menu_catalog.md"],
            )
        return (
            "Halo Kak! Berikut daftar menu resmi Mie Ayam Surabaya beserta harganya:\n"
            f"{_format_menu_list_reply()}\nSilakan kabari jika ingin memesan ya Kak!",
            False,
            ["menu_catalog.md"],
        )

    # Intent 'lainnya': bedakan sapaan ramah vs pertanyaan di luar topik (anti-OOT guardrail)
    if any(kw in lower_msg for kw in _GREETING_KEYWORDS) and len(lower_msg.split()) <= 8:
        return (
            "Halo Kak! Selamat datang di Mie Ayam Surabaya. Ada yang bisa dibantu terkait daftar menu, "
            "harga, jam operasional, atau cara pemesanan?",
            False,
            ["greeting_template.md"],
        )

    return (
        "Maaf Kak, asisten ini khusus melayani informasi seputar Mie Ayam Surabaya (daftar menu, harga, "
        "jam operasional, lokasi, dan pemesanan). Jika ada pertanyaan di luar topik tersebut, mohon maaf kami belum bisa membantu.",
        False,
        ["guardrail_policy.md"],
    )


@router.post("/ocr-recap", response_model=OcrRecapResponse, dependencies=[Depends(verify_api_key)])
async def ocr_recap(
    file: UploadFile = File(...),
    tanggal: Optional[str] = Form(default=None),
    metode_bayar: str = Form(default="Tunai"),
):
    """
    Endpoint orchestrator 1x HTTP call untuk Express.js:
    Stage 1 (Custom OCR lokal kolom kiri) -> Stage 2 (Gemini text-only) -> Stage 3 (Rule fallback lokal).
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File gambar catatan kosong.",
        )

    extraction = run_vision_extraction(image_bytes)
    if not extraction.get("valid_image", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format gambar tidak valid atau gagal didekode.",
        )

    recap_date = (tanggal or "").strip() or date.today().isoformat()
    result = postprocess_extraction(
        extracted_items=extraction["items"],
        raw_text=extraction["raw_text"],
        tanggal=recap_date,
        default_payment=metode_bayar,
    )
    return OcrRecapResponse(**result)


@router.post("/chat", response_model=ChatResponse, dependencies=[Depends(verify_api_key)])
async def ai_chat(payload: ChatRequest):
    """
    Mengklasifikasikan intent pesan pelanggan dan mengembalikan respon chatbot terstruktur
    (dengan flag eskalasi otomatis bila intent = keluhan).
    """
    message = payload.message.strip()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pesan tidak boleh kosong.",
        )

    clf = get_intent_classifier()
    pred = clf.predict(message)
    intent = pred["intent"]
    confidence = float(pred["confidence"])

    if intent != "keluhan" and _is_out_of_topic(message):
        intent = "lainnya"

    reply, escalate, sources = _build_chat_reply(intent, message)

    return ChatResponse(
        status="success",
        predicted_intent=intent,
        confidence=confidence,
        reply=reply,
        escalate_to_owner=escalate,
        sources=sources,
    )
