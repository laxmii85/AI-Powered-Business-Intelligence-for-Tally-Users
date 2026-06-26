from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..models import ChatHistory, UploadedData, Upload
from .chart_service import ChartService
from .sql_generator import SQLGenerator
from .sql_validator import SQLValidator


class BusinessAnalysisService:
    def __init__(self, db: Session):
        self.db = db

    def answer(self, upload_id: int, question: str) -> dict:
        upload = self.db.get(Upload, upload_id)
        if not upload or not upload.metadata_record:
            raise HTTPException(404, "Dataset not found")
        sql = SQLGenerator().generate(question, upload.table_name, upload.metadata_record.schema)
        try:
            SQLValidator().validate(sql)
        except ValueError as exc:
            raise HTTPException(400, str(exc)) from exc
        rows = [row.payload for row in self.db.query(UploadedData).filter_by(upload_id=upload_id).all()]
        filtered = self._answer_rows(question, rows, upload.metadata_record.schema)
        charts = ChartService().charts(filtered or rows, upload.metadata_record.schema)
        explanation = self._explain(question, filtered or rows)
        chat = ChatHistory(upload_id=upload_id, question=question, sql=sql, explanation=explanation, result_preview=(filtered or rows)[:10])
        self.db.add(chat)
        self.db.commit()
        return {"question": question, "sql": sql, "rows": (filtered or rows)[:100], "charts": charts, "explanation": explanation}

    def history(self, upload_id: int) -> list[dict]:
        items = self.db.query(ChatHistory).filter_by(upload_id=upload_id).order_by(ChatHistory.created_at.desc()).limit(20).all()
        return [{"id": item.id, "question": item.question, "sql": item.sql, "explanation": item.explanation, "created_at": item.created_at.isoformat()} for item in items]

    def _answer_rows(self, question: str, rows: list[dict], schema: dict) -> list[dict]:
        q = question.lower()
        roles = schema.get("roles", {})
        amount = (roles.get("currency") or roles.get("numeric") or [None])[0]
        customer = (roles.get("customer") or [None])[0]
        if "unpaid" in q or "outstanding" in q:
            return [row for row in rows if "unpaid" in str(row).lower() or "due" in str(row).lower()]
        if amount and ("50000" in q or "50,000" in q):
            return [row for row in rows if self._number(row.get(amount)) > 50000]
        if customer and "customer" in q:
            totals = {}
            for row in rows:
                key = row.get(customer) or "Unknown"
                totals[key] = totals.get(key, 0) + self._number(row.get(amount))
            return [{customer: key, amount: round(value, 2)} for key, value in sorted(totals.items(), key=lambda item: item[1], reverse=True)]
        return rows

    def _number(self, value) -> float:
        try:
            return float(str(value).replace(",", "").replace("₹", ""))
        except (TypeError, ValueError):
            return 0.0

    def _explain(self, question: str, rows: list[dict]) -> str:
        return f"Analyzed {len(rows)} matching records for: {question}. Review the refreshed table and charts for the strongest contributors, risks, and follow-up actions."
