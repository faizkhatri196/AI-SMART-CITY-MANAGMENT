"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  Activity, 
  Flame, 
  CloudSun, 
  Wind, 
  ShieldAlert, 
  Hospital, 
  Zap, 
  Car, 
  Play, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react";
import { 
  fetchCityState, 
  fetchAgentsStatus, 
  triggerAgentsCycle, 
  fetchPendingApprovals, 
  processHumanApproval,
  createCityWebSocket
} from "@/lib/api";
import { AgentCard } from "@/components/AgentCard";
import { PowerGridChart, AQIBarChart } from "@/components/AnalyticsCharts";
import { HumanApprovalModal } from "@/components/HumanApprovalModal";

// Dynamic imports to disable SSR for Map and 3D Canvas
const LiveMap = dynamic(() => import("@/components/LiveMap").then((m) => m.LiveMap), { ssr: false });
const DigitalTwin3D = dynamic(() => import("@/components/DigitalTwin3D").then((m) => m.DigitalTwin3D), { ssr: false });

export default function ControlRoomPage() {
  const [cityState, setCityState] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [activeApproval, setActiveApproval] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    const cs = await fetchCityState();
    if (cs) setCityState(cs);
    const ag = await fetchAgentsStatus();
    if (ag?.agents) setAgents(ag.agents);
    const appr = await fetchPendingApprovals();
    if (appr?.pending) {
      setPendingApprovals(appr.pending);
      if (appr.pending.length > 0 && !activeApproval) {
        setActiveApproval(appr.pending[0]);
      }
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);

    // WebSocket listener for real-time alerts
    const ws = createCityWebSocket((evt) => {
      if (evt.event_type === "TELEMETRY_UPDATE") {
        setCityState(evt.data);
      } else if (evt.event_type === "AGENT_DECISION" || evt.event_type === "DISASTER_ALERT") {
        loadData();
      }
    });

    return () => {
      clearInterval(interval);
      if (ws) ws.close();
    };
  }, []);

  const handleRunCycle = async () => {
    setLoading(true);
    await triggerAgentsCycle();
    await loadData();
    setLoading(false);
  };

  const handleApprovalAction = async (id: string, approved: boolean, comment: string) => {
    await processHumanApproval(id, approved, comment);
    setActiveApproval(null);
    loadData();
  };

  const weather = cityState?.weather;
  const aqi = cityState?.air_quality;
  const traffic = cityState?.traffic;
  const emergency = cityState?.emergency_services;
  const power = cityState?.infrastructure;

  return (
    <div className="space-y-6">
      {/* Header Banner & Manual Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>CITY OPERATING ROOM & DIGITAL TWIN</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/40 font-mono">
              LIVE SENSOR FEEDS
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Autonomous multi-agent orchestration for {cityState?.city_name || "New York"}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl glass-panel text-gray-300 hover:text-white hover:border-cyanGlow/40 transition"
            title="Refresh State"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyanGlow" : ""}`} />
          </button>
          <button
            onClick={handleRunCycle}
            disabled={loading}
            className="bg-gradient-to-r from-cyanGlow to-blueGlow hover:from-cyan-400 hover:to-blue-500 text-darkBg font-bold py-2.5 px-5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-cyanGlow/20"
          >
            <Play className="w-4 h-4 fill-darkBg" />
            <span>TRIGGER AGENT REASONING CYCLE</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Weather KPI */}
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-cyanGlow">
            <CloudSun className="w-5 h-5" />
            <span className="text-[10px] font-mono text-gray-400">OPENWEATHER</span>
          </div>
          <p className="text-2xl font-bold text-white">{weather?.temp_c ?? 22.5}°C</p>
          <p className="text-[11px] text-gray-400 truncate">{weather?.weather_condition ?? "Partly Cloudy"}</p>
        </div>

        {/* AQI KPI */}
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <Wind className="w-5 h-5" />
            <span className="text-[10px] font-mono text-gray-400">OPENAQ</span>
          </div>
          <p className="text-2xl font-bold text-white">{aqi?.aqi ?? 48}</p>
          <p className="text-[11px] text-emerald-400">{aqi?.category ?? "Good AQI"}</p>
        </div>

        {/* Traffic KPI */}
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-blueGlow">
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-mono text-gray-400">TRAFFIC</span>
          </div>
          <p className="text-2xl font-bold text-white">{traffic?.avg_speed_kmh ?? 42} km/h</p>
          <p className="text-[11px] text-gray-400">Level: {traffic?.congestion_level ?? "Low"}</p>
        </div>

        {/* Power Load KPI */}
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-mono text-gray-400">GRID LOAD</span>
          </div>
          <p className="text-2xl font-bold text-white">{power?.power_grid_load_mw ?? 1420} MW</p>
          <p className="text-[11px] text-amber-400">Solar: {power?.solar_generation_mw ?? 310} MW</p>
        </div>

        {/* Hospital Capacity KPI */}
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-rose-400">
            <Hospital className="w-5 h-5" />
            <span className="text-[10px] font-mono text-gray-400">ICU BEDS</span>
          </div>
          <p className="text-2xl font-bold text-white">{emergency?.hospital_bed_capacity_pct ?? 78}%</p>
          <p className="text-[11px] text-gray-400">Ambulances: {emergency?.ambulances_deployed ?? 12}</p>
        </div>

        {/* Emergency Response KPI */}
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-alertRed">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-mono text-gray-400">POLICE & FIRE</span>
          </div>
          <p className="text-2xl font-bold text-white">{emergency?.police_patrols_active ?? 34} Units</p>
          <p className="text-[11px] text-emerald-400">Active Patrols</p>
        </div>
      </div>

      {/* Split Screen: 3D Digital Twin & 2D GIS Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[450px]">
        <div className="space-y-2">
          <h2 className="text-xs font-mono font-bold text-cyanGlow uppercase tracking-wider">
            3D Building Digital Twin
          </h2>
          <DigitalTwin3D />
        </div>
        <div className="space-y-2">
          <h2 className="text-xs font-mono font-bold text-cyanGlow uppercase tracking-wider">
            2D Interactive GIS Layer Map
          </h2>
          <LiveMap />
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
            Power Grid Substation Load vs Renewable Balance
          </h3>
          <PowerGridChart />
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
            Air Quality Index (AQI) by District Sector
          </h3>
          <AQIBarChart />
        </div>
      </div>

      {/* Active AI Agent Symphony Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyanGlow" />
            <span>Autonomous Department AI Agents ({agents.length || 9})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((ag, idx) => (
            <AgentCard
              key={idx}
              name={ag.name}
              department={ag.department}
              status={ag.status}
              healthScore={ag.health_score}
              tasksCompleted={ag.tasks_completed}
              latestLog={ag.recent_logs?.[ag.recent_logs.length - 1]?.message}
            />
          ))}
        </div>
      </div>

      {/* Human Approval Safety Override Modal */}
      {activeApproval && (
        <HumanApprovalModal
          request={activeApproval}
          onApprove={(id, comment) => handleApprovalAction(id, true, comment)}
          onReject={(id, comment) => handleApprovalAction(id, false, comment)}
        />
      )}
    </div>
  );
}
