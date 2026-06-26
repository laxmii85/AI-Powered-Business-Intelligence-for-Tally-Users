from sqlalchemy import text
from sqlalchemy.orm import Session


class QueryExecutor:
    def __init__(self, db: Session):
        self.db = db

    def execute(self, sql: str, upload_id: int) -> list[dict]:
        scoped_sql = f"SELECT * FROM ({sql}) AS ai_query"
        result = self.db.execute(text(scoped_sql), {"upload_id": upload_id})
        return [dict(row._mapping) for row in result.fetchall()]
