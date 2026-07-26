import time
from typing import Dict, Any, List, Optional

class HumanApprovalManager:
    def __init__(self):
        self.pending_approvals: List[Dict[str, Any]] = []

    def request_approval(
        self,
        agent_name: str,
        action: str,
        reason: str,
        risk_level: str = "HIGH",
        payload: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        req_id = f"APPR-{int(time.time() * 1000)}"
        req = {
            "id": req_id,
            "agent_name": agent_name,
            "action": action,
            "reason": reason,
            "risk_level": risk_level,
            "payload": payload or {},
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "PENDING"
        }
        self.pending_approvals.append(req)
        return req

    def process_approval(self, req_id: str, approved: bool, user_comment: str = "") -> Optional[Dict[str, Any]]:
        for req in self.pending_approvals:
            if req["id"] == req_id:
                req["status"] = "APPROVED" if approved else "REJECTED"
                req["user_comment"] = user_comment
                req["processed_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
                return req
        return None

    def get_pending_requests(self) -> List[Dict[str, Any]]:
        return [r for r in self.pending_approvals if r["status"] == "PENDING"]

human_approval_manager = HumanApprovalManager()
