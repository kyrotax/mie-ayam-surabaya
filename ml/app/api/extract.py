from fastapi import APIRouter

router = APIRouter()

@router.post("")
async def extract_order():
    # Pipeline: preprocess -> vision_extract -> postprocess -> confidence
    return {"status": "ok", "extracted": []}
