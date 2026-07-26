"use client";

import React, { useEffect, useState } from "react";
import { Activity, Cpu, DollarSign, Clock, ShieldCheck, Terminal, Server } from "lucide-react";
import { fetchAIGatewayTelemetry } from "@/lib/api";

export default function ObservabilityPage() {
  const [telemetry, setTelemetry] = useState<any>(null);

  const loadTelemetry = async () => {
    const res = await fetchAIGatewayTelemetry();
    if (res) setTelemetry(res);
  };

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyanGlow" />
            <span>AI GATEWAY & ENTERPRISE OBSERVABILITY</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time multi-LLM telemetry, model failover tracking, token consumption auditor, and latency metrics.
          </p>
        </div>
      </div>

      {/* Gateway Metric Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyanGlow/20 flex items-center justify-center text-cyanGlow border border-cyanGlow/40">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase block">TOTAL API CALLS</span>
            <p className="text-2xl font-bold text-white">{telemetry?.total_calls ?? 0}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blueGlow/20 flex items-center justify-center text-blueGlow border border-blueGlow/40">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase block">TOTAL TOKENS AUDITED</span>
            <p className="text-2xl font-bold text-white">{telemetry?.total_tokens_used ?? 0}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase block">ESTIMATED API COST</span>
            <p className="text-2xl font-bold text-emerald-400">${telemetry?.total_cost_usd ?? "0.00000"}</p>
          </div>
        </div>
      </div>

      {/* Active LLM Provider Status Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h2 className="text-sm font-mono font-bold text-gray-200 uppercase tracking-wider">
          Configured LLM Gateway Providers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-darkBg/60 p-4 rounded-xl border border-cyanGlow/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-cyanGlow font-bold">GROQ GATEWAY</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">ACTIVE</span>
            </div>
            <p className="text-gray-300">Model: llama-3.3-70b-versatile</p>
            <p className="text-[10px] text-gray-400">Key: gsk_1FRErs... (Configured)</p>
          </div>

          <div className="bg-darkBg/60 p-4 rounded-xl border border-blueGlow/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-blueGlow font-bold">GEMINI GATEWAY</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">ACTIVE</span>
            </div>
            <p className="text-gray-300">Model: gemini-1.5-flash</p>
            <p className="text-[10px] text-gray-400">Key: AQ.Ab8RN6... (Configured)</p>
          </div>

          <div className="bg-darkBg/60 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-amber-400 font-bold">SMART RULE ENGINE</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px]">STANDBY</span>
            </div>
            <p className="text-gray-300">Model: smart_rule_v1</p>
            <p className="text-[10px] text-gray-400">Zero-latency fallback</p>
          </div>
        </div>
      </div>

      {/* Recent LLM Execution Logs */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h2 className="text-sm font-mono font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyanGlow" />
          <span>Recent Gateway Request Logs</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-gray-300">
            <thead className="text-[10px] uppercase text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3">Tokens</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Cost USD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {telemetry?.recent_logs?.map((log: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 text-gray-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-bold text-cyanGlow">{log.provider}</td>
                  <td className="py-2.5 px-3">{log.model}</td>
                  <td className="py-2.5 px-3">{log.tokens}</td>
                  <td className="py-2.5 px-3 text-amber-300">{log.latency_sec}s</td>
                  <td className="py-2.5 px-3 text-emerald-400">${log.cost_usd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
