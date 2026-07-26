"use client";

import React from "react";
import { Bot, CheckCircle2, ShieldCheck, Terminal, Cpu } from "lucide-react";

interface AgentCardProps {
  name: string;
  department: string;
  status: string;
  healthScore: number;
  tasksCompleted: number;
  latestLog?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  department,
  status,
  healthScore,
  tasksCompleted,
  latestLog,
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyanGlow/40 transition-all duration-300 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyanGlow/20 to-blueGlow/20 flex items-center justify-center border border-cyanGlow/30">
            <Bot className="w-5 h-5 text-cyanGlow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">{name}</h3>
            <p className="text-[11px] text-gray-400">{department}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-darkBg/50 p-2.5 rounded-xl border border-white/5">
        <div>
          <span className="text-gray-400 block text-[10px]">HEALTH METRIC</span>
          <span className="text-emerald-400 font-bold">{healthScore}% OPTIMAL</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px]">TASKS COMPLETED</span>
          <span className="text-cyanGlow font-bold">{tasksCompleted} CYCLES</span>
        </div>
      </div>

      {latestLog && (
        <div className="bg-darkBg/80 p-2.5 rounded-xl border border-white/5 text-[11px] font-mono text-gray-300 flex items-start space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyanGlow mt-0.5 shrink-0" />
          <p className="line-clamp-2 leading-relaxed">{latestLog}</p>
        </div>
      )}
    </div>
  );
};
