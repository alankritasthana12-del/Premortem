import httpx
from app.core.config import settings

async def save_report_to_cloud(user_id: str, project_name: str, threat_score: int, report_payload: dict):
    # Supabase REST API URL for the 'reports' table
    url = f"{settings.SUPABASE_URL}/rest/v1/reports"
    
    headers = {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    data = {
        "user_id": user_id if user_id else None,
        "project_name": project_name,
        "threat_score": threat_score,
        "report_payload": report_payload
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=data)
            if response.status_code not in [200, 201]:
                print(f"Supabase Error: {response.text}")
                return False
            return True
        except Exception as e:
            print(f"Failed to connect to Supabase: {e}")
            return False

async def fetch_history_from_cloud(user_id: str):
    url = f"{settings.SUPABASE_URL}/rest/v1/reports"
    
    headers = {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Query parameters to filter by user_id, select all, and order by created_at desc
    params = {
        "user_id": f"eq.{user_id}",
        "select": "*",
        "order": "created_at.desc"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Supabase Error fetching history: {response.text}")
                return []
        except Exception as e:
            print(f"Failed to fetch history from Supabase: {e}")
            return []
