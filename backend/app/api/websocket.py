from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.event_bus import event_bus

ws_router = APIRouter()

@ws_router.websocket("/ws/city")
async def city_websocket_endpoint(websocket: WebSocket):
    await event_bus.connect(websocket)
    try:
        # Send initial recent events snapshot
        recent = event_bus.get_recent_events(limit=20)
        await websocket.send_json({
            "event_type": "SNAPSHOT",
            "source": "CityVerse Telemetry",
            "data": {"recent_events": recent}
        })
        
        while True:
            # Keep connection open and receive client heartbeats/messages
            data = await websocket.receive_text()
            # Respond to ping
            if data == "ping":
                await websocket.send_json({"event_type": "PONG"})
    except WebSocketDisconnect:
        event_bus.disconnect(websocket)
    except Exception as e:
        event_bus.disconnect(websocket)
