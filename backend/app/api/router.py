from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from app.services.live_data_service import live_data_service
from app.services.disaster_simulator import disaster_simulator
from app.services.memory_service import memory_service
from app.agents.department_agents import agent_orchestrator
from app.core.ai_gateway import ai_gateway
from app.core.security import human_approval_manager
from app.services.global_search_service import global_search_service
from app.services.scenario_engine import scenario_engine
from app.services.copilot_service import copilot_service
from app.services.location_intelligence_service import location_intelligence_service

router = APIRouter(prefix="/api/v1")

@router.get("/location/detect")
async def detect_location(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    user_tz: Optional[str] = None,
    user_lang: Optional[str] = None
):
    """Detect or reverse-geocode location details"""
    return await location_intelligence_service.detect_location_details(lat, lon, user_tz, user_lang)

@router.get("/location/radius-intel")
async def get_radius_intelligence(
    lat: float = Query(40.7128),
    lon: float = Query(-74.0060),
    radius_km: float = Query(5.0),
    category: str = Query("ALL")
):
    """Spatial POI intelligence across Emergency, Transport, Weather, Public Services, Businesses, Utilities within radius"""
    return await location_intelligence_service.get_radius_intelligence(lat, lon, radius_km, category)

@router.get("/location/insights")
async def get_location_insights(lat: float = Query(40.7128), lon: float = Query(-74.0060)):
    """AI location insights: traffic prediction 15/30/60m, best route, emergency response time ETA, safe zones"""
    return await location_intelligence_service.generate_ai_location_insights(lat, lon)

@router.get("/location/alerts")
async def get_smart_alerts():
    """Real-time location smart push alerts"""
    return {
        "alerts": location_intelligence_service.get_smart_alerts()
    }

@router.get("/city/state")
async def get_city_state():
    """Get aggregated live city state across sensors and public APIs"""
    return await live_data_service.get_city_state()

@router.get("/search")
async def global_search(q: str = Query("", description="Search term"), category: Optional[str] = None):
    """Global AI Search engine with fuzzy matching across 50+ categories"""
    results = global_search_service.search(q, category)
    return {
        "query": q,
        "count": len(results),
        "results": results
    }

@router.get("/search/summary")
async def get_location_summary(loc_id: str = Query(..., description="Location ID")):
    """Perplexity-style AI Location Intelligence Briefing"""
    return await global_search_service.generate_ai_location_summary(loc_id)

@router.post("/scenario/simulate")
async def simulate_scenario(payload: Dict[str, Any]):
    """Launch realistic city scenario simulation (16+ event types)"""
    scenario_key = payload.get("scenario_key", "major_accident")
    severity = payload.get("severity", 8)
    location = payload.get("location", "District 4 Central")

    res = await scenario_engine.execute_scenario(scenario_key, severity, location)
    return {
        "status": "LAUNCHED",
        "scenario": res
    }

@router.post("/copilot/query")
async def process_copilot_query(payload: Dict[str, Any]):
    """Universal AI Copilot natural language processing & tool execution relative to GPS"""
    query = payload.get("query", "")
    user_lat = payload.get("user_lat")
    user_lon = payload.get("user_lon")
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return await copilot_service.process_copilot_query(query, user_lat, user_lon)

@router.get("/agents/status")
async def get_agents_status():
    """Get health, activity, and execution logs for all department AI agents"""
    return {
        "agents": agent_orchestrator.get_all_statuses()
    }

@router.post("/agents/run-cycle")
async def trigger_agent_cycle():
    """Manually trigger an autonomous reasoning cycle across all AI agents"""
    city_data = await live_data_service.get_city_state()
    results = await agent_orchestrator.run_city_optimization_cycle(city_data)
    return {
        "status": "COMPLETED",
        "results": results
    }

@router.post("/disaster/trigger")
async def trigger_disaster(payload: Dict[str, Any]):
    """Trigger a disaster simulation scenario"""
    disaster_type = payload.get("disaster_type", "Earthquake")
    severity = payload.get("severity", 8)
    location = payload.get("location", "District 4 Industrial Sector")
    
    res = await disaster_simulator.trigger_disaster(disaster_type, severity, location)
    return {
        "status": "TRIGGERED",
        "disaster": res
    }

@router.post("/disaster/resolve")
async def resolve_disaster():
    """Contain and resolve active disaster scenario"""
    res = disaster_simulator.resolve_disaster()
    return {
        "status": "RESOLVED",
        "details": res
    }

@router.get("/incidents/active")
async def get_active_incidents():
    """Get active incidents and city memory entries"""
    return {
        "incidents": memory_service.incidents,
        "active_disaster": disaster_simulator.active_disaster
    }

@router.post("/citizen/sos")
async def submit_citizen_sos(payload: Dict[str, Any]):
    """Submit a citizen emergency SOS request"""
    name = payload.get("name", "Anonymous Citizen")
    location = payload.get("location", "Main Plaza")
    emergency_type = payload.get("type", "Medical Emergency")
    description = payload.get("description", "Immediate assistance requested.")

    citizen_agent = agent_orchestrator.agents.get("citizen")
    res = await citizen_agent.execute_reasoning_cycle({
        "task": "EMERGENCY CITIZEN SOS",
        "citizen": name,
        "location": location,
        "type": emergency_type,
        "description": description
    })

    inc = memory_service.add_incident(
        title=f"Citizen SOS: {emergency_type} at {location}",
        department="Citizen Support AI",
        severity="CRITICAL",
        details=payload
    )

    return {
        "status": "SOS_DISPATCHED",
        "incident_id": inc["id"],
        "agent_response": res
    }

@router.get("/human-approval/pending")
async def get_pending_approvals():
    """Get pending human-in-the-loop approval actions"""
    return {
        "pending": human_approval_manager.get_pending_requests()
    }

@router.post("/human-approval/process")
async def process_approval(payload: Dict[str, Any]):
    """Approve or reject high-risk autonomous agent action"""
    req_id = payload.get("req_id")
    approved = payload.get("approved", True)
    comment = payload.get("comment", "")
    
    res = human_approval_manager.process_approval(req_id, approved, comment)
    if not res:
        raise HTTPException(status_code=404, detail="Approval request not found")
        
    return {
        "status": "PROCESSED",
        "approval": res
    }

@router.get("/telemetry/ai-gateway")
async def get_ai_gateway_telemetry():
    """Get real-time token tracking, API cost, latency and LLM request audit logs"""
    return ai_gateway.get_telemetry()
