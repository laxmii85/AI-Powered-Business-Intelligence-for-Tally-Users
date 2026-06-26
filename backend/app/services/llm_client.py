import re
import requests
from ..config import get_settings


class LocalLLMClient:
    def generate(self, prompt: str) -> str:
        settings = get_settings()
        provider = settings.local_llm_provider.lower()
        if provider == "openai_compatible":
            return self._openai_compatible(prompt)
        return self._ollama(prompt)

    def _ollama(self, prompt: str) -> str:
        settings = get_settings()
        response = requests.post(
            f"{settings.local_llm_base_url.rstrip('/')}/api/generate",
            json={"model": settings.local_llm_model, "prompt": prompt, "stream": False},
            timeout=settings.local_llm_timeout,
        )
        response.raise_for_status()
        return response.json().get("response", "")

    def _openai_compatible(self, prompt: str) -> str:
        settings = get_settings()
        headers = {"Content-Type": "application/json"}
        if settings.local_llm_api_key:
            headers["Authorization"] = f"Bearer {settings.local_llm_api_key}"
        response = requests.post(
            f"{settings.local_llm_base_url.rstrip('/')}/v1/chat/completions",
            headers=headers,
            json={
                "model": settings.local_llm_model,
                "temperature": 0,
                "messages": [
                    {"role": "system", "content": "You convert natural language accounting questions into safe SQL only."},
                    {"role": "user", "content": prompt},
                ],
            },
            timeout=settings.local_llm_timeout,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def extract_sql(self, text: str) -> str:
        cleaned = text.strip()
        fenced = re.search(r"```(?:sql)?\s*(.*?)```", cleaned, re.IGNORECASE | re.DOTALL)
        if fenced:
            cleaned = fenced.group(1).strip()
        select_match = re.search(r"\bselect\b.*", cleaned, re.IGNORECASE | re.DOTALL)
        return select_match.group(0).strip().rstrip(";") if select_match else cleaned.rstrip(";")
