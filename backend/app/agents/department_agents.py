import asyncio
import random
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class TrafficAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Traffic AI Core",
            department="Traffic & Transport",
            system_prompt="You are Traffic AI, autonomous controller of city signals, transit routing, accident rerouting, and congestion optimization."
        )

class PoliceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Police AI Sentinel",
            department="Police & Security",
            system_prompt="You are Police AI, coordinator of patrol dispatches, security alerts, emergency corridors, and law enforcement units.",
            critical_action_requires_human=True
        )

class FireAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Fire & Rescue AI",
            department="Fire Department",
            system_prompt="You are Fire AI, coordinator of station dispatches, hazard mitigation, building collapses, and thermal suppression."
        )

class HospitalAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Hospital Network AI",
            department="Healthcare & Emergency",
            system_prompt="You are Hospital AI, managing ICU bed allocations, emergency trauma routing, ambulance dispatches, and medical supplies."
        )

class DisasterAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Disaster Response AI",
            department="Emergency & Catastrophe Management",
            system_prompt="You are Disaster Response AI. You analyze multi-hazard catastrophic events (earthquakes, floods, gas leaks, wildfires) and orchestrate multi-department dispatches.",
            critical_action_requires_human=True
        )

class PowerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Power Grid AI",
            department="Energy & Power",
            system_prompt="You are Power Grid AI. You monitor transformer thermal loads, solar/wind balance, battery storage, and blackout prevention."
        )

class WaterAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Water Management AI",
            department="Water & Utilities",
            system_prompt="You are Water AI. You monitor reservoir capacity, water purity indices, pipeline leak detection, and flood drainage pumps."
        )

class WeatherAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Weather & Environment AI",
            department="Environmental Intelligence",
            system_prompt="You are Weather & Environment AI. You process live meteorological feeds, AQI metrics, storm surges, and smog advisories."
        )

class CitizenAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Citizen Support AI",
            department="Civic Services",
            system_prompt="You are Citizen Support AI. You triage public grievances, pothole reports, water outages, and citizen SOS emergency requests."
        )

# Agent Registry Instance
class AgentOrchestrator:
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {
            "traffic": TrafficAgent(),
            "police": PoliceAgent(),
            "fire": FireAgent(),
            "hospital": HospitalAgent(),
            "disaster": DisasterAgent(),
            "power": PowerAgent(),
            "water": WaterAgent(),
            "weather": WeatherAgent(),
            "citizen": CitizenAgent()
        }

    def get_all_statuses(self) -> List[Dict[str, Any]]:
        return [agent.get_status() for agent in self.agents.values()]

    async def run_city_optimization_cycle(self, city_sensor_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Trigger parallel reasoning cycles across all agents"""
        results = []
        for name, agent in self.agents.items():
            res = await agent.execute_reasoning_cycle({
                "task": "Routine Departmental Optimization",
                "city_data": city_sensor_data
            })
            results.append(res)
        return results

agent_orchestrator = AgentOrchestrator()
