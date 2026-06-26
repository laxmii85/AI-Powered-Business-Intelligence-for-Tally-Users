from collections import defaultdict
from datetime import datetime
from typing import Optional


class ChartService:
    def charts(self, rows: list[dict], schema: dict) -> list[dict]:
        roles = schema.get("roles", {})
        amount_col = self._first(roles, "currency", "numeric")
        date_col = self._first(roles, "date")
        customer_col = self._first(roles, "customer")
        product_col = self._first(roles, "product")
        charts = []
        if amount_col and date_col:
            charts.append({"title": "Monthly Revenue", "type": "line", "data": self._by_month(rows, date_col, amount_col)})
        if amount_col and customer_col:
            charts.append({"title": "Top Customers", "type": "bar", "data": self._top(rows, customer_col, amount_col)})
        if amount_col and product_col:
            charts.append({"title": "Top Products", "type": "bar", "data": self._top(rows, product_col, amount_col)})
        if not charts and amount_col:
            charts.append({"title": f"{amount_col} Distribution", "type": "bar", "data": self._buckets(rows, amount_col)})
        return charts

    def _first(self, roles: dict, *keys: str) -> Optional[str]:
        for key in keys:
            if roles.get(key):
                return roles[key][0]
        return None

    def _number(self, value) -> float:
        try:
            return float(str(value).replace(",", "").replace("₹", ""))
        except (TypeError, ValueError):
            return 0.0

    def _by_month(self, rows: list[dict], date_col: str, amount_col: str) -> list[dict]:
        values = defaultdict(float)
        for row in rows:
            raw = str(row.get(date_col, ""))
            try:
                month = datetime.fromisoformat(raw[:10]).strftime("%b %Y")
            except ValueError:
                month = raw[:7] or "Unknown"
            values[month] += self._number(row.get(amount_col))
        return [{"name": key, "value": round(value, 2)} for key, value in values.items()]

    def _top(self, rows: list[dict], label_col: str, amount_col: str) -> list[dict]:
        values = defaultdict(float)
        for row in rows:
            values[str(row.get(label_col) or "Unknown")] += self._number(row.get(amount_col))
        return [{"name": key, "value": round(value, 2)} for key, value in sorted(values.items(), key=lambda item: item[1], reverse=True)[:8]]

    def _buckets(self, rows: list[dict], amount_col: str) -> list[dict]:
        buckets = {"0-10k": 0, "10k-50k": 0, "50k-100k": 0, "100k+": 0}
        for row in rows:
            value = self._number(row.get(amount_col))
            if value < 10000:
                buckets["0-10k"] += 1
            elif value < 50000:
                buckets["10k-50k"] += 1
            elif value < 100000:
                buckets["50k-100k"] += 1
            else:
                buckets["100k+"] += 1
        return [{"name": key, "value": value} for key, value in buckets.items()]
