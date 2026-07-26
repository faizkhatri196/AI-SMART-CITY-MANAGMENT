const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ai-smart-city-managment.onrender.com/api/v1";
const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE || "wss://ai-smart-city-managment.onrender.com/ws/city";

export async function fetchCityState() {
  try {
    const res = await fetch(`${API_BASE}/city/state`);
    if (!res.ok) throw new Error("Failed to fetch city state");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback client state:", err);
    return null;
  }
}

export async function detectLocation(lat?: number, lon?: number, tz?: string, lang?: string) {
  try {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append("lat", lat.toString());
    if (lon !== undefined) params.append("lon", lon.toString());
    
    const clientTz = tz || (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "");
    const clientLang = lang || (typeof navigator !== "undefined" ? navigator.language : "");
    
    if (clientTz) params.append("user_tz", clientTz);
    if (clientLang) params.append("user_lang", clientLang);

    const res = await fetch(`${API_BASE}/location/detect?${params.toString()}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchRadiusIntel(lat: number, lon: number, radius_km: number = 5.0, category: string = "ALL") {
  try {
    const res = await fetch(`${API_BASE}/location/radius-intel?lat=${lat}&lon=${lon}&radius_km=${radius_km}&category=${category}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchLocationInsights(lat: number, lon: number) {
  try {
    const res = await fetch(`${API_BASE}/location/insights?lat=${lat}&lon=${lon}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSmartAlerts() {
  try {
    const res = await fetch(`${API_BASE}/location/alerts`);
    return await res.json();
  } catch (err) {
    return { alerts: [] };
  }
}

export async function globalSearch(q: string = "", category?: string) {
  try {
    const params = new URLSearchParams({ q });
    if (category) params.append("category", category);
    const res = await fetch(`${API_BASE}/search?${params.toString()}`);
    return await res.json();
  } catch (err) {
    return { results: [] };
  }
}

export async function fetchLocationSummary(loc_id: string) {
  const res = await fetch(`${API_BASE}/search/summary?loc_id=${encodeURIComponent(loc_id)}`);
  return await res.json();
}

export async function simulateScenario(scenario_key: string, severity: number = 8, location: string = "District 4") {
  const res = await fetch(`${API_BASE}/scenario/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario_key, severity, location })
  });
  return await res.json();
}

export async function sendCopilotQuery(query: string, user_lat?: number, user_lon?: number) {
  const res = await fetch(`${API_BASE}/copilot/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, user_lat, user_lon })
  });
  return await res.json();
}

export async function fetchAgentsStatus() {
  try {
    const res = await fetch(`${API_BASE}/agents/status`);
    if (!res.ok) throw new Error("Failed to fetch agents");
    return await res.json();
  } catch (err) {
    return { agents: [] };
  }
}

export async function triggerAgentsCycle() {
  const res = await fetch(`${API_BASE}/agents/run-cycle`, { method: "POST" });
  return await res.json();
}

export async function triggerDisaster(disaster_type: string, severity: number = 8, location: string = "District 4") {
  const res = await fetch(`${API_BASE}/disaster/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disaster_type, severity, location })
  });
  return await res.json();
}

export async function resolveDisaster() {
  const res = await fetch(`${API_BASE}/disaster/resolve`, { method: "POST" });
  return await res.json();
}

export async function submitCitizenSOS(name: string, location: string, type: string, description: string) {
  const res = await fetch(`${API_BASE}/citizen/sos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, location, type, description })
  });
  return await res.json();
}

export async function fetchPendingApprovals() {
  const res = await fetch(`${API_BASE}/human-approval/pending`);
  return await res.json();
}

export async function processHumanApproval(req_id: string, approved: boolean, comment: string = "") {
  const res = await fetch(`${API_BASE}/human-approval/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ req_id, approved, comment })
  });
  return await res.json();
}

export async function fetchAIGatewayTelemetry() {
  const res = await fetch(`${API_BASE}/telemetry/ai-gateway`);
  return await res.json();
}

export function createCityWebSocket(onMessage: (event: any) => void) {
  let ws: WebSocket | null = null;
  try {
    ws = new WebSocket(WS_BASE);
    ws.onopen = () => console.log("CityVerse WebSocket connected");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onMessage(data);
      } catch (err) {
        console.error("WS Parse error", err);
      }
    };
    ws.onerror = (e) => console.warn("WS error", e);
  } catch (e) {
    console.warn("Could not initiate WS connection", e);
  }
  return ws;
}
