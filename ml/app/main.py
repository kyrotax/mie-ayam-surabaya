from fastapi import FastAPI
from app.api import extract, match, health

app = FastAPI(title="Mie Ayam ML Service")

app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(extract.router, prefix="/extract", tags=["Extraction"])
app.include_router(match.router, prefix="/match", tags=["Matching"])
