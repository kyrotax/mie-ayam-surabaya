"""
Layanan Prediksi Intent untuk Chatbot Mie Ayam Surabaya.
Memuat model terbaik yang telah dilatih (TF-IDF + Linear SVM) dan melakukan inferensi cepat.
"""

import os
import re
import joblib
import numpy as np

# Kamus Normalisasi Slang & Singkatan Chat Lokal Sidoarjo / Surabaya
SLANG_MAP = {
    r"\bma\b": "mie ayam",
    r"\bmap\b": "mie ayam pangsit",
    r"\bmab\b": "mie ayam bakso",
    r"\bmak\b": "mie ayam komplit",
    r"\besteh\b": "es teh",
    r"\bteh anget\b": "teh hangat",
    r"\besteler\b": "es teler",
    r"\bbrp\b": "berapa",
    r"\budh\b": "sudah",
    r"\bsdh\b": "sudah",
    r"\bblm\b": "belum",
    r"\bbs\b": "bisa",
    r"\bgak\b": "tidak",
    r"\bga\b": "tidak",
    r"\bnggak\b": "tidak",
    r"\bgk\b": "tidak",
    r"\bdmn\b": "dimana",
    r"\btgl\b": "tanggal",
    r"\bbsk\b": "besok",
    r"\bhr\b": "hari",
    r"\bjm\b": "jam",
    r"\bkmrn\b": "kemarin",
    r"\btd\b": "tadi",
    r"\bdr\b": "dari",
    r"\bbwt\b": "buat",
    r"\butk\b": "untuk",
    r"\bmin\b": "admin",
    r"\bkak\b": "kakak",
    r"\bgmn\b": "bagaimana",
    r"\bdgn\b": "dengan",
    r"\bsy\b": "saya",
    r"\bak\b": "aku",
    r"\bmakasih\b": "terima kasih",
    r"\btq\b": "terima kasih",
    r"\bthx\b": "terima kasih"
}

def preprocess_text(text: str) -> str:
    """Case folding, standarisasi slang, dan pembersihan karakter non-alfanumerik."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    for pattern, replacement in SLANG_MAP.items():
        text = re.sub(pattern, replacement, text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

class IntentClassifierService:
    def __init__(self, model_path: str = "ml/app/classifier/intent_model_best.joblib"):
        if not os.path.exists(model_path):
            alt_path = "data-science/models/intent_model_best.joblib"
            if os.path.exists(alt_path):
                model_path = alt_path
            else:
                raise FileNotFoundError(f"Model file tidak ditemukan di {model_path} atau {alt_path}")
        
        artifact = joblib.load(model_path)
        self.vectorizer = artifact["vectorizer"]
        self.model = artifact["model"]
        self.labels = artifact["labels"]
        self.model_name = artifact.get("model_name", "TF-IDF + Linear SVM")

    def _softmax(self, x):
        e_x = np.exp(x - np.max(x))
        return e_x / e_x.sum(axis=0)

    def predict(self, text: str) -> dict:
        """
        Memprediksi intent dan confidence score dari teks pesan pelanggan.
        Returns:
            dict: {
                "intent": str,
                "confidence": float,
                "clean_text": str,
                "all_scores": dict
            }
        """
        clean = preprocess_text(text)
        if not clean:
            return {
                "intent": "lainnya",
                "confidence": 0.50,
                "clean_text": "",
                "all_scores": {lbl: 0.25 for lbl in self.labels}
            }
        
        vec = self.vectorizer.transform([clean])
        
        if hasattr(self.model, "decision_function"):
            scores = self.model.decision_function(vec)[0]
            probs = self._softmax(scores)
            pred_idx = np.argmax(probs)
            pred_label = self.model.classes_[pred_idx]
            confidence = float(probs[pred_idx])
            all_scores = {cls_name: round(float(prob), 4) for cls_name, prob in zip(self.model.classes_, probs)}
        elif hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(vec)[0]
            pred_idx = np.argmax(probs)
            pred_label = self.model.classes_[pred_idx]
            confidence = float(probs[pred_idx])
            all_scores = {cls_name: round(float(prob), 4) for cls_name, prob in zip(self.model.classes_, probs)}
        else:
            pred_label = self.model.predict(vec)[0]
            confidence = 0.90
            all_scores = {pred_label: 0.90}

        return {
            "intent": pred_label,
            "confidence": round(confidence, 4),
            "clean_text": clean,
            "all_scores": all_scores
        }

# Singleton instance
_service_instance = None

def get_intent_classifier() -> IntentClassifierService:
    global _service_instance
    if _service_instance is None:
        _service_instance = IntentClassifierService()
    return _service_instance

if __name__ == "__main__":
    clf = get_intent_classifier()
    test_queries = [
        "kak mie ayam bakso porsi komplit berapaan ya?",
        "min mau pesen 3 bungkus mie pangsit kuah dipisah dong",
        "pesanan saya kok belum dateng2 ya sudah 1 jam lebih nih kecewa!",
        "halo selamat pagi min apa kabar",
        "min cuaca di sidoarjo sekarang mendung gak ya?"
    ]
    print("\n--- UJI COBA INFERENSI INTENT CLASSIFIER ---")
    for q in test_queries:
        res = clf.predict(q)
        print(f"Pesan: '{q}'")
        print(f" -> Intent: {res['intent']} (Confidence: {res['confidence']:.2f})\n")
