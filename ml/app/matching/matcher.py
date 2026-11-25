"""Fuzzy dan alias matcher terhadap 8 menu resmi Mie Ayam Surabaya."""

from difflib import SequenceMatcher
from typing import Any, Dict, List, Optional, Tuple
from app.core.catalog import (
    MenuSpec,
    get_alias_index,
    get_official_menu_specs,
    lookup_menu_by_code_or_name,
)
from app.matching.normalize import (
    normalize_item_name,
    normalize_payment_method,
    parse_qty_and_item,
)

# Item lama yang dihapus dan wajib ditolak agar tidak cocok secara fuzzy
_DISCONTINUED_TOKENS = {"bks", "pgr", "bakso sapi tambahan", "pangsit goreng"}


def _fuzzy_match_menu(
    normalized_item: str,
    specs: Tuple[MenuSpec, ...],
    min_ratio: float = 0.78,
) -> Optional[Tuple[MenuSpec, float]]:
    """Mencari kecocokan alias terdekat jika exact lookup gagal."""
    if not normalized_item or normalized_item in _DISCONTINUED_TOKENS:
        return None

    best_spec: Optional[MenuSpec] = None
    best_ratio = 0.0

    for spec in specs:
        candidates = (spec.code.lower(), spec.name.lower(), *spec.aliases)
        for cand in candidates:
            # Hindari singkatan 2-3 huruf dicocokkan sembarangan oleh fuzzy ratio
            if len(cand) <= 3 and len(normalized_item) <= 3 and cand != normalized_item:
                continue
            ratio = SequenceMatcher(None, normalized_item, cand).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_spec = spec

    if best_spec is not None and best_ratio >= min_ratio:
        return best_spec, best_ratio
    return None


def _coerce_input_item(item: Any, default_payment: str = "Tunai") -> Dict[str, Any]:
    """Menyamakan format input dari string, dict, maupun Pydantic model."""
    if isinstance(item, str):
        qty, norm_item, pay, _ = parse_qty_and_item(item, default_payment=default_payment)
        return {
            "raw_text": item,
            "raw_item": norm_item,
            "qty": qty,
            "confidence": 1.0,
            "metode_bayar": pay or default_payment,
        }

    if hasattr(item, "model_dump"):
        data = item.model_dump()
    elif isinstance(item, dict):
        data = dict(item)
    else:
        data = {"raw_text": str(item)}

    raw_text = data.get("raw_text") or data.get("teks_mentah_ocr") or ""
    raw_item = data.get("raw_item") or data.get("menu_token") or data.get("name") or ""
    qty = data.get("qty") or data.get("qty_token")
    pay = data.get("metode_bayar") or data.get("pay_token")
    conf = float(data.get("confidence", data.get("ocr_confidence", 1.0)))

    if raw_text and not raw_item:
        parsed_qty, parsed_item, parsed_pay, _ = parse_qty_and_item(
            raw_text, default_payment=default_payment
        )
        raw_item = parsed_item
        if qty is None:
            qty = parsed_qty
        if not pay:
            pay = parsed_pay
    elif raw_item:
        raw_item = normalize_item_name(str(raw_item))

    try:
        parsed_qty_int = max(1, int(qty)) if qty is not None else 1
    except (TypeError, ValueError):
        parsed_qty_int = 1

    return {
        "raw_text": raw_text or f"{parsed_qty_int} {raw_item}".strip(),
        "raw_item": raw_item,
        "qty": parsed_qty_int,
        "confidence": max(0.0, min(1.0, conf)),
        "metode_bayar": normalize_payment_method(pay, default=default_payment),
    }


def match_items(
    extracted_items: list,
    menu_catalog: Optional[Any] = None,
    default_payment: str = "Tunai",
) -> List[Dict[str, Any]]:
    """
    Memetakan daftar item hasil ekstraksi terhadap 8 menu resmi & aliasnya.

    Args:
        extracted_items: List string, dict, atau MatchItemInput.
        menu_catalog: Opsional override daftar MenuSpec (default memakai katalog resmi terpusat).
        default_payment: Metode bayar default bila nota tidak menuliskan Tunai/QRIS.
    """
    specs = tuple(menu_catalog) if isinstance(menu_catalog, (list, tuple)) else get_official_menu_specs()
    alias_map = get_alias_index() if menu_catalog is None else {
        alias.lower(): spec
        for spec in specs
        for alias in (spec.code, spec.name, *spec.aliases)
    }

    matched_results: List[Dict[str, Any]] = []
    for raw in extracted_items:
        item = _coerce_input_item(raw, default_payment=default_payment)
        norm_item = normalize_item_name(item["raw_item"])
        qty = item["qty"]
        base_conf = item["confidence"]

        if norm_item in _DISCONTINUED_TOKENS:
            spec = None
            match_score = 0.0
        else:
            spec = alias_map.get(norm_item) if menu_catalog is not None else lookup_menu_by_code_or_name(norm_item)
            match_score = 1.0 if spec is not None else 0.0
            if spec is None:
                fuzzy = _fuzzy_match_menu(norm_item, specs)
                if fuzzy is not None:
                    spec, match_score = fuzzy

        if spec is not None:
            combined_conf = round(min(base_conf, match_score), 2)
            matched_results.append(
                {
                    "menu_code": spec.code,
                    "nama_menu": spec.name,
                    "qty": qty,
                    "harga_satuan": spec.price,
                    "subtotal": qty * spec.price,
                    "confidence": combined_conf,
                    "matched": True,
                    "raw_text": item["raw_text"],
                    "raw_item": item["raw_item"],
                    "metode_bayar": item["metode_bayar"],
                }
            )
        else:
            label = item["raw_item"] or item["raw_text"] or "kosong"
            matched_results.append(
                {
                    "menu_code": None,
                    "nama_menu": f"Menu Tak Dikenal ({label})",
                    "qty": qty,
                    "harga_satuan": 0,
                    "subtotal": 0,
                    "confidence": round(min(base_conf, 0.4), 2),
                    "matched": False,
                    "raw_text": item["raw_text"],
                    "raw_item": item["raw_item"],
                    "metode_bayar": item["metode_bayar"],
                }
            )

    return matched_results
