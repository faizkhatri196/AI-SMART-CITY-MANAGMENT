"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box } from "lucide-react";
import { detectLocation } from "@/lib/api";

const DigitalTwin3D = dynamic(() => import("@/components/DigitalTwin3D").then((m) => m.DigitalTwin3D), { ssr: false });

export default function DigitalTwinPage() {
  const [userLoc, setUserLoc] = useState<any>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const details = await detectLocation(lat, lon);
          if (details) setUserLoc(details);
        },
        async () => {
          const details = await detectLocation(40.7128, -74.0060);
          if (details) setUserLoc(details);
        }
      );
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-cyanGlow" />
            <span>3D CITY DIGITAL TWIN ENGINE</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            📍 Active Sector: <strong className="text-cyanGlow">{userLoc?.city || userLoc?.suburb || "Detecting live GPS..."}</strong> ({userLoc?.current_address || "Detecting address..."})
          </p>
        </div>
      </div>

      <div className="w-full h-[70vh]">
        <DigitalTwin3D location={userLoc} />
      </div>
    </div>
  );
}
