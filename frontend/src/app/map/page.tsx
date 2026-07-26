"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Layers } from "lucide-react";

const LiveMap = dynamic(() => import("@/components/LiveMap").then((m) => m.LiveMap), { ssr: false });

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyanGlow" />
            <span>2D INTERACTIVE GIS COMMAND MAP</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time geospatial vector layers for traffic flow, police units, hospitals, and environmental AQI heatmaps.
          </p>
        </div>
      </div>

      <div className="w-full h-[75vh]">
        <LiveMap />
      </div>
    </div>
  );
}
