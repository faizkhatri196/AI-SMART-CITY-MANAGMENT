import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    LANGSMITH_API_KEY: str = os.getenv("LANGCHAIN_API_KEY", "")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    
    DEFAULT_CITY: str = os.getenv("DEFAULT_CITY", "New York")
    CITY_LAT: float = float(os.getenv("CITY_LAT", "40.7128"))
    CITY_LON: float = float(os.getenv("CITY_LON", "-74.0060"))

settings = Settings()
