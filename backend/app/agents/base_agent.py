import asyncio
import time
import logging
from typing import Dict, Any, List, Callable
from app.core.ai_gateway import ai_gateway
from app.core.event_bus import event_bus
from app.core.security import human_approval_manager

logger = logging.getLogger("BaseAgent")

class BaseAgent:
    def __init__(self, name: str, department: str, system_prompt: str, critical_action_requires_human: bool = False):
        self.name = name
        self.department = department
        self.system_prompt = system_prompt
        self.critical_action_requires_human = critical_action_requires_human
        
        self.status = "ONLINE"
        self.health_score = 100
        self.tasks_completed = 0
        self.memory: List[Dict[str, Any]] = []
        self.execution_logs: List[Dict[str, Any]] = []
        self.tools: Dict[str, Callable] = {}

    def register_tool(self, tool_name: str, tool_func: Callable):
        self.tools[tool_name] = tool_func

    def log(self, level: str, message: str, details: Dict[str, Any] = None):
        entry = {
            "timestamp": time.strftime("%H:%M:%S"),
            "agent": self.name,
            "department": self.department,
            "level": level,
            "message": message,
            "details": details or {}
        }
        self.execution_logs.append(entry)
        if len(self.execution_logs) > 100:
            self.execution_logs.pop(0)

    async def execute_reasoning_cycle(self, input_context: Dict[str, Any]) -> Dict[str, Any]:
        """Runs Planner -> Reasoning -> Memory Retrieval -> Tool Selection -> Action"""
        self.log("INFO", f"Initiating autonomous reasoning cycle for task: {input_context.get('task', 'Routine Optimization')}")
        
        prompt = (
            f"Agent: {self.name} ({self.department})\n"
            f"Current City Sensor Input:\n{input_context}\n"
            f"Formulate a plan, select tools if needed, and make an autonomous tactical decision."
        )
        
        # Call AI Gateway
        ai_res = await ai_gateway.generate_response(prompt=prompt, system_prompt=self.system_prompt)
        decision = ai_res["content"]
        
        # Store in Agent Memory
        mem_entry = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "context": input_context,
            "decision": decision,
            "provider": ai_res.get("provider", "unknown")
        }
        self.memory.append(mem_entry)
        self.tasks_completed += 1
        
        # Check human approval requirement for high-risk decisions
        requires_human = False
        approval_req = None
        if self.critical_action_requires_human and ("evacuate" in decision.lower() or "blackout" in decision.lower() or "swat" in decision.lower()):
            requires_human = True
            approval_req = human_approval_manager.request_approval(
                agent_name=self.name,
                action="Critical City Directive",
                reason=decision,
                risk_level="HIGH"
            )
            self.log("WARNING", f"Action flagged for Human Safety Approval ID: {approval_req['id']}")
            
        # Broadcast decision over Event Bus
        await event_bus.broadcast_event(
            event_type="AGENT_DECISION",
            source=self.name,
            severity="WARNING" if requires_human else "INFO",
            data={
                "department": self.department,
                "decision": decision,
                "requires_human": requires_human,
                "approval_id": approval_req["id"] if approval_req else None,
                "ai_telemetry": {
                    "provider": ai_res.get("provider"),
                    "latency": ai_res.get("latency_sec"),
                    "tokens": ai_res.get("tokens")
                }
            }
        )
        
        return {
            "agent": self.name,
            "department": self.department,
            "status": "AWAITING_APPROVAL" if requires_human else "EXECUTED",
            "decision": decision,
            "requires_human_approval": requires_human,
            "approval_req": approval_req
        }

    def get_status(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "department": self.department,
            "status": self.status,
            "health_score": self.health_score,
            "tasks_completed": self.tasks_completed,
            "recent_logs": self.execution_logs[-10:],
            "tools_count": len(self.tools)
        }
