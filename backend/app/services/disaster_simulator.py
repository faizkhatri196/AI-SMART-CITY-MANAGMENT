import asyncio
import time
import logging
from typing import Dict, Any, List
from app.core.event_bus import event_bus
from app.services.memory_service import memory_service
from app.agents.department_agents import agent_orchestrator

logger = logging.getLogger("DisasterSimulator")

class DisasterSimulator:
    def __init__(self):
        self.active_disaster: Dict[str, Any] = None
        self.disaster_types = [
            "Earthquake", "Flood", "Wildfire", "Gas Leak",
            "Power Grid Collapse", "Building Collapse", "Heatwave"
        ]

    async def trigger_disaster(self, disaster_type: str, severity: int = 8, location: str = "District 4 Central") -> Dict[str, Any]:
        """Trigger a full disaster simulation with cascading multi-agent dispatches"""
        if disaster_type not in self.disaster_types:
            disaster_type = "Earthquake"

        self.active_disaster = {
            "id": f"DIS-{int(time.time())}",
            "type": disaster_type,
            "severity": severity,
            "location": location,
            "started_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "CRITICAL_ACTIVE",
            "estimated_recovery_hrs": severity * 2.5
        }

        # Log incident in Memory
        inc = memory_service.add_incident(
            title=f"Catastrophic {disaster_type} - {location}",
            department="Disaster Response AI",
            severity="CRITICAL",
            details=self.active_disaster
        )

        # Broadcast event to WebSockets
        await event_bus.broadcast_event(
            event_type="DISASTER_ALERT",
            source="Disaster Simulation Engine",
            severity="CRITICAL",
            data={
                "disaster": self.active_disaster,
                "incident": inc
            }
        )

        # Trigger emergency reasoning in relevant department agents
        asyncio.create_task(self._run_disaster_cascade_response(disaster_type, location, severity))

        return self.active_disaster

    async def _run_disaster_cascade_response(self, disaster_type: str, location: str, severity: int):
        await asyncio.sleep(1.0)
        
        # Disaster AI handles initial assessment
        disaster_agent = agent_orchestrator.agents.get("disaster")
        if disaster_agent:
            await disaster_agent.execute_reasoning_cycle({
                "task": f"EVACUATION & CASUALTY PREVENTION FOR {disaster_type.upper()}",
                "location": location,
                "severity": severity
            })

        await asyncio.sleep(1.5)
        # Dispatch Fire & Police
        fire_agent = agent_orchestrator.agents.get("fire")
        police_agent = agent_orchestrator.agents.get("police")
        if fire_agent:
            await fire_agent.execute_reasoning_cycle({"task": f"Suppress hazards at {location}"})
        if police_agent:
            await police_agent.execute_reasoning_cycle({"task": f"Establish 1km perimeter and clear emergency lanes at {location}"})

        await asyncio.sleep(1.5)
        # Hospital & Traffic AI response
        hospital_agent = agent_orchestrator.agents.get("hospital")
        traffic_agent = agent_orchestrator.agents.get("traffic")
        if hospital_agent:
            await hospital_agent.execute_reasoning_cycle({"task": f"Prepare Level 1 Trauma Units for incoming casualties from {location}"})
        if traffic_agent:
            await traffic_agent.execute_reasoning_cycle({"task": f"Set express signal priority for ambulances heading to {location}"})

    def resolve_disaster(self) -> Dict[str, Any]:
        if self.active_disaster:
            self.active_disaster["status"] = "CONTAINED"
            self.active_disaster["ended_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
            res = self.active_disaster
            self.active_disaster = None
            return res
        return {"status": "NO_ACTIVE_DISASTER"}

disaster_simulator = DisasterSimulator()
