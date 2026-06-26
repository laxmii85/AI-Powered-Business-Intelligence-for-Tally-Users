from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import init_db
from .routers import ai, dashboard, data, uploads


settings = get_settings()
app = FastAPI(title="AI Accounting Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
