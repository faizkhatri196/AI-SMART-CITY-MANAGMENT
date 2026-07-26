"use client";

import React, { useEffect, useState } from "react";
import { Bot, Play, RefreshCw, Terminal, CheckCircle2 } from "lucide-react";
import { fetchAgentsStatus, triggerAgentsCycle } from "@/lib/api";
import { AgentCard } from "@/components/AgentCard";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadAgents = async () => {
    const res = await fetchAgentsStatus();
    if (res?.agents) setAgents(res.agents);
  };

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRun = async () => {
    setLoading(true);
    await triggerAgentsCycle();
    await loadAgents();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyanGlow" />
            <span>MULTI-AGENT AI SYMPHONY & ORCHESTRATION</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Autonomous departmental agents operating with reasoning loops, tool calling, and structured JSON event memory.
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="bg-gradient-to-r from-cyanGlow to-blueGlow hover:from-cyan-400 hover:to-blue-500 text-darkBg font-bold py-2.5 px-5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-cyanGlow/20"
        >
          <Play className="w-4 h-4 fill-darkBg" />
          <span>RUN SYMPHONY CYCLE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
