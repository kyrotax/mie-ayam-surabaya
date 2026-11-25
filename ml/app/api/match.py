"""Endpoint modular pencocokan item hasil ekstraksi terhadap 8 menu resmi."""

from fastapi import APIRouter, Depends
from app.core.auth import verify_api_key
from app.matching.matcher import match_items
from app.schemas.order import MatchRequest, MatchResponse

router = APIRouter()


@router.post("", response_model=MatchResponse, dependencies=[Depends(verify_api_key)])
async def match_menu(payload: MatchRequest):
    """Menormalkan nama item/alias dan menghitung harga berdasarkan 8 menu resmi."""
    matched_rows = match_items(payload.items)
    unmatched_count = sum(1 for item in matched_rows if not item["matched"])
    grand_total = sum(int(item["subtotal"]) for item in matched_rows if item["matched"])

    return MatchResponse(
        status="success",
        matched=matched_rows,
        unmatched_count=unmatched_count,
        grand_total=grand_total,
    )
