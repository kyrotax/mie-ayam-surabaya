"""
Local Fallback Rule-Based Dictionary & Alias Parser untuk Rekapitulasi Buku Catatan.
Digunakan saat Gemini API key tidak diset, timeout, error, atau terkena rate limit (429).
Menjamin sistem tetap berfungsi 100% secara lokal menggunakan hasil Custom OCR.
"""

from typing import Any, Dict, List, Optional
from app.core.catalog import get_menu_catalog
from app.matching.matcher import match_items
from app.matching.normalize import normalize_payment_method
from app.pipeline.confidence import needs_manual_review

# Katalog legacy dictionary diekspor dari Single Source of Truth (8 menu resmi)
MENU_CATALOG = get_menu_catalog()


def _format_rupiah_summary(grand_total: int, total_tunai: int, total_qris: int, item_count: int) -> str:
    if item_count == 0:
        return "Tidak ada catatan transaksi yang terbaca jelas. Silakan tinjau manual atau foto ulang."
    if grand_total <= 0:
        return f"Terbaca {item_count} baris catatan, namun memerlukan verifikasi menu/harga secara manual."
    dominant_payment = "QRIS" if total_qris > total_tunai else "Tunai"
    return (
        f"Total penjualan buku catatan Rp{grand_total:,}. "
        f"Tunai: Rp{total_tunai:,}, QRIS: Rp{total_qris:,} "
        f"(mayoritas transaksi via {dominant_payment})."
    ).replace(",", ".")


def parse_recap_locally(
    recognized_rows: List[Dict[str, Any] | str],
    tanggal: str = "2026-11-19",
    default_payment: str = "Tunai",
    raw_text: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Mengubah list baris hasil Custom OCR menjadi format Structured JSON sesuai Capstone API Contract.
    Tidak pernah mengarang baris fiktif bila recognized_rows kosong.
    """
    clean_default_pay = normalize_payment_method(default_payment, default="Tunai")
    matched_rows = match_items(recognized_rows, default_payment=clean_default_pay)

    items: List[Dict[str, Any]] = []
    total_tunai = 0
    total_qris = 0

    for row in matched_rows:
        metode_bayar = normalize_payment_method(row.get("metode_bayar"), default=clean_default_pay)
        subtotal = int(row.get("subtotal", 0))
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
                "qty": int(row["qty"]),
                "harga_satuan": int(row["harga_satuan"]),
                "subtotal": subtotal,
                "metode_bayar": metode_bayar,
                "matched": bool(row["matched"]),
            }
        )

    grand_total = total_tunai + total_qris
    perlu_tinjauan = needs_manual_review(items)
    combined_raw_text = (
        raw_text
        if raw_text is not None
        else "\n".join(item["teks_mentah_ocr"] for item in items if item["teks_mentah_ocr"])
    )

    return {
        "status": "success",
        "engine_used": "custom_ocr_local_fallback",
        "tanggal_catatan": tanggal,
        "raw_text": combined_raw_text,
        "items": items,
        "total_tunai": total_tunai,
        "total_qris": total_qris,
        "grand_total": grand_total,
        "ringkasan_harian": _format_rupiah_summary(grand_total, total_tunai, total_qris, len(items)),
        "perlu_tinjauan_manual": perlu_tinjauan,
    }
