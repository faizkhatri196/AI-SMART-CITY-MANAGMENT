"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldAlert, Cpu, Radio } from "lucide-react";
import { GlobalAISearch } from "@/components/GlobalAISearch";

interface NavbarProps {
  activeIncidentsCount?: number;
  pendingApprovalsCount?: number;
  onSelectLocation?: (loc: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeIncidentsCount = 0,
  pendingApprovalsCount = 0,
  onSelectLocation,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 w-full glass-panel border-b border-white/10 flex items-center justify-between px-6 z-40 sticky top-0 gap-4">
      {/* Brand & System Status */}
      <div className="flex items-center space-x-4 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyanGlow to-blueGlow flex items-center justify-center shadow-lg shadow-cyanGlow/20">
            <Cpu className="w-5 h-5 text-darkBg" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyanGlow via-blueGlow to-white">
              CITYVERSE AI
            </h1>
            <p className="text-[10px] text-cyan-400/80 tracking-widest uppercase font-mono">
              AUTONOMOUS CITY OS v1.0
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-emerald-400 font-mono">ONLINE</span>
        </div>
      </div>

      {/* Center Global AI Search Bar */}
      <div className="flex-1 flex justify-center max-w-xl">
        <GlobalAISearch onSelectLocation={onSelectLocation} />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4 shrink-0">
        {pendingApprovalsCount > 0 && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono animate-bounce cursor-pointer">
            <ShieldAlert className="w-4 h-4" />
            <span>{pendingApprovalsCount} Safety Overrides</span>
          </div>
        )}

        <div className="hidden sm:flex items-center space-x-2 bg-darkBg/60 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-cyan-300">
          <span>{timeStr || "16:55:00"}</span>
        </div>
      </div>
    </header>
  );
};
