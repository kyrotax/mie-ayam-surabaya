from fastapi import APIRouter

router = APIRouter()

@router.post("")
async def match_menu():
    # Pipeline: normalize -> matcher
    return {"status": "ok", "matched": []}
