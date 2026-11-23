"""
Local Fallback Rule-Based Dictionary Parser untuk Rekapitulasi Buku Catatan.
Digunakan saat Gemini API timeout atau terkena rate limit kuota gratis (429).
Menjamin sistem tetap berfungsi 100% secara lokal menggunakan hasil inferensi Custom OCR.
"""

from typing import List, Dict, Any

MENU_CATALOG = {
    "MA": {"name": "Mie Ayam Original", "price": 20000},
    "MAP": {"name": "Mie Ayam Pangsit", "price": 25000},
    "MAB": {"name": "Mie Ayam Bakso", "price": 25000},
    "MAK": {"name": "Mie Ayam Komplit", "price": 30000},
    "BKS": {"name": "Bakso Sapi Tambahan", "price": 10000},
    "PGR": {"name": "Pangsit Goreng", "price": 10000},
    "ESTEH": {"name": "Es Teh Manis", "price": 5000},
    "TEH": {"name": "Teh Hangat", "price": 5000},
    "TELER": {"name": "Es Teler Istimewa", "price": 15000},
}

def parse_recap_locally(recognized_rows: List[Dict[str, Any]], tanggal: str = "2026-11-19") -> Dict[str, Any]:
    """
    Mengubah list baris hasil Custom OCR menjadi format Structured JSON sesuai Capstone API Contract.
    Input row contoh: {"menu_token": "MAK", "qty_token": "2", "pay_token": "QRIS", "confidence": 0.98}
    """
    items = []
    total_tunai = 0
    total_qris = 0
    perlu_tinjauan = False

    for row in recognized_rows:
        raw_menu = row.get("menu_token", "MA").upper()
        raw_qty = row.get("qty_token", "1")
        raw_pay = row.get("pay_token", "TUNAI").upper()
        conf = row.get("confidence", 0.90)

        # Mapping menu
        catalog_info = MENU_CATALOG.get(raw_menu, {"name": f"Menu Tak Dikenal ({raw_menu})", "price": 20000})
        nama_menu = catalog_info["name"]
        harga_satuan = catalog_info["price"]

        # Parse quantity
        try:
            qty = int(raw_qty)
        except ValueError:
            qty = 1
            perlu_tinjauan = True

        # Parse payment method
        metode_bayar = "QRIS" if "QR" in raw_pay else "Tunai"

        subtotal = qty * harga_satuan
        if metode_bayar == "QRIS":
            total_qris += subtotal
        else:
            total_tunai += subtotal

        if conf < 0.80 or "Tak Dikenal" in nama_menu:
            perlu_tinjauan = True

        teks_mentah = f"{raw_menu} | {qty} | {metode_bayar}"
        items.append({
            "teks_mentah_ocr": teks_mentah,
            "ocr_confidence": round(float(conf), 2),
            "nama_menu": nama_menu,
            "qty": qty,
            "harga_satuan": harga_satuan,
            "subtotal": subtotal,
            "metode_bayar": metode_bayar
        })

    grand_total = total_tunai + total_qris
    
    # Ringkasan harian
    if grand_total > 0:
        dominant_payment = "QRIS" if total_qris > total_tunai else "Tunai"
        ringkasan = (
            f"Total penjualan buku catatan Rp{grand_total:,}. "
            f"Tunai: Rp{total_tunai:,}, QRIS: Rp{total_qris:,} "
            f"(mayoritas transaksi via {dominant_payment})."
        ).replace(",", ".")
    else:
        ringkasan = "Tidak ada catatan transaksi terbaca."

    return {
        "status": "success",
        "engine_used": "custom_ocr_local_fallback",
        "tanggal_catatan": tanggal,
        "items": items,
        "total_tunai": total_tunai,
        "total_qris": total_qris,
        "grand_total": grand_total,
        "ringkasan_harian": ringkasan,
        "perlu_tinjauan_manual": perlu_tinjauan
    }

if __name__ == "__main__":
    sample_rows = [
        {"menu_token": "MAK", "qty_token": "3", "pay_token": "QRIS", "confidence": 0.96},
        {"menu_token": "MA", "qty_token": "2", "pay_token": "TUNAI", "confidence": 0.98},
        {"menu_token": "ESTEH", "qty_token": "4", "pay_token": "QRIS", "confidence": 0.92},
        {"menu_token": "PGR", "qty_token": "1", "pay_token": "TUNAI", "confidence": 0.88},
    ]
    res = parse_recap_locally(sample_rows)
    import json
    print(json.dumps(res, indent=2, ensure_ascii=False))
