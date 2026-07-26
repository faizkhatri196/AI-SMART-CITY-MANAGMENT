import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import router as api_router
from app.api.websocket import ws_router
from app.services.live_data_service import live_data_service
from app.core.event_bus import event_bus

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("CityVerseApp")

async def background_telemetry_loop():
    """Background task to fetch live telemetry and broadcast every 10 seconds"""
    logger.info("Starting background city telemetry broadcaster loop...")
    while True:
        try:
            city_state = await live_data_service.get_city_state()
            await event_bus.broadcast_event(
                event_type="TELEMETRY_UPDATE",
                source="City Sensors",
                data=city_state
            )
        except Exception as e:
            logger.warning(f"Error in telemetry loop: {e}")
        await asyncio.sleep(10.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Launch background telemetry loop
    telemetry_task = asyncio.create_task(background_telemetry_loop())
    yield
    # Shutdown
    telemetry_task.cancel()

app = FastAPI(
    title="CityVerse AI - Autonomous Smart City Operating System API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(ws_router)

@app.get("/")
def root_status():
    return {
        "system": "CityVerse AI - Autonomous Smart City Operating System",
        "status": "ONLINE",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
