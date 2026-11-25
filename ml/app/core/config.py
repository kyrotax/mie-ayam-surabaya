"""Konfigurasi terpusat untuk layanan ML/AI Mie Ayam Surabaya."""

import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

_ML_ROOT = Path(__file__).resolve().parents[2]
_REPO_ROOT = _ML_ROOT.parent


class Settings(BaseSettings):
    """Pengaturan environment service FastAPI ML."""

    API_KEY: str = "changeme"
    REQUIRE_API_KEY: bool = False
    MODEL_NAME: str = "gemini-2.5-flash"
    GEMINI_API_KEY: Optional[str] = None
    VISION_API_KEY: Optional[str] = None
    AIR_MINERAL_PRICE: int = 5000
    GEMINI_TIMEOUT_SECONDS: float = 15.0
    DEFAULT_PAYMENT_METHOD: str = "Tunai"

    model_config = SettingsConfigDict(
        env_file=(str(_REPO_ROOT / ".env"), str(_ML_ROOT / ".env"), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_gemini_api_key(self) -> Optional[str]:
        """Mengembalikan API key Gemini aktif bila diset dan bukan placeholder."""
        placeholders = {"", "your_gemini_api_key", "changeme", "none", "null"}
        candidates = (
            os.getenv("GEMINI_API_KEY"),
            os.getenv("VISION_API_KEY"),
            self.GEMINI_API_KEY,
            self.VISION_API_KEY,
        )
        for key in candidates:
            if key and key.strip().lower() not in placeholders:
                return key.strip()
        return None

    def is_api_key_enforced(self) -> bool:
        """Menentukan apakah header x-api-key wajib divalidasi."""
        return self.REQUIRE_API_KEY or (
            bool(self.API_KEY) and self.API_KEY not in {"changeme", "your_ml_service_secret_key"}
        )


settings = Settings()
