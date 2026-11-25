"""Unit & Integration tests untuk layanan FastAPI ML/AI Mie Ayam Surabaya."""

import io
import json
import sys
from pathlib import Path
from types import SimpleNamespace

import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient

# Pastikan folder ml/ berada di sys.path agar import 'app.*' berjalan dari root maupun ml/
ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

from app.core.config import settings
from app.main import app
from app.pipeline.preprocess import segment_left_column_rows


@pytest.fixture(autouse=True)
def reset_settings_and_env(monkeypatch):
    """Memastikan setiap test dimulai dengan konfigurasi bersih tanpa key Gemini asli."""
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("VISION_API_KEY", raising=False)
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)
    monkeypatch.setattr(settings, "VISION_API_KEY", None)
    monkeypatch.setattr(settings, "REQUIRE_API_KEY", False)
    monkeypatch.setattr(settings, "API_KEY", "changeme")
    monkeypatch.setattr(settings, "AIR_MINERAL_PRICE", 5000)


client = TestClient(app)


def _encode_png(img: np.ndarray) -> bytes:
    ok, buf = cv2.imencode(".png", img)
    assert ok
    return buf.tobytes()


def _make_blank_image_bytes(w: int = 320, h: int = 240) -> bytes:
    img = np.full((h, w, 3), 255, dtype=np.uint8)
    return _encode_png(img)


def _make_sample_note_with_right_prices() -> bytes:
    """
    Membuat gambar nota sintetis bergaya:
    Baris 1: '1 MA'   |  '}'  | '45'
    Baris 2: '1 MP'   |  '}'
    Baris 3: '1 MB'   |       | '25'
    """
    img = np.full((260, 420, 3), 255, dtype=np.uint8)
    font = cv2.FONT_HERSHEY_SIMPLEX

    # Garis buku horizontal tipis (harus dibersihkan preprocessing)
    for y_line in (70, 130, 190):
        cv2.line(img, (10, y_line), (410, y_line), (210, 210, 230), 1)

    # Kolom kiri (qty + kode menu)
    cv2.putText(img, "1 MA", (25, 55), font, 1.0, (20, 20, 20), 2)
    cv2.putText(img, "1 MP", (25, 115), font, 1.0, (20, 20, 20), 2)
    cv2.putText(img, "1 MB", (25, 175), font, 1.0, (20, 20, 20), 2)

    # Kurung kurawal '}' tinggi di tengah/kanan merangkum baris 1-2
    pts = np.array([[220, 30], [235, 50], [235, 70], [248, 78], [235, 86], [235, 108], [220, 125]], np.int32)
    cv2.polylines(img, [pts], False, (20, 20, 20), 2)

    # Angka harga di kolom kanan
    cv2.putText(img, "45", (285, 88), font, 1.0, (20, 20, 20), 2)
    cv2.putText(img, "25", (285, 175), font, 1.0, (20, 20, 20), 2)

    return _encode_png(img)


# ---------------------------------------------------------------------------
# 1. Health & Auth
# ---------------------------------------------------------------------------

def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "healthy"
    assert body["model_name"] == "gemini-2.5-flash"
    assert body["catalog_count"] == 8
    assert body["models"]["ocr_ready"] is True
    assert body["models"]["intent_ready"] is True


def test_api_key_enforcement(monkeypatch):
    monkeypatch.setattr(settings, "REQUIRE_API_KEY", True)
    monkeypatch.setattr(settings, "API_KEY", "rahasia-capstone")

    # /health tetap publik
    assert client.get("/health").status_code == 200

    # /match tanpa key -> 401
    res_missing = client.post("/match", json={"items": ["1 MA"]})
    assert res_missing.status_code == 401

    # /match dengan key salah -> 401
    res_wrong = client.post(
        "/match",
        headers={"x-api-key": "salah"},
        json={"items": ["1 MA"]},
    )
    assert res_wrong.status_code == 401

    # /match dengan key benar -> 200
    res_ok = client.post(
        "/match",
        headers={"x-api-key": "rahasia-capstone"},
        json={"items": ["1 MA"]},
    )
    assert res_ok.status_code == 200


# ---------------------------------------------------------------------------
# 2. Matching 8 Menu Resmi, Alias, & Penghapusan BKS/PGR
# ---------------------------------------------------------------------------

def test_match_all_8_official_menus_and_aliases():
    payload = {
        "items": [
            "1 MA",
            "1 MP",
            "1 MAP",
            "1 MB",
            "1 MAB",
            "1 MK",
            "1 MAK",
            "2 es teh",
            "1 teh hangat",
            "1 es teler",
            "2 air mineral",
        ]
    }
    res = client.post("/match", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["unmatched_count"] == 0
    codes = [item["menu_code"] for item in data["matched"]]
    assert codes == ["MA", "MP", "MP", "MB", "MB", "MK", "MK", "es teh", "teh hangat", "es teler", "air mineral"]

    prices = [item["harga_satuan"] for item in data["matched"]]
    assert prices == [20000, 25000, 25000, 25000, 25000, 30000, 30000, 5000, 5000, 20000, 5000]
    assert data["grand_total"] == 225000


def test_match_ignores_right_column_braces_and_prices():
    payload = {"items": ["1 MA } 45", "1 MB 25", "2 es teh 10000"]}
    res = client.post("/match", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["unmatched_count"] == 0
    assert [(i["menu_code"], i["qty"], i["subtotal"]) for i in data["matched"]] == [
        ("MA", 1, 20000),
        ("MB", 1, 25000),
        ("es teh", 2, 10000),
    ]
    assert data["grand_total"] == 55000


def test_match_rejects_removed_bks_and_pgr():
    res = client.post("/match", json={"items": ["2 BKS", "1 PGR", "1 pangsit goreng"]})
    assert res.status_code == 200
    data = res.json()

    assert data["unmatched_count"] == 3
    assert data["grand_total"] == 0
    assert all(item["matched"] is False for item in data["matched"])


def test_match_air_mineral_price_is_configurable(monkeypatch):
    monkeypatch.setattr(settings, "AIR_MINERAL_PRICE", 6000)
    res = client.post("/match", json={"items": ["2 air mineral"]})
    assert res.status_code == 200
    item = res.json()["matched"][0]
    assert item["menu_code"] == "air mineral"
    assert item["harga_satuan"] == 6000
    assert item["subtotal"] == 12000


# ---------------------------------------------------------------------------
# 3. Preprocessing Kolom Kiri & Endpoint /extract
# ---------------------------------------------------------------------------

def test_segment_left_column_ignores_right_brace_and_prices():
    img_bytes = _make_sample_note_with_right_prices()
    img, rows = segment_left_column_rows(img_bytes)
    assert img is not None
    # Harus terdeteksi tepat 3 baris kolom kiri (baris 1: 1 MA, baris 2: 1 MP, baris 3: 1 MB)
    assert len(rows) == 3
    # Seluruh bounding box baris berada di kolom kiri (< x=220), tidak ikut menangkap 45 / 25
    for row in rows:
        rx, _, rw, _ = row["row_bbox"]
        assert rx + rw < 220


def test_extract_blank_image_returns_empty_no_dummy_fallback():
    blank_bytes = _make_blank_image_bytes()
    res = client.post(
        "/extract",
        files={"file": ("blank.png", io.BytesIO(blank_bytes), "image/png")},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["items"] == []
    assert data["raw_text"] == ""
    assert data["perlu_tinjauan_manual"] is True


def test_extract_rejects_empty_and_corrupt_files():
    res_empty = client.post(
        "/extract",
        files={"file": ("empty.png", io.BytesIO(b""), "image/png")},
    )
    assert res_empty.status_code == 400

    res_corrupt = client.post(
        "/extract",
        files={"file": ("bad.jpg", io.BytesIO(b"not-an-image"), "image/jpeg")},
    )
    assert res_corrupt.status_code == 400


def test_extract_note_image_returns_structured_left_column_rows():
    note_bytes = _make_sample_note_with_right_prices()
    res = client.post(
        "/extract",
        files={"file": ("nota.png", io.BytesIO(note_bytes), "image/png")},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert len(data["items"]) == 3
    assert data["raw_text"] != ""


# ---------------------------------------------------------------------------
# 4. Orchestrator /api/v1/ai/ocr-recap (Fase 1 Fallback & Fase 2 Gemini Text-Only)
# ---------------------------------------------------------------------------

def test_ocr_recap_local_fallback_without_gemini_key(monkeypatch):
    def fake_extract(_image_bytes: bytes):
        return {
            "valid_image": True,
            "raw_text": "1 MA\n1 MP\n1 MB\n1 es teh\n1 air mineral",
            "items": [
                {"raw_text": "1 MA", "qty": 1, "raw_item": "ma", "confidence": 0.94, "metode_bayar": None},
                {"raw_text": "1 MP", "qty": 1, "raw_item": "mp", "confidence": 0.92, "metode_bayar": None},
                {"raw_text": "1 MB", "qty": 1, "raw_item": "mb", "confidence": 0.91, "metode_bayar": None},
                {"raw_text": "1 es teh", "qty": 1, "raw_item": "es teh", "confidence": 0.95, "metode_bayar": None},
                {"raw_text": "1 air mineral", "qty": 1, "raw_item": "air mineral", "confidence": 0.90, "metode_bayar": None},
            ],
            "overall_confidence": 0.92,
            "perlu_tinjauan_manual": False,
        }

    monkeypatch.setattr("app.api.ai.run_vision_extraction", fake_extract)
    note_bytes = _make_sample_note_with_right_prices()

    res = client.post(
        "/api/v1/ai/ocr-recap",
        files={"file": ("nota.png", io.BytesIO(note_bytes), "image/png")},
        data={"tanggal": "2026-11-25", "metode_bayar": "Tunai"},
    )
    assert res.status_code == 200
    data = res.json()

    assert data["engine_used"] == "custom_ocr_local_fallback"
    assert data["tanggal_catatan"] == "2026-11-25"
    assert [i["menu_code"] for i in data["items"]] == ["MA", "MP", "MB", "es teh", "air mineral"]
    assert data["total_tunai"] == 80000
    assert data["total_qris"] == 0
    assert data["grand_total"] == 80000
    assert data["perlu_tinjauan_manual"] is False


def test_ocr_recap_blank_image_never_invents_dummy_items():
    blank_bytes = _make_blank_image_bytes()
    res = client.post(
        "/api/v1/ai/ocr-recap",
        files={"file": ("blank.png", io.BytesIO(blank_bytes), "image/png")},
        data={"tanggal": "2026-11-25"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["items"] == []
    assert data["grand_total"] == 0
    assert data["perlu_tinjauan_manual"] is True


def test_ocr_recap_gemini_text_only_mock_and_price_enforcement(monkeypatch):
    def fake_extract(_image_bytes: bytes):
        return {
            "valid_image": True,
            "raw_text": "1 MA\n1 MP\n1 MB",
            "items": [
                {"raw_text": "1 MA", "qty": 1, "raw_item": "ma", "confidence": 0.93},
                {"raw_text": "1 MP", "qty": 1, "raw_item": "mp", "confidence": 0.91},
                {"raw_text": "1 MB", "qty": 1, "raw_item": "mb", "confidence": 0.90},
            ],
            "overall_confidence": 0.91,
            "perlu_tinjauan_manual": False,
        }

    captured_prompts = []

    def fake_call_gemini(prompt: str, api_key: str, gemini_client=None) -> str:
        assert isinstance(prompt, str)
        assert "1 MA" in prompt and "1 MP" in prompt and "1 MB" in prompt
        assert api_key == "fake-gemini-key"
        captured_prompts.append(prompt)
        return json.dumps(
            {
                "items": [
                    {"teks_mentah_ocr": "1 MA", "menu_code": "MA", "nama_menu": "Mie Ayam", "qty": 1, "metode_bayar": "Tunai", "ocr_confidence": 0.93},
                    {"teks_mentah_ocr": "1 MP", "menu_code": "MP", "nama_menu": "Mie Ayam Pangsit", "qty": 1, "metode_bayar": "Tunai", "ocr_confidence": 0.91},
                    {"teks_mentah_ocr": "1 MB", "menu_code": "MB", "nama_menu": "Mie Ayam Bakso", "qty": 1, "metode_bayar": "QRIS", "ocr_confidence": 0.90},
                ],
                "ringkasan_harian": "Total 3 porsi mie ayam senilai Rp70.000.",
            }
        )

    monkeypatch.setattr(settings, "GEMINI_API_KEY", "fake-gemini-key")
    monkeypatch.setattr("app.api.ai.run_vision_extraction", fake_extract)
    monkeypatch.setattr("app.pipeline.postprocess._call_gemini_text_only", fake_call_gemini)

    note_bytes = _make_sample_note_with_right_prices()
    res = client.post(
        "/api/v1/ai/ocr-recap",
        files={"file": ("nota.png", io.BytesIO(note_bytes), "image/png")},
        data={"tanggal": "2026-11-25"},
    )
    assert res.status_code == 200
    data = res.json()

    assert len(captured_prompts) == 1
    assert data["engine_used"] == "custom_ocr_plus_gemini"
    assert data["total_tunai"] == 45000
    assert data["total_qris"] == 25000
    assert data["grand_total"] == 70000
    assert data["perlu_tinjauan_manual"] is False


def test_ocr_recap_falls_back_to_local_on_gemini_429_error(monkeypatch):
    def fake_extract(_image_bytes: bytes):
        return {
            "valid_image": True,
            "raw_text": "1 MA\n1 es teler",
            "items": [
                {"raw_text": "1 MA", "qty": 1, "raw_item": "ma", "confidence": 0.95},
                {"raw_text": "1 es teler", "qty": 1, "raw_item": "es teler", "confidence": 0.92},
            ],
            "overall_confidence": 0.94,
            "perlu_tinjauan_manual": False,
        }

    def fake_failing_gemini(*_args, **_kwargs):
        raise RuntimeError("429 Resource Exhausted")

    monkeypatch.setattr(settings, "GEMINI_API_KEY", "fake-gemini-key")
    monkeypatch.setattr("app.api.ai.run_vision_extraction", fake_extract)
    monkeypatch.setattr("app.pipeline.postprocess._call_gemini_text_only", fake_failing_gemini)

    note_bytes = _make_sample_note_with_right_prices()
    res = client.post(
        "/api/v1/ai/ocr-recap",
        files={"file": ("nota.png", io.BytesIO(note_bytes), "image/png")},
        data={"tanggal": "2026-11-25"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["engine_used"] == "custom_ocr_local_fallback"
    assert data["grand_total"] == 40000
    assert data["perlu_tinjauan_manual"] is False


# ---------------------------------------------------------------------------
# 5. Chatbot Intent Endpoint /api/v1/ai/chat
# ---------------------------------------------------------------------------

def test_chat_endpoint_intents_and_escalation():
    # Tanya produk dengan singkatan baru mp & air mineral
    res_prod = client.post(
        "/api/v1/ai/chat",
        json={"message": "kak mp sama air mineral brp harganya ya?"},
    )
    assert res_prod.status_code == 200
    body_prod = res_prod.json()
    assert body_prod["predicted_intent"] == "tanya_produk"
    assert body_prod["escalate_to_owner"] is False
    assert "Air Mineral" in body_prod["reply"]
    assert "Bakso Sapi Tambahan" not in body_prod["reply"]

    # Keluhan -> wajib escalate_to_owner = True
    res_comp = client.post(
        "/api/v1/ai/chat",
        json={"message": "pesanan saya salah menu dan sudah nunggu 1 jam lebih kecewa"},
    )
    assert res_comp.status_code == 200
    body_comp = res_comp.json()
    assert body_comp["predicted_intent"] == "keluhan"
    assert body_comp["escalate_to_owner"] is True

    # Pertanyaan OOT (termasuk yang mengandung kata 'harga' namun di luar konteks warung) -> ditolak sopan
    for oot_msg in (
        "min cuaca di sidoarjo sekarang mendung gak ya?",
        "berapa harga saham bbca hari ini?",
    ):
        res_oot = client.post(
            "/api/v1/ai/chat",
            json={"message": oot_msg},
        )
        assert res_oot.status_code == 200
        body_oot = res_oot.json()
        assert body_oot["predicted_intent"] == "lainnya"
        assert body_oot["escalate_to_owner"] is False
        assert "Mie Ayam Surabaya" in body_oot["reply"]
