from pydantic import BaseModel
from typing import Optional

class StartupSubmission(BaseModel):
    name: str
    idea: str
    market: str
    model: str
    competitors: str
    stage: str
    user_id: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage]
    report: dict
