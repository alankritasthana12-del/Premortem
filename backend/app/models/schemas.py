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
