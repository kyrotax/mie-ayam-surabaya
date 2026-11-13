from pydantic import BaseModel
from typing import List, Optional

class ExtractedItem(BaseModel):
    name: str
    quantity: int
    notes: Optional[str] = None
    confidence: float

class ExtractionResponse(BaseModel):
    order_items: List[ExtractedItem]
