from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..models import UploadedData, Upload


class SearchService:
    def __init__(self, db: Session):
        self.db = db

    def query(self, upload_id: int, search: str, sort_by: str, sort_dir: str, page: int, page_size: int) -> dict:
        if not self.db.get(Upload, upload_id):
            raise HTTPException(404, "Dataset not found")
        rows = [row.payload for row in self.db.query(UploadedData).filter_by(upload_id=upload_id).order_by(UploadedData.row_index).all()]
        if search:
            needle = search.lower()
            rows = [row for row in rows if any(needle in str(value).lower() for value in row.values())]
        if sort_by and rows and sort_by in rows[0]:
            rows = sorted(rows, key=lambda row: (row.get(sort_by) is None, row.get(sort_by)), reverse=sort_dir == "desc")
        total = len(rows)
        start = (page - 1) * page_size
        return {"rows": rows[start : start + page_size], "total": total, "page": page, "page_size": page_size, "columns": list(rows[0].keys()) if rows else []}
