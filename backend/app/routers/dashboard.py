from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.dashboard_service import DashboardService

router = APIRouter()


@router.get("/{upload_id}")
def dashboard(upload_id: int, db: Session = Depends(get_db)):
    return DashboardService(db).build(upload_id)
