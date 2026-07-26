import time
import json
import logging
import httpx
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger("AIGateway")

class AIGateway:
    def __init__(self):
        self.groq_api_key = settings.GROQ_API_KEY
        self.gemini_api_key = settings.GEMINI_API_KEY
        
        # Telemetry storage
        self.total_tokens_used = 0
        self.total_calls = 0
        self.total_cost_usd = 0.0
        self.request_logs: List[Dict[str, Any]] = []

    async def generate_response(
        self,
        prompt: str,
        system_prompt: str = "You are an AI Smart City Autonomous Agent.",
        provider_preference: str = "groq",
        temperature: float = 0.3
    ) -> Dict[str, Any]:
        start_time = time.time()
        self.total_calls += 1
        
        providers = [provider_preference, "groq", "gemini", "fallback"]
        # Deduplicate preserving order
        unique_providers = []
        for p in providers:
            if p not in unique_providers:
                unique_providers.append(p)
                
        last_error = None
        for provider in unique_providers:
            try:
                if provider == "groq" and self.groq_api_key:
                    res = await self._call_groq(prompt, system_prompt, temperature)
                    elapsed = round(time.time() - start_time, 3)
                    self._record_telemetry("groq", res["model"], res["tokens"], res["cost"], elapsed, True)
                    return {
                        "content": res["content"],
                        "provider": "groq",
                        "model": res["model"],
                        "latency_sec": elapsed,
                        "tokens": res["tokens"],
                        "cost": res["cost"]
                    }
                elif provider == "gemini" and self.gemini_api_key:
                    res = await self._call_gemini(prompt, system_prompt, temperature)
                    elapsed = round(time.time() - start_time, 3)
                    self._record_telemetry("gemini", res["model"], res["tokens"], res["cost"], elapsed, True)
                    return {
                        "content": res["content"],
                        "provider": "gemini",
                        "model": res["model"],
                        "latency_sec": elapsed,
                        "tokens": res["tokens"],
                        "cost": res["cost"]
                    }
            except Exception as e:
                logger.warning(f"AI Gateway provider {provider} failed: {e}. Trying fallback...")
                last_error = str(e)
                
        # Rule-based / Analytical Fallback execution
        elapsed = round(time.time() - start_time, 3)
        fallback_content = self._rule_based_fallback(prompt, system_prompt)
        tokens = len(prompt.split()) + len(fallback_content.split())
        self._record_telemetry("rule_fallback", "smart_rule_v1", tokens, 0.0, elapsed, True)
        
        return {
            "content": fallback_content,
            "provider": "rule_fallback",
            "model": "smart_rule_engine_v1",
            "latency_sec": elapsed,
            "tokens": tokens,
            "cost": 0.0,
            "note": f"Fallback activated due to API limit/error: {last_error}" if last_error else "Autonomous Rule Engine"
        }

    async def _call_groq(self, prompt: str, system_prompt: str, temperature: float) -> Dict[str, Any]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": temperature,
            "max_tokens": 1024
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                tokens = data.get("usage", {}).get("total_tokens", len(content.split()))
                cost = (tokens / 1000) * 0.0006  # Approx Groq Llama pricing
                return {
                    "content": content,
                    "model": "llama-3.3-70b-versatile",
                    "tokens": tokens,
                    "cost": round(cost, 6)
                }
            else:
                raise RuntimeError(f"Groq HTTP {resp.status_code}: {resp.text}")

    async def _call_gemini(self, prompt: str, system_prompt: str, temperature: float) -> Dict[str, Any]:
        # Using standard HTTP for REST fallback or Google GenAI API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"System Directive: {system_prompt}\n\nTask:\n{prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": 1024
            }
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                tokens = len(prompt.split()) + len(content.split())
                cost = (tokens / 1000) * 0.00015
                return {
                    "content": content,
                    "model": "gemini-1.5-flash",
                    "tokens": tokens,
                    "cost": round(cost, 6)
                }
            else:
                raise RuntimeError(f"Gemini HTTP {resp.status_code}: {resp.text}")

    def _rule_based_fallback(self, prompt: str, system_prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "traffic" in prompt_lower or "congestion" in prompt_lower:
            return "DECISION: Adjust traffic signal timers at North Corridor to 90s green light. Reroute emergency vehicles through 5th Ave express lane."
        elif "fire" in prompt_lower or "gas leak" in prompt_lower:
            return "DECISION: Dispatch Fire Engine Units 4 & 7 immediately. Trigger 500m evacuation perimeter and alert nearest Hospital ICU."
        elif "hospital" in prompt_lower or "bed" in prompt_lower:
            return "DECISION: Reserve 12 ICU beds at St. Jude Central Hospital. Re-route non-critical ambulances to Metro General Ward."
        elif "power" in prompt_lower or "blackout" in prompt_lower:
            return "DECISION: Isolate faulty Substation #4. Reroute 12MW solar grid capacity to Downtown District hospitals and transit hubs."
        elif "weather" in prompt_lower or "aqi" in prompt_lower:
            return "DECISION: High AQI advisory issued for Central Park Zone. Activate smog mist cannons and issue automated citizen health alerts."
        else:
            return "DECISION: CityVerse Autonomous Engine evaluated sensor streams. Operations optimal with standard safety protocols active."

    def _record_telemetry(self, provider: str, model: str, tokens: int, cost: float, latency: float, success: bool):
        self.total_tokens_used += tokens
        self.total_cost_usd += cost
        log_entry = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "provider": provider,
            "model": model,
            "tokens": tokens,
            "cost_usd": round(cost, 6),
            "latency_sec": latency,
            "success": success
        }
        self.request_logs.append(log_entry)
        if len(self.request_logs) > 200:
            self.request_logs.pop(0)

    def get_telemetry(self) -> Dict[str, Any]:
        return {
            "total_calls": self.total_calls,
            "total_tokens_used": self.total_tokens_used,
            "total_cost_usd": round(self.total_cost_usd, 5),
            "recent_logs": self.request_logs[-20:],
            "active_models": [
                {"provider": "groq", "model": "llama-3.3-70b-versatile", "status": "active"},
                {"provider": "gemini", "model": "gemini-1.5-flash", "status": "active"},
                {"provider": "rule_engine", "model": "smart_rule_v1", "status": "standby"}
            ]
        }

ai_gateway = AIGateway()
