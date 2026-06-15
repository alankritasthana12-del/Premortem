from fastapi import APIRouter, HTTPException
from app.models.schemas import StartupSubmission
from app.services.llm_service import generate_premortem_report
from app.services.rag_service import get_relevant_context
from app.db.supabase_store import save_report_to_cloud

router = APIRouter()

# CHANGE HERE: Remove the "/" to prevent trailing slash redirects
@router.post("")
async def analyze_startup(startup_data: StartupSubmission):
    try:
        # Retrieve relevant historical context based on idea and market
        context = get_relevant_context(startup_data.idea, startup_data.market)
        
        # Pass the context into the LLM service
        report = await generate_premortem_report(startup_data, context)
        
        if startup_data.user_id:
            await save_report_to_cloud(
                user_id=startup_data.user_id,
                project_name=startup_data.name,
                threat_score=report.get("overallRisk", 0),
                report_payload=report
            )
            
        return report
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Unhandled error in analyze route: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while analyzing the startup.")

from app.db.supabase_store import fetch_history_from_cloud
from app.models.schemas import ChatRequest
from app.core.config import settings
import google.generativeai as genai
import json

genai.configure(api_key=settings.GEMINI_API_KEY)

@router.get("/history/{user_id}")
async def get_user_history(user_id: str):
    try:
        history = await fetch_history_from_cloud(user_id)
        return history
    except Exception as e:
        print(f"Unhandled error in history route: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching history.")

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        system_instruction = f"""CRITICAL INSTRUCTION: You are Liv, an AI assistant and expert venture capitalist. 
Your SOLE purpose is to explain the following startup analysis report. Do not answer questions outside the scope of this report. 
If the user asks about the report or any specific part of it, YOU HAVE FULL ACCESS TO ALL THE DETAILS BELOW. 
You should be able to explain the strengths, weaknesses, scenarios, and personas in detail. 
Keep your responses conversational, concise, and professional.

IMPORTANT VOICE SYNTHESIS RULE: Your response is being read aloud by a text-to-speech engine. 
DO NOT use ANY Markdown formatting. Do not use asterisks (*), bolding, bullet points, or hash marks (#).
Respond in pure, conversational plain text only.

STARTUP IDEA / MARKET: {request.report.get('startup', {}).get('idea', 'N/A')}

REPORT DATA (JSON FORMAT):
{json.dumps(request.report, indent=2)[:8000]}"""

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        )

        history_formatted = [
            {"role": "user" if msg.role == "user" else "model", "parts": [msg.content]} 
            for msg in request.history
        ]
        
        chat = model.start_chat(history=history_formatted)
        response = chat.send_message(request.message)
        
        return {"response": response.text}
    except Exception as e:
        print(f"Unhandled error in chat route: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during chat.")