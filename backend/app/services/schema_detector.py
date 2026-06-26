import re
import pandas as pd


class SchemaDetector:
    DATE_HINTS = ("date", "month", "time", "created", "updated", "invoice_date")
    MONEY_HINTS = ("amount", "revenue", "sales", "profit", "price", "total", "paid", "due", "gst", "tax")
    CUSTOMER_HINTS = ("customer", "client", "party", "buyer")
    INVOICE_HINTS = ("invoice", "bill", "voucher")
    PRODUCT_HINTS = ("product", "item", "sku", "service")

    def detect(self, df: pd.DataFrame) -> dict:
        columns = []
        for column in df.columns:
            series = df[column]
            lower = str(column).lower()
            kind = self._kind(lower, series)
            columns.append(
                {
                    "name": str(column),
                    "type": kind,
                    "pandas_type": str(series.dtype),
                    "nullable": bool(series.isna().any()),
                    "sample_values": [str(v) for v in series.dropna().head(4).tolist()],
                }
            )
        return {"columns": columns, "roles": self._roles(columns)}

    def _kind(self, name: str, series: pd.Series) -> str:
        if any(hint in name for hint in self.DATE_HINTS) or pd.api.types.is_datetime64_any_dtype(series):
            return "date"
        if any(hint in name for hint in self.MONEY_HINTS) and pd.api.types.is_numeric_dtype(series):
            return "currency"
        if "gst" in name or "tax" in name:
            return "gst"
        if any(hint in name for hint in self.CUSTOMER_HINTS):
            return "customer"
        if any(hint in name for hint in self.INVOICE_HINTS):
            return "invoice"
        if any(hint in name for hint in self.PRODUCT_HINTS):
            return "product"
        if pd.api.types.is_numeric_dtype(series):
            return "numeric"
        if series.astype(str).str.match(re.compile(r"^\d{4}-\d{2}-\d{2}")).any():
            return "date"
        return "text"

    def _roles(self, columns: list[dict]) -> dict:
        roles: dict[str, list[str]] = {}
        for column in columns:
            roles.setdefault(column["type"], []).append(column["name"])
        return roles
