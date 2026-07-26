"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Box, Sun, Moon, Eye, ShieldAlert } from "lucide-react";

const DigitalTwin3D = dynamic(() => import("@/components/DigitalTwin3D").then((m) => m.DigitalTwin3D), { ssr: false });

export default function DigitalTwinPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-cyanGlow" />
            <span>3D CITY DIGITAL TWIN ENGINE</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time three-dimensional spatial rendering of infrastructure blocks, alert meshes, and thermal metrics.
          </p>
        </div>
      </div>

      <div className="w-full h-[70vh]">
        <DigitalTwin3D />
      </div>
    </div>
  );
}
