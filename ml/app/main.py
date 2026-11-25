"""Entrypoint aplikasi FastAPI Mie Ayam ML & AI Service."""

from fastapi import FastAPI
from app.api import ai, extract, health, match

app = FastAPI(
    title="Mie Ayam Surabaya ML Service",
    version="1.0.0",
    description="Layanan Custom OCR 3-Stage Hybrid, Menu Matcher, dan Intent Chatbot UMKM Mie Ayam Surabaya.",
)

app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(extract.router, prefix="/extract", tags=["Extraction"])
app.include_router(match.router, prefix="/match", tags=["Matching"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Endpoints"])
