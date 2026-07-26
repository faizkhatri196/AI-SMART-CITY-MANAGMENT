"use client";

import React from "react";
import { Flame } from "lucide-react";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";

export default function DisasterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-alertRed" />
            <span>REAL CITY SCENARIO SIMULATION & ORCHESTRATION</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Simulate 16+ realistic city scenarios (Cyber Attack, Bridge Collapse, Airport Emergency, VIP Escort, Metro Breakdown, Marathon Crowd, Hospital Overload) with multi-agent decision graphs.
          </p>
        </div>
      </div>

      <ScenarioSimulator />
    </div>
  );
}
