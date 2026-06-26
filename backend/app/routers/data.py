from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.search_service import SearchService

router = APIRouter()


@router.get("/{upload_id}")
def explore_data(
    upload_id: int,
    db: Session = Depends(get_db),
    search: str = "",
    sort_by: str = "",
    sort_dir: str = Query("asc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),
):
    return SearchService(db).query(upload_id, search, sort_by, sort_dir, page, page_size)
