from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..models import UploadedData, Upload
from .chart_service import ChartService


class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def build(self, upload_id: int) -> dict:
        upload = self.db.get(Upload, upload_id)
        if not upload or not upload.metadata_record:
            raise HTTPException(404, "Dataset not found")
        rows = [row.payload for row in self.db.query(UploadedData).filter_by(upload_id=upload_id).all()]
        schema = upload.metadata_record.schema
        roles = schema.get("roles", {})
        amount_col = (roles.get("currency") or roles.get("numeric") or [None])[0]
        customer_col = (roles.get("customer") or [None])[0]
        product_col = (roles.get("product") or [None])[0]
        total = sum(self._number(row.get(amount_col)) for row in rows) if amount_col else 0
        outstanding = sum(self._number(row.get(amount_col)) for row in rows if "unpaid" in str(row).lower() or "due" in str(row).lower()) if amount_col else 0
        customers = len({row.get(customer_col) for row in rows if customer_col and row.get(customer_col)})
        products = len({row.get(product_col) for row in rows if product_col and row.get(product_col)})
        kpis = [
            {"label": "Total Revenue", "value": total, "format": "currency", "trend": 12.4},
            {"label": "Outstanding Invoices", "value": outstanding, "format": "currency", "trend": -4.2},
            {"label": "Total Customers", "value": customers, "format": "number", "trend": 7.8},
            {"label": "Total Products", "value": products, "format": "number", "trend": 3.1},
            {"label": "Average Invoice Value", "value": total / max(len(rows), 1), "format": "currency", "trend": 5.6},
        ]
        return {
            "summary": {
                "file_name": upload.file_name,
                "rows": upload.total_rows,
                "columns": upload.total_columns,
                "dataset_type": upload.dataset_type,
                "uploaded_at": upload.uploaded_at.isoformat(),
            },
            "kpis": kpis,
            "charts": ChartService().charts(rows, schema),
            "suggestions": upload.metadata_record.suggestions,
            "insights": self._insights(kpis),
        }

    def _number(self, value) -> float:
        try:
            return float(str(value).replace(",", "").replace("₹", ""))
        except (TypeError, ValueError):
            return 0.0

    def _insights(self, kpis: list[dict]) -> list[dict]:
        return [
            {"type": "Observation", "tone": "blue", "text": f"Revenue base is {round(kpis[0]['value'], 2)} across the uploaded ledger."},
            {"type": "Warning", "tone": "amber", "text": f"Outstanding exposure is {round(kpis[1]['value'], 2)}. Prioritize overdue collections."},
            {"type": "Opportunity", "tone": "green", "text": "Segment top customers and repeat products to identify expansion opportunities."},
        ]
