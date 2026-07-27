"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Box, 
  MapPin, 
  Bot, 
  Flame, 
  UserCheck, 
  Activity,
  Navigation
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Location Intelligence", href: "/", icon: Navigation },
    { label: "3D Digital Twin", href: "/digital-twin", icon: Box },
    { label: "2D Live GIS Map", href: "/map", icon: MapPin },
    { label: "Multi-Agent AI", href: "/agents", icon: Bot },
    { label: "Disaster Sandbox", href: "/disaster", icon: Flame },
    { label: "Citizen SOS Portal", href: "/citizen", icon: UserCheck },
    { label: "Observability & AI", href: "/observability", icon: Activity },
  ];

  return (
    <aside className="hidden lg:flex w-64 glass-panel border-r border-white/10 flex-col justify-between py-4 px-3 shrink-0 min-h-[calc(100vh-4rem)] font-mono text-xs">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] uppercase text-gray-400 tracking-wider">
          System Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyanGlow/20 to-blueGlow/20 text-cyanGlow border border-cyanGlow/40 shadow-lg shadow-cyanGlow/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyanGlow" : "text-gray-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 glass-panel-glow rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between text-gray-300">
          <span>Active Agents:</span>
          <span className="font-mono text-cyanGlow font-bold">9/9</span>
        </div>
        <div className="flex items-center justify-between text-gray-300">
          <span>Safety Net:</span>
          <span className="font-mono text-emerald-400 font-bold">ENABLED</span>
        </div>
      </div>
    </aside>
  );
};
