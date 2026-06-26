from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.business_analysis import BusinessAnalysisService

router = APIRouter()


class AIQuery(BaseModel):
    upload_id: int
    question: str


@router.post("/query")
def ask(payload: AIQuery, db: Session = Depends(get_db)):
    return BusinessAnalysisService(db).answer(payload.upload_id, payload.question)


@router.get("/history/{upload_id}")
def history(upload_id: int, db: Session = Depends(get_db)):
    return BusinessAnalysisService(db).history(upload_id)
