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

@router.get("/history/{user_id}")
async def get_user_history(user_id: str):
    try:
        history = await fetch_history_from_cloud(user_id)
        return history
    except Exception as e:
        print(f"Unhandled error in history route: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching history.")