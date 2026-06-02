import google.generativeai as genai
import json
import uuid
from datetime import datetime
from app.core.config import settings
from app.core.prompts import get_system_prompt
from app.models.schemas import StartupSubmission

# Initialize the Gemini client configuration
genai.configure(api_key=settings.GEMINI_API_KEY)

async def generate_premortem_report(startup_data: StartupSubmission, context: str = "") -> dict:
    # Initialize the model dynamically with the context-injected system prompt
    system_instruction = get_system_prompt(context)
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_instruction,
    )
    
    prompt = f"""
    Analyze the following startup:
    Name: {startup_data.name}
    Idea: {startup_data.idea}
    Target Market: {startup_data.market}
    Revenue Model: {startup_data.model}
    Main Competitors: {startup_data.competitors}
    Current Stage: {startup_data.stage}
    """
    
    response = model.generate_content(prompt)
    raw_text = response.text
    
    # Safely extract JSON in case the model ignored instructions and wrapped it in markdown
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
        # Ensure a unique ID and current date
        report_data["id"] = f"rpt_{uuid.uuid4().hex[:8]}"
        report_data["createdAt"] = datetime.now().strftime("%Y-%m-%d")
        
        # Ensure startup data carries over
        if "startup" not in report_data:
            report_data["startup"] = {}
        report_data["startup"]["name"] = startup_data.name
        report_data["startup"]["idea"] = startup_data.idea
        report_data["startup"]["market"] = startup_data.market
        report_data["startup"]["model"] = startup_data.model
        report_data["startup"]["stage"] = startup_data.stage
        
        return report_data
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from Gemini: {e}")
        print(f"Raw Text: {raw_text}")
        raise ValueError("Failed to parse the LLM response into JSON.")
