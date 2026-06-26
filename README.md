# AI Accounting Assistant

Production-minded AI analytics platform for accounting datasets. Upload CSV/XLSX files, inspect schema metadata, explore records, generate dashboards, and ask business questions through a Text-to-SQL command center.

## Stack

- Frontend: React, Vite, TailwindCSS, React Router, TanStack Table, Recharts, Zustand, Framer Motion, Lucide React
- Backend: FastAPI, SQLAlchemy, Pandas, OpenPyXL
- Database: PostgreSQL by default, SQLite fallback for local demos
- AI: Ollama Phi3 compatible Text-to-SQL flow

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Configuration

Backend environment variables:

- `DATABASE_URL`: PostgreSQL URL. Defaults to `sqlite:///./accounting_assistant.db` for local use.
- `OLLAMA_BASE_URL`: defaults to `http://localhost:11434`
- `OLLAMA_MODEL`: defaults to `phi3`
- `CORS_ORIGINS`: comma-separated allowed origins

## API

- `POST /api/uploads` upload CSV/XLSX dataset

https://github.com/user-attachments/assets/e66b22d9-9815-48ef-b0be-05f5f73f3b81




- `GET /api/uploads` list datasets
- `GET /api/uploads/{id}` dataset metadata
- `GET /api/dashboard/{id}` dashboard KPIs, charts, insights
- `GET /api/data/{id}` paginated/searchable/sortable records
- `POST /api/ai/query` Text-to-SQL business query
- `GET /api/ai/history/{id}` conversation history

## Notes

The app is designed to be useful without external services. When Ollama is unavailable, the backend falls back to deterministic SQL generation for common accounting questions.
