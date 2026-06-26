from .llm_client import LocalLLMClient


class SQLGenerator:
    def generate(self, question: str, table_name: str, schema: dict) -> str:
        fallback = self._fallback(question, schema)
        client = LocalLLMClient()
        try:
            prompt = self._prompt(question, table_name, schema)
            sql = client.extract_sql(client.generate(prompt))
            return sql if sql.lower().startswith("select") else fallback
        except Exception:
            return fallback

    def _prompt(self, question: str, table_name: str, schema: dict) -> str:
        columns = "\n".join(f"- {column['name']} ({column['type']})" for column in schema.get("columns", []))
        return (
            "Return SQL only, no markdown and no explanation.\n"
            "Use only SELECT queries. Allowed clauses: WHERE, GROUP BY, ORDER BY, HAVING, LIMIT.\n"
            "Never use DROP, DELETE, UPDATE, ALTER, INSERT, CREATE, TRUNCATE, PRAGMA, or comments.\n"
            "Database table: uploaded_data\n"
            "Columns on uploaded_data: id, upload_id, row_index, payload\n"
            "The original accounting columns are stored inside JSON payload.\n"
            "For PostgreSQL syntax use payload->>'Column Name'.\n"
            f"Dataset table alias requested by app: {table_name}\n"
            f"Original columns:\n{columns}\n"
            f"Business question: {question}"
        )

    def _fallback(self, question: str, schema: dict) -> str:
        roles = schema.get("roles", {})
        amount = (roles.get("currency") or roles.get("numeric") or ["Amount"])[0]
        customer = (roles.get("customer") or ["Customer"])[0]
        product = (roles.get("product") or ["Product"])[0]
        q = question.lower()
        if "customer" in q:
            return f"SELECT payload->>'{customer}' AS name, SUM(CAST(payload->>'{amount}' AS FLOAT)) AS value FROM uploaded_data GROUP BY name ORDER BY value DESC LIMIT 10"
        if "product" in q:
            return f"SELECT payload->>'{product}' AS name, SUM(CAST(payload->>'{amount}' AS FLOAT)) AS value FROM uploaded_data GROUP BY name ORDER BY value DESC LIMIT 10"
        if "unpaid" in q or "outstanding" in q:
            return "SELECT payload FROM uploaded_data WHERE LOWER(CAST(payload AS TEXT)) LIKE '%unpaid%' OR LOWER(CAST(payload AS TEXT)) LIKE '%due%' LIMIT 50"
        return f"SELECT SUM(CAST(payload->>'{amount}' AS FLOAT)) AS total FROM uploaded_data LIMIT 1"
