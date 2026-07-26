import time
import random
import asyncio
from typing import Dict, Any, List
from app.core.event_bus import event_bus
from app.core.ai_gateway import ai_gateway

class ScenarioEngine:
    def __init__(self):
        self.scenarios = {
            "major_accident": {"title": "Multi-Vehicle Expressway Collision", "dept_lead": "Traffic AI", "risk": "HIGH"},
            "fire_outbreak": {"title": "High-Rise Commercial Fire Outbreak", "dept_lead": "Fire AI", "risk": "CRITICAL"},
            "flood": {"title": "Reservoir Dike Breach & Flash Flood", "dept_lead": "Water AI", "risk": "CRITICAL"},
            "earthquake": {"title": "Magnitude 6.8 Fault Rupture", "dept_lead": "Disaster AI", "risk": "CRITICAL"},
            "bridge_collapse": {"title": "Structural Failure on Harbor Bridge", "dept_lead": "Disaster AI", "risk": "CRITICAL"},
            "gas_leak": {"title": "Methane Pipeline Rupture Sector 4", "dept_lead": "Fire AI", "risk": "HIGH"},
            "power_outage": {"title": "Substation 4 Transformer Cascade Outage", "dept_lead": "Power AI", "risk": "HIGH"},
            "cyber_attack": {"title": "Ransomware Targeting Grid & Traffic Signals", "dept_lead": "Cybersecurity AI", "risk": "CRITICAL"},
            "traffic_congestion": {"title": "Gridlock at Midtown Express Interchange", "dept_lead": "Traffic AI", "risk": "MODERATE"},
            "vip_movement": {"title": "UN General Assembly Presidential Motorcade", "dept_lead": "Police AI", "risk": "MODERATE"},
            "festival_crowd": {"title": "Mass Gathering - 250,000 People at Central Park", "dept_lead": "Citizen AI", "risk": "MODERATE"},
            "marathon": {"title": "City International Marathon Route Closure", "dept_lead": "Traffic AI", "risk": "LOW"},
            "heavy_rainfall": {"title": "Torrential Downpour (120mm/hr)", "dept_lead": "Weather AI", "risk": "HIGH"},
            "metro_breakdown": {"title": "Line 4 Traction Substation Breakdown", "dept_lead": "Traffic AI", "risk": "HIGH"},
            "airport_emergency": {"title": "Runway Gear Emergency Landing - JFK Airport", "dept_lead": "Fire AI", "risk": "CRITICAL"},
            "hospital_overload": {"title": "Trauma Capacity Surge - St. Jude Hospital", "dept_lead": "Hospital AI", "risk": "HIGH"},
            "pandemic_outbreak": {"title": "Pathogen Airborne Outbreak Advisory", "dept_lead": "Hospital AI", "risk": "CRITICAL"}
        }

    async def execute_scenario(
        self,
        scenario_key: str,
        severity: int = 8,
        location: str = "Central District 4"
    ) -> Dict[str, Any]:
        info = self.scenarios.get(scenario_key, self.scenarios["major_accident"])
        title = info["title"]
        start_time = time.strftime("%H:%M:%S")

        # Multi-Department Agent Cascade Pipeline
        prompt = (
            f"Run a multi-agent scenario simulation for event: '{title}' ({scenario_key}) at location '{location}'.\n"
            f"Severity: {severity}/10. Department Lead: {info['dept_lead']}.\n"
            f"Generate a step-by-step 4-stage coordinated decision workflow across Traffic, Police, Fire, Hospital, Power, and Citizen AI agents."
        )

        ai_res = await ai_gateway.generate_response(prompt=prompt, system_prompt="You are the CityVerse AI Master Scenario Orchestrator.")
        ai_reasoning = ai_res["content"]

        # Calculate Financial & Resource Metrics
        financial_loss_usd = severity * 145000 + random.randint(10000, 50000)
        recovery_hours = round(severity * 1.8 + random.uniform(0.5, 2.0), 1)
        
        # Build Decision Tree Graph
        nodes = [
            {"id": "n1", "label": f"Detection: {title}", "type": "EVENT", "status": "RESOLVED"},
            {"id": "n2", "label": "Traffic AI Express Lane Cleared", "type": "ACTION", "status": "ACTIVE"},
            {"id": "n3", "label": "Fire & Police Perimeter Secured", "type": "ACTION", "status": "ACTIVE"},
            {"id": "n4", "label": "Hospital Trauma Bed Reservation", "type": "ACTION", "status": "ACTIVE"},
            {"id": "n5", "label": "Citizen SOS Advisory Stream", "type": "NOTIFICATION", "status": "ACTIVE"}
        ]
        edges = [
            {"from": "n1", "to": "n2"},
            {"from": "n1", "to": "n3"},
            {"from": "n2", "to": "n4"},
            {"from": "n3", "to": "n5"}
        ]

        # Timeline Steps
        timeline = [
            {"time": "00:00s", "agent": info["dept_lead"], "action": f"Detected {title} anomaly. Sensor threshold exceeded."},
            {"time": "00:05s", "agent": "Traffic AI", "action": "Re-routed 14 bus routes and opened express emergency lane."},
            {"time": "00:12s", "agent": "Police & Fire AI", "action": "Dispatched 6 patrol units and 3 rescue engines."},
            {"time": "00:20s", "agent": "Hospital AI", "action": "Reserved 12 Level 1 ICU trauma beds at Metro General."},
            {"time": "00:30s", "agent": "Citizen AI", "action": "Pushed geo-fenced emergency warning to 45,000 citizens."}
        ]

        result = {
            "scenario_id": f"SCN-{int(time.time())}",
            "scenario_key": scenario_key,
            "title": title,
            "severity": severity,
            "location": location,
            "timestamp": start_time,
            "dept_lead": info["dept_lead"],
            "risk_level": info["risk"],
            "ai_reasoning": ai_reasoning,
            "estimated_recovery_hours": recovery_hours,
            "financial_impact_usd": financial_loss_usd,
            "resource_allocations": {
                "police_units_dispatched": min(35, severity * 4),
                "fire_engines_dispatched": min(18, severity * 2),
                "ambulances_assigned": min(15, severity * 2),
                "icu_beds_reserved": min(30, severity * 3),
                "power_rerouted_mw": severity * 12.5
            },
            "decision_graph": {"nodes": nodes, "edges": edges},
            "timeline": timeline
        }

        # Broadcast scenario launch over Event Bus
        await event_bus.broadcast_event(
            event_type="SCENARIO_LAUNCH",
            source="Scenario Engine",
            severity="CRITICAL" if severity >= 7 else "WARNING",
            data=result
        )

        return result

scenario_engine = ScenarioEngine()
