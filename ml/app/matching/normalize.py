"""Standarisasi teks, parsing kuantitas, dan pembersihan artefak nota kolom kanan."""

import re
from typing import Optional, Tuple

_NOISE_PATTERN = re.compile(r"[|{}\[\]()=]+")
_MULTI_SPACE_PATTERN = re.compile(r"\s+")

_OCR_TOKEN_FIXES = (
    (re.compile(r"\bma\s+p\b"), "mp"),
    (re.compile(r"\bma\s+b\b"), "mb"),
    (re.compile(r"\bma\s+k\b"), "mk"),
    (re.compile(r"\bteh\s+anget\b"), "teh hangat"),
    (re.compile(r"\bairmineral\b"), "air mineral"),
    (re.compile(r"\besteh\b"), "es teh"),
    (re.compile(r"\besteler\b"), "es teler"),
)


def normalize_item_name(text: str) -> str:
    """Membersihkan teks item mentah dan menormalkan variasi penulisan lokal."""
    if not isinstance(text, str):
        return ""

    cleaned = text.lower().strip()
    cleaned = _NOISE_PATTERN.sub(" ", cleaned)
    cleaned = re.sub(r"[-_,.;:]+", " ", cleaned)
    cleaned = _MULTI_SPACE_PATTERN.sub(" ", cleaned).strip()

    for pattern, replacement in _OCR_TOKEN_FIXES:
        cleaned = pattern.sub(replacement, cleaned)

    return _MULTI_SPACE_PATTERN.sub(" ", cleaned).strip()


def normalize_payment_method(raw_pay: Optional[str], default: str = "Tunai") -> str:
    """Menstandarkan label metode pembayaran menjadi 'QRIS' atau 'Tunai'."""
    if not raw_pay:
        return default
    upper = raw_pay.strip().upper()
    if "QR" in upper:
        return "QRIS"
    if "TUNAI" in upper or "CASH" in upper:
        return "Tunai"
    return default


def parse_qty_and_item(raw_line: str, default_payment: str = "Tunai") -> Tuple[int, str, Optional[str], bool]:
    """
    Memisahkan kuantitas, nama/kode menu kolom kiri, dan metode bayar opsional.
    Mengabaikan kurung kurawal '}' serta angka harga di sisi kanan nota.

    Returns:
        (qty, normalized_item, detected_payment_or_none, qty_ambiguous)
    """
    if not isinstance(raw_line, str) or not raw_line.strip():
        return 1, "", None, True

    # Abaikan bagian kanan setelah '}' atau simbol harga jika ada
    left_part = raw_line.split("}", 1)[0]
    cleaned = _NOISE_PATTERN.sub(" ", left_part.lower())
    cleaned = re.sub(r"\brp\.?\s*\d+(?:[.,]\d+)*\b", " ", cleaned)
    cleaned = re.sub(r"\b\d+(?:[.,]\d{3})+\b", " ", cleaned)
    cleaned = re.sub(r"[-_,.;:]+", " ", cleaned)
    cleaned = _MULTI_SPACE_PATTERN.sub(" ", cleaned).strip()

    if not cleaned:
        return 1, "", None, True

    detected_payment: Optional[str] = None
    tokens = cleaned.split()
    filtered_tokens = []
    for tok in tokens:
        if tok in {"qris", "qrs"}:
            detected_payment = "QRIS"
        elif tok in {"tunai", "cash"}:
            detected_payment = "Tunai"
        else:
            filtered_tokens.append(tok)

    if not filtered_tokens:
        return 1, "", detected_payment, True

    qty = 1
    qty_found = False
    qty_ambiguous = False

    # Cek kuantitas di awal baris (format standar kolom kiri: "1 MA", "2x es teh")
    first_match = re.match(r"^(\d+)x?$", filtered_tokens[0])
    if first_match:
        parsed = int(first_match.group(1))
        if 1 <= parsed <= 99:
            qty = parsed
            qty_found = True
        else:
            qty_ambiguous = True
        filtered_tokens = filtered_tokens[1:]
    else:
        joined_prefix = re.match(r"^(\d+)x([a-z]+)$", filtered_tokens[0])
        if joined_prefix:
            qty = max(1, int(joined_prefix.group(1)))
            qty_found = True
            filtered_tokens[0] = joined_prefix.group(2)

    # Buang angka harga yang menempel di sisi kanan (mis. "MB 25", "MA 20", "MK 30000")
    while filtered_tokens and filtered_tokens[-1].isdigit():
        trailing_num = int(filtered_tokens[-1])
        # Bila belum ada qty di depan dan angka kecil (1..9), anggap sebagai qty; selain itu angka harga kanan
        if not qty_found and 1 <= trailing_num <= 9 and len(filtered_tokens) > 1:
            qty = trailing_num
            qty_found = True
        filtered_tokens.pop()

    item_str = normalize_item_name(" ".join(filtered_tokens))
    if not item_str:
        qty_ambiguous = True

    return qty, item_str, detected_payment, qty_ambiguous
