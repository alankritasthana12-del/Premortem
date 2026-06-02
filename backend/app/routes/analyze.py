from fastapi import APIRouter, HTTPException
from app.models.schemas import StartupSubmission
from app.services.llm_service import generate_premortem_report
from app.services.rag_service import get_relevant_context

router = APIRouter()

@router.post("/")
async def analyze_startup(startup_data: StartupSubmission):
    try:
        # Retrieve relevant historical context based on idea and market
        context = get_relevant_context(startup_data.idea, startup_data.market)
        
        # Pass the context into the LLM service
        report = await generate_premortem_report(startup_data, context)
        
        return report
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Unhandled error in analyze route: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while analyzing the startup.")
