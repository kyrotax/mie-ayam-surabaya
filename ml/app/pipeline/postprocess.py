"""
Stage 2 & Stage 3 Post-Processing Nota (Gemini Text-Only + Fallback Lokal).
- Stage 2: Mengirim HANYA teks mentah hasil Stage 1 ke Gemini API (gemini-2.5-flash).
- Stage 3: Otomatis fallback ke rule_fallback.py bila key kosong, error, timeout, atau 429.
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.core.catalog import get_menu_catalog, get_prompt_catalog_text
from app.core.config import settings
from app.matching.matcher import match_items
from app.matching.normalize import normalize_payment_method
from app.ocr.rule_fallback import _format_rupiah_summary, parse_recap_locally
from app.pipeline.confidence import needs_manual_review

logger = logging.getLogger(__name__)
_PROMPT_PATH = Path(__file__).resolve().parents[1] / "prompts" / "extract_v1.txt"


def _build_text_only_prompt(raw_text: str, tanggal: str, default_payment: str) -> str:
    """Menyusun prompt text-only berisi teks OCR mentah dan 8 katalog menu resmi."""
    base_instruction = (
        _PROMPT_PATH.read_text(encoding="utf-8").strip()
        if _PROMPT_PATH.exists()
        else "Normalisasi teks nota Mie Ayam Surabaya menjadi JSON terstruktur."
    )
    catalog_text = get_prompt_catalog_text()
    return (
        f"{base_instruction}\n\n"
        f"Tanggal catatan: {tanggal}\n"
        f"Metode bayar default (jika tidak tertulis): {default_payment}\n\n"
        f"Daftar 8 Menu Resmi:\n{catalog_text}\n\n"
        f"Teks Mentah Hasil OCR Kolom Kiri:\n{raw_text}\n"
    )


def _extract_json_payload(raw_response: str) -> Dict[str, Any]:
    """Membersihkan markdown fence dan mem-parse JSON dari output teks Gemini."""
    cleaned = raw_response.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    data = json.loads(cleaned)
    if not isinstance(data, dict) or not isinstance(data.get("items"), list):
        raise ValueError("Format JSON Gemini tidak memuat array 'items'.")
    return data


def _call_gemini_text_only(prompt: str, api_key: str, gemini_client: Any = None) -> str:
    """Memanggil Gemini API text-only (gemini-2.5-flash) tanpa mengirim data gambar."""
    if gemini_client is None:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
        )
        response = client.models.generate_content(
            model=settings.MODEL_NAME,
            contents=prompt,
            config=config,
        )
        return getattr(response, "text", "") or ""

    # Mendukung client ter-inject pada unit test
    response = gemini_client.models.generate_content(
        model=settings.MODEL_NAME,
        contents=prompt,
    )
    return getattr(response, "text", "") if not isinstance(response, str) else response


def postprocess_extraction(
    extracted_items: List[Dict[str, Any]],
    raw_text: str,
    tanggal: str = "2026-11-19",
    default_payment: str = "Tunai",
    gemini_client: Any = None,
) -> Dict[str, Any]:
    """
    Menjalankan Stage 2 (Gemini text-only) dengan fallback otomatis ke Stage 3 (rule_fallback.py).
    Selalu memvalidasi ulang harga & subtotal terhadap katalog resmi di Python.
    """
    clean_default_pay = normalize_payment_method(default_payment, default="Tunai")

    # Jika tidak ada teks terbaca sama sekali, langsung kembalikan status tinjauan manual tanpa membuang token API
    if not extracted_items and not (raw_text or "").strip():
        return parse_recap_locally(
            [],
            tanggal=tanggal,
            default_payment=clean_default_pay,
            raw_text="",
        )

    api_key = settings.get_gemini_api_key()
    if not api_key and gemini_client is None:
        return parse_recap_locally(
            extracted_items,
            tanggal=tanggal,
            default_payment=clean_default_pay,
            raw_text=raw_text,
        )

    try:
        text_for_llm = raw_text.strip() or "\n".join(
            str(it.get("raw_text", "")) for it in extracted_items if it.get("raw_text")
        )
        prompt = _build_text_only_prompt(text_for_llm, tanggal, clean_default_pay)
        llm_raw = _call_gemini_text_only(prompt, api_key or "injected", gemini_client=gemini_client)
        parsed = _extract_json_payload(llm_raw)

        catalog = get_menu_catalog()
        normalized_inputs: List[Dict[str, Any]] = []
        for idx, llm_item in enumerate(parsed["items"]):
            fallback_conf = (
                extracted_items[idx].get("confidence", 0.90)
                if idx < len(extracted_items)
                else 0.90
            )
            candidate_name = (
                llm_item.get("menu_code")
                or llm_item.get("nama_menu")
                or llm_item.get("raw_item")
                or ""
            )
            normalized_inputs.append(
                {
                    "raw_text": llm_item.get("teks_mentah_ocr") or llm_item.get("raw_text") or str(candidate_name),
                    "raw_item": str(candidate_name),
                    "qty": llm_item.get("qty", 1),
                    "confidence": llm_item.get("ocr_confidence", fallback_conf),
                    "metode_bayar": llm_item.get("metode_bayar") or clean_default_pay,
                }
            )

        matched_rows = match_items(normalized_inputs, default_payment=clean_default_pay)
        items: List[Dict[str, Any]] = []
        total_tunai = 0
        total_qris = 0

        for row in matched_rows:
            metode_bayar = normalize_payment_method(row.get("metode_bayar"), default=clean_default_pay)
            harga_resmi = catalog[row["menu_code"]]["price"] if row.get("menu_code") in catalog else 0
            qty = int(row.get("qty", 1))
            subtotal = qty * harga_resmi if row.get("matched") else 0

            if row.get("matched"):
                if metode_bayar == "QRIS":
                    total_qris += subtotal
                else:
                    total_tunai += subtotal

            items.append(
                {
                    "teks_mentah_ocr": row["raw_text"],
                    "ocr_confidence": round(float(row["confidence"]), 2),
                    "menu_code": row["menu_code"],
                    "nama_menu": row["nama_menu"],
                    "qty": qty,
                    "harga_satuan": harga_resmi,
                    "subtotal": subtotal,
                    "metode_bayar": metode_bayar,
                    "matched": bool(row["matched"]),
                }
            )

        grand_total = total_tunai + total_qris
        summary = str(parsed.get("ringkasan_harian") or "").strip() or _format_rupiah_summary(
            grand_total, total_tunai, total_qris, len(items)
        )

        return {
            "status": "success",
            "engine_used": "custom_ocr_plus_gemini",
            "tanggal_catatan": tanggal,
            "raw_text": text_for_llm,
            "items": items,
            "total_tunai": total_tunai,
            "total_qris": total_qris,
            "grand_total": grand_total,
            "ringkasan_harian": summary,
            "perlu_tinjauan_manual": needs_manual_review(items),
        }
    except Exception as exc:
        logger.warning("Gemini text-only gagal (%s), beralih ke local fallback.", exc)
        return parse_recap_locally(
            extracted_items,
            tanggal=tanggal,
            default_payment=clean_default_pay,
            raw_text=raw_text,
        )
