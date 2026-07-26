import asyncio
import json
import logging
import time
from typing import Set, Dict, Any, List
from fastapi import WebSocket

logger = logging.getLogger("EventBus")

class EventBus:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.recent_events: List[Dict[str, Any]] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast_event(self, event_type: str, source: str, data: Dict[str, Any], severity: str = "INFO"):
        event = {
            "id": f"evt_{int(time.time() * 1000)}",
            "timestamp": time.strftime("%H:%M:%S"),
            "event_type": event_type,
            "source": source,
            "severity": severity,
            "data": data
        }
        self.recent_events.append(event)
        if len(self.recent_events) > 100:
            self.recent_events.pop(0)

        dead_connections = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(event)
            except Exception as e:
                logger.warning(f"Error sending WebSocket event: {e}")
                dead_connections.add(connection)
                
        for dead in dead_connections:
            self.disconnect(dead)

    def get_recent_events(self, limit: int = 30) -> List[Dict[str, Any]]:
        return self.recent_events[-limit:]

event_bus = EventBus()
