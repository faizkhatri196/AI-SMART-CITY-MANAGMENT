import time
from typing import Dict, Any, List

class MemoryService:
    def __init__(self):
        # Long-term knowledge base & incident history
        self.incidents: List[Dict[str, Any]] = [
            {
                "id": "INC-8901",
                "title": "Grid Substation Overload - District 4",
                "department": "Power Grid AI",
                "severity": "CRITICAL",
                "status": "RESOLVED",
                "timestamp": "2026-07-26 10:14:00",
                "resolution": "Rerouted 15MW solar capacity to prevent cascading brownout."
            },
            {
                "id": "INC-8902",
                "title": "Water Pipeline Pressure Drop",
                "department": "Water AI",
                "severity": "WARNING",
                "status": "MONITORING",
                "timestamp": "2026-07-26 12:30:00",
                "resolution": "Pressure relief valve #3 adjusted automatically."
            }
        ]
        self.knowledge_graph: Dict[str, List[str]] = {
            "Hospital_StJude": ["Ambulance_Bay_1", "ICU_Block_B", "Helipad_North"],
            "Power_Substation_4": ["District_4_Residential", "Transit_Line_Red"],
            "Fire_Station_12": ["Downtown_Expressway", "Commercial_Tower_A"]
        }

    def add_incident(self, title: str, department: str, severity: str, details: Dict[str, Any]) -> Dict[str, Any]:
        inc = {
            "id": f"INC-{len(self.incidents) + 8903}",
            "title": title,
            "department": department,
            "severity": severity,
            "status": "ACTIVE",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "details": details
        }
        self.incidents.append(inc)
        return inc

    def get_active_incidents(self) -> List[Dict[str, Any]]:
        return [i for i in self.incidents if i["status"] == "ACTIVE"]

    def search_memory(self, query: str) -> List[Dict[str, Any]]:
        q_lower = query.lower()
        results = []
        for inc in self.incidents:
            if q_lower in inc["title"].lower() or q_lower in inc["department"].lower() or q_lower in inc["severity"].lower():
                results.append(inc)
        return results

memory_service = MemoryService()
