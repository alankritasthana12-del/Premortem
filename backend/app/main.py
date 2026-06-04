import sys

# Force UTF-8 output on Windows (prevents charmap codec errors with ₹, €, etc.)
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import analyze

app = FastAPI(title="Premortem API")

# Setup CORS
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173", # Fallback
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Premortem API is running."}
