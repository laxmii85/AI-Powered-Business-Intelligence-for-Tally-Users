import pandas as pd


class MetadataGenerator:
    def generate(self, df: pd.DataFrame, schema: dict) -> dict:
        numeric = df.select_dtypes(include="number")
        stats = {
            "numeric": numeric.describe().fillna(0).to_dict() if not numeric.empty else {},
            "missing_values": df.isna().sum().to_dict(),
            "duplicates": int(df.duplicated().sum()),
        }
        suggestions = self._questions(schema)
        return {"schema": schema, "statistics": stats, "suggestions": suggestions}

    def _questions(self, schema: dict) -> list[str]:
        roles = schema.get("roles", {})
        questions = ["Show total sales", "Show records where amount > 50000", "Highlight business risks"]
        if roles.get("customer"):
            questions.append("Which customers contribute most revenue?")
        if roles.get("date"):
            questions.append("Compare this month with last month")
        if roles.get("gst"):
            questions.append("Show GST payable")
        if roles.get("product"):
            questions.append("Which products are underperforming?")
        return questions
