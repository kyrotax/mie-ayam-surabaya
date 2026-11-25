"""
Layanan Custom OCR Lokal untuk Rekapitulasi Catatan Transaksi Harian (Stage 1).
- Fokus ke kolom kiri (qty + kode makanan / nama minuman), mengabaikan '}' & harga kanan.
- Grouping baris berbasis koordinat Y, tidak bergantung token TUNAI/QRIS.
- Tidak pernah mengarang baris dummy hardcoded ketika gambar kosong/gagal terbaca.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import cv2
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models, transforms

from app.matching.normalize import normalize_item_name, parse_qty_and_item
from app.pipeline.confidence import calculate_confidence, needs_manual_review
from app.pipeline.preprocess import segment_left_column_rows

_DEFAULT_WEIGHTS_PATH = Path(__file__).resolve().parent / "ocr_handwriting_best.pth"
_ALT_DATA_SCIENCE_WEIGHTS = Path(__file__).resolve().parents[3] / "data-science" / "models" / "ocr_handwriting_best.pth"

# Pemetaan token model .pth lama ke singkatan/nama standar katalog baru
_LEGACY_TOKEN_MAP = {
    "MAP": "MP",
    "MAB": "MB",
    "MAK": "MK",
    "ESTEH": "es teh",
    "TEH": "teh hangat",
    "TELER": "es teler",
}


class CustomOCRService:
    """Custom OCR lokal berbasis OpenCV + ResNet18."""

    def __init__(self, model_path: Optional[str] = None):
        candidates = []
        if model_path:
            candidates.append(Path(model_path))
        candidates.extend(
            [
                _DEFAULT_WEIGHTS_PATH,
                Path("ml/app/ocr/ocr_handwriting_best.pth"),
                _ALT_DATA_SCIENCE_WEIGHTS,
                Path("data-science/models/ocr_handwriting_best.pth"),
            ]
        )

        resolved_path = next((p for p in candidates if p.exists()), None)
        if resolved_path is None:
            raise FileNotFoundError(
                f"Model checkpoint OCR tidak ditemukan di {[str(p) for p in candidates]}"
            )

        checkpoint = torch.load(resolved_path, map_location="cpu", weights_only=False)
        self.classes: List[str] = list(checkpoint["classes"])
        self.num_classes: int = int(checkpoint["num_classes"])

        self.model = models.resnet18(weights=None)
        in_features = self.model.fc.in_features
        self.model.fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, self.num_classes),
        )
        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.eval()

        self.transform = transforms.Compose(
            [
                transforms.Resize((64, 128)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ]
        )

    def predict_crop(self, pil_image: Image.Image) -> Tuple[str, float]:
        """Prediksi kelas dan confidence score dari gambar potongan kata/angka."""
        rgb_image = pil_image.convert("RGB")
        tensor = self.transform(rgb_image).unsqueeze(0)
        with torch.no_grad():
            outputs = self.model(tensor)
            probs = torch.softmax(outputs, dim=1)[0]
            conf, pred_idx = torch.max(probs, dim=0)
            pred_class = self.classes[int(pred_idx.item())]
            return pred_class, float(conf.item())

    def extract_raw_rows(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Stage 1: Membaca foto nota kolom kiri menjadi daftar baris teks mentah.
        Mengabaikan kurung kurawal '}' dan angka harga di kolom kanan.
        """
        img, segmented_rows = segment_left_column_rows(image_bytes)
        if img is None:
            return {
                "valid_image": False,
                "raw_text": "",
                "items": [],
                "overall_confidence": 0.0,
                "perlu_tinjauan_manual": True,
            }

        if not segmented_rows:
            return {
                "valid_image": True,
                "raw_text": "",
                "items": [],
                "overall_confidence": 0.0,
                "perlu_tinjauan_manual": True,
            }

        h_img, w_img = img.shape[:2]
        extracted_items: List[Dict[str, Any]] = []

        for row in segmented_rows:
            token_labels: List[str] = []
            token_confs: List[float] = []

            for bx, by, bw, bh in row["token_bboxes"]:
                pad = 4
                y1 = max(0, by - pad)
                y2 = min(h_img, by + bh + pad)
                x1 = max(0, bx - pad)
                x2 = min(w_img, bx + bw + pad)
                crop = img[y1:y2, x1:x2]
                if crop.size == 0:
                    continue

                pil_crop = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
                raw_label, conf = self.predict_crop(pil_crop)
                mapped_label = _LEGACY_TOKEN_MAP.get(raw_label, raw_label)
                token_labels.append(mapped_label)
                token_confs.append(conf)

            if not token_labels:
                continue

            raw_line = " ".join(token_labels).strip()
            qty, raw_item, detected_pay, qty_ambiguous = parse_qty_and_item(raw_line)
            row_conf = round(float(min(token_confs)), 2) if token_confs else 0.0
            if qty_ambiguous:
                row_conf = min(row_conf, 0.65)

            extracted_items.append(
                {
                    "raw_text": raw_line,
                    "qty": qty,
                    "raw_item": raw_item or normalize_item_name(raw_line),
                    "confidence": row_conf,
                    "metode_bayar": detected_pay,
                    "bbox": row["row_bbox"],
                }
            )

        raw_text = "\n".join(item["raw_text"] for item in extracted_items)
        overall_conf = calculate_confidence(extracted_items)
        manual_review = needs_manual_review(extracted_items)

        return {
            "valid_image": True,
            "raw_text": raw_text,
            "items": extracted_items,
            "overall_confidence": overall_conf,
            "perlu_tinjauan_manual": manual_review,
        }


_ocr_instance: Optional[CustomOCRService] = None


def get_ocr_service() -> CustomOCRService:
    """Mengembalikan singleton CustomOCRService."""
    global _ocr_instance
    if _ocr_instance is None:
        _ocr_instance = CustomOCRService()
    return _ocr_instance
