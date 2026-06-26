import re


class SQLValidator:
    FORBIDDEN = re.compile(r"\b(drop|delete|update|alter|insert|truncate|create|grant|revoke)\b", re.IGNORECASE)

    def validate(self, sql: str) -> str:
        statement = sql.strip().rstrip(";")
        if not statement.lower().startswith("select"):
            raise ValueError("Only SELECT statements are allowed")
        if self.FORBIDDEN.search(statement):
            raise ValueError("Unsafe SQL keyword detected")
        return statement
