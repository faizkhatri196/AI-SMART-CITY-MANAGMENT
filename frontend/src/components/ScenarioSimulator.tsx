"use client";

import React, { useState } from "react";
import { Flame, Play, AlertTriangle, ShieldAlert, CheckCircle2, Clock, DollarSign, Activity } from "lucide-react";
import { simulateScenario } from "@/lib/api";

export const ScenarioSimulator: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("major_accident");
  const [severity, setSeverity] = useState(8);
  const [location, setLocation] = useState("Central District 4");
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scenarioOptions = [
    { key: "major_accident", title: "Major Expressway Accident" },
    { key: "fire_outbreak", title: "High-Rise Fire Outbreak" },
    { key: "flood", title: "Reservoir Dike Flood" },
    { key: "earthquake", title: "Magnitude 6.8 Earthquake" },
    { key: "bridge_collapse", title: "Harbor Bridge Collapse" },
    { key: "gas_leak", title: "Methane Gas Pipeline Leak" },
    { key: "power_outage", title: "Substation #4 Power Blackout" },
    { key: "cyber_attack", title: "Grid & Signal Cyber Attack" },
    { key: "traffic_congestion", title: "Midtown Gridlock Congestion" },
    { key: "vip_movement", title: "Presidential Motorcade VIP Escort" },
    { key: "festival_crowd", title: "Mass Festival Crowd Surge" },
    { key: "marathon", title: "City Marathon Route Closure" },
    { key: "heavy_rainfall", title: "Torrential Downpour Flood" },
    { key: "metro_breakdown", title: "Metro Line 4 Traction Failure" },
    { key: "airport_emergency", title: "Airport Runway Gear Emergency" },
    { key: "hospital_overload", title: "Hospital ICU Capacity Surge" },
    { key: "pandemic_outbreak", title: "Pathogen Outbreak Advisory" },
  ];

  const handleLaunch = async () => {
    setLoading(true);
    const res = await simulateScenario(selectedKey, severity, location);
    if (res?.scenario) {
      setScenarioData(res.scenario);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-alertRed" />
            <span>REAL CITY SCENARIO SIMULATION ENGINE</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Simulate 16+ city events and observe multi-agent decision graphs, timeline reasoning, and resource allocation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-mono">Select City Event Scenario:</label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full bg-darkBg/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyanGlow outline-none"
            >
              {scenarioOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">SEVERITY LEVEL:</span>
              <span className="text-alertRed font-bold">{severity} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="w-full accent-alertRed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-mono">Impact Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-darkBg/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <button
            onClick={handleLaunch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/20"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>LAUNCH EVENT SIMULATION</span>
          </button>
        </div>

        {/* Results & Decision Graph Column */}
        <div className="lg:col-span-2 space-y-5">
          {scenarioData ? (
            <div className="space-y-5 font-mono text-xs animate-in fade-in duration-200">
              {/* Metric Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-darkBg/70 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">RISK LEVEL</span>
                  <span className="text-red-400 font-bold">{scenarioData.risk_level}</span>
                </div>
                <div className="bg-darkBg/70 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">EST. RECOVERY ETA</span>
                  <span className="text-amber-300 font-bold">{scenarioData.estimated_recovery_hours} Hours</span>
                </div>
                <div className="bg-darkBg/70 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">FINANCIAL LOSS</span>
                  <span className="text-emerald-400 font-bold">${scenarioData.financial_impact_usd?.toLocaleString()}</span>
                </div>
                <div className="bg-darkBg/70 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">LEAD AGENT</span>
                  <span className="text-cyanGlow font-bold">{scenarioData.dept_lead}</span>
                </div>
              </div>

              {/* Multi-Agent Reasoning Brief */}
              <div className="bg-darkBg/90 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-cyanGlow block font-bold">Multi-Agent Coordinated Reasoning Trace:</span>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {scenarioData.ai_reasoning}
                </p>
              </div>

              {/* Timeline Events */}
              <div className="space-y-2">
                <span className="text-gray-300 block font-bold text-xs uppercase">Decision Step Timeline:</span>
                <div className="space-y-2">
                  {scenarioData.timeline?.map((step: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-3 bg-darkBg/60 p-2.5 rounded-xl border border-white/5">
                      <span className="text-cyanGlow font-bold text-[10px] w-12 shrink-0">{step.time}</span>
                      <span className="text-amber-300 font-bold text-[10px] w-24 shrink-0 truncate">{step.agent}</span>
                      <p className="text-gray-300 text-[11px] truncate">{step.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 space-y-2 border border-dashed border-white/10 rounded-2xl">
              <Activity className="w-8 h-8 text-gray-600" />
              <p className="text-xs font-mono">Select a scenario on the left and click Launch Event Simulation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
