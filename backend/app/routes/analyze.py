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
import groq
import json

# Initialize the Groq client
client = groq.Groq(api_key=settings.GROQ_API_KEY)

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

        history_formatted = []
        for msg in request.history:
            role = "user" if msg.role == "user" else "assistant"
            if history_formatted and history_formatted[-1]["role"] == role:
                history_formatted[-1]["content"] += f"\n\n{msg.content}"
            else:
                history_formatted.append({"role": role, "content": msg.content})
        
        # chat.send_message() will automatically append a 'user' turn. 
        # For Groq, we just append the new message to the history and send it.
        history_formatted.append({"role": "user", "content": request.message})
            
        messages = [{"role": "system", "content": system_instruction}] + history_formatted
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return {"response": response.choices[0].message.content}
        
        return {"response": response.text}
    except Exception as e:
        error_msg = str(e)
        print(f"Unhandled error in chat route: {error_msg}")
        status_code = 429 if "429" in error_msg else 500
        raise HTTPException(status_code=status_code, detail=error_msg)