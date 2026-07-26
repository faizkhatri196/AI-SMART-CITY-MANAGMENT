"use client";

import React from "react";
import dynamic from "next/dynamic";

const LocationIntelligenceCenter = dynamic(
  () => import("@/components/LocationIntelligenceCenter").then((m) => m.LocationIntelligenceCenter),
  { ssr: false }
);

export default function HomePage() {
  return <LocationIntelligenceCenter />;
}
