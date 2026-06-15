import groq
import json
import uuid
from datetime import datetime
from app.core.config import settings
from app.core.prompts import get_system_prompt
from app.models.schemas import StartupSubmission

# Initialize the Groq client
client = groq.Groq(api_key=settings.GROQ_API_KEY)

async def generate_premortem_report(startup_data: StartupSubmission, context: str = "") -> dict:
    system_instruction = get_system_prompt(context)
    
    prompt = f"""
    Analyze the following startup:
    Name: {startup_data.name}
    Idea: {startup_data.idea}
    Target Market: {startup_data.market}
    Revenue Model: {startup_data.model}
    Main Competitors: {startup_data.competitors}
    Current Stage: {startup_data.stage}
    
    IMPORTANT: Your JSON response MUST include ALL 12 personas in the personas array.
    Exactly 8 bear personas (ids: bear_investor, bear_competitor, bear_customer, bear_regulator,
    bear_engineer, bear_economist, bear_finance, bear_founder) followed by exactly 4 bull personas
    (ids: bull_investor, bull_adopter, bull_optimist, bull_operator).
    Each persona MUST be present. Missing any persona is incorrect output.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=8000,
        response_format={"type": "json_object"}
    )
    
    raw_text = response.choices[0].message.content
    
    # Safely extract JSON in case the model wrapped it in markdown
    json_text = raw_text.strip()
    if json_text.startswith("```json"):
        json_text = json_text[7:]
    elif json_text.startswith("```"):
        json_text = json_text[3:]
    if json_text.endswith("```"):
        json_text = json_text[:-3]
    json_text = json_text.strip()
    
    try:
        report_data = json.loads(json_text)
        report_data["id"] = f"rpt_{uuid.uuid4().hex[:8]}"
        report_data["createdAt"] = datetime.now().strftime("%Y-%m-%d")
        
        if "startup" not in report_data:
            report_data["startup"] = {}
        report_data["startup"]["name"]        = startup_data.name
        report_data["startup"]["idea"]        = startup_data.idea
        report_data["startup"]["market"]      = startup_data.market
        report_data["startup"]["model"]       = startup_data.model
        report_data["startup"]["stage"]       = startup_data.stage
        
        # Validate + log persona counts
        personas = report_data.get("personas", [])
        bears = [p for p in personas if (p.get("stance","") or "").lower() == "bear"
                                       or str(p.get("id","")).startswith("bear_")]
        bulls = [p for p in personas if (p.get("stance","") or "").lower() == "bull"
                                       or str(p.get("id","")).startswith("bull_")]
        print(f"[Premortem] Personas: {len(personas)} total, {len(bears)} bears, {len(bulls)} bulls")
        
        if len(bears) == 0:
            print("[Premortem] WARNING: No bear personas in response — possible truncation.")
        
        return report_data

    except json.JSONDecodeError as e:
        safe_text = raw_text.encode('ascii', errors='replace').decode('ascii')
        print(f"[Premortem] JSON parse error: {e}")
        print(f"[Premortem] Raw text preview: {safe_text[:1000]}")
        raise ValueError("Failed to parse the LLM response into JSON.")
