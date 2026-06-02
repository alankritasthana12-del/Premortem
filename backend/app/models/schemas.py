from pydantic import BaseModel

class StartupSubmission(BaseModel):
    name: str
    idea: str
    market: str
    model: str
    competitors: str
    stage: str
