"""Kalkulasi confidence score dan penentuan status tinjauan manual."""

from typing import Any, Dict, List


def calculate_confidence(items: List[Dict[str, Any]]) -> float:
    """Menghitung rata-rata confidence seluruh item yang diekstrak."""
    if not items:
        return 0.0

    scores = []
    for item in items:
        val = item.get("ocr_confidence", item.get("confidence", 0.0))
        try:
            scores.append(max(0.0, min(1.0, float(val))))
        except (TypeError, ValueError):
            scores.append(0.0)

    return round(sum(scores) / len(scores), 2) if scores else 0.0


def needs_manual_review(items: List[Dict[str, Any]], min_confidence: float = 0.80) -> bool:
    """Mengembalikan True bila nota kosong, ada item tidak cocok, atau confidence rendah."""
    if not items:
        return True

    for item in items:
        if item.get("matched") is False:
            return True
        if item.get("menu_code") is None and "Tak Dikenal" in str(item.get("nama_menu", "")):
            return True
        conf = float(item.get("ocr_confidence", item.get("confidence", 0.0)))
        if conf < min_confidence:
            return True

    return False
