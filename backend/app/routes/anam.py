from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()

class AnamTokenRequest(BaseModel):
    systemPrompt: str = None

class AnamTokenResponse(BaseModel):
    sessionToken: str

@router.post("/token", response_model=AnamTokenResponse)
async def get_anam_session_token(request: AnamTokenRequest):
    if not settings.ANAM_API_KEY:
        raise HTTPException(status_code=500, detail="ANAM_API_KEY is not configured on the server")
        
    # The agent ID you've been using
    agent_id = "ebd4f7f8-ab8e-47a2-9d80-bde36011ef7c"
    
    if request.systemPrompt:
        # For dynamic prompts, we must use an ephemeral session and omit personaId
        persona_config = {
            "avatarId": "960f614f-ea88-47c3-9883-f02094f70874",
            "voiceId": "c48c4dd9-5050-11f1-9076-5e955d484d11",
            "llmId": "da708fce-72b2-4445-b63f-634783b0170d", # User's Custom Gemini Key
            "systemPrompt": request.systemPrompt
        }
    else:
        persona_config = {
            "personaId": agent_id
        }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anam.ai/v1/auth/session-token",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.ANAM_API_KEY}"
                },
                json={
                    "personaConfig": persona_config
                },
                timeout=10.0
            )
            
            response.raise_for_status()
            data = response.json()
            return {"sessionToken": data.get("sessionToken")}
            
    except httpx.HTTPStatusError as e:
        print(f"Anam API Error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch session token from Anam")
    except Exception as e:
        print(f"Error fetching Anam token: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching Anam token")
