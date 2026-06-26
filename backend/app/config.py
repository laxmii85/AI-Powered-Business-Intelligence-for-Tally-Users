from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings

DEFAULT_DB = f"sqlite:///{(Path(__file__).resolve().parents[2] / 'accounting_assistant.db').as_posix()}"


class Settings(BaseSettings):
    database_url: str = DEFAULT_DB
    local_llm_provider: str = "ollama"
    local_llm_base_url: str = "http://localhost:11434"
    local_llm_model: str = "phi3"
    local_llm_api_key: str = ""
    local_llm_timeout: int = 30
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
