"use client";

import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color:${color}; width:18px; height:18px; border-radius:50%; border:2px solid white; box-shadow:0 0 12px ${color}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center && center[0] && center[1]) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lon: number) => void }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

interface LiveMapProps {
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lon: number) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  center = [40.7128, -74.0060],
  zoom = 13,
  onMapClick
}) => {
  const [isClient, setIsClient] = useState(false);
  const [layers, setLayers] = useState({
    traffic: true,
    emergency: true,
    hospitals: true,
    power: true
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hospitalPoints: [number, number, string][] = [
    [center[0] + 0.005, center[1] + 0.004, "General Emergency Hospital (24/7 ICU Beds Available)"],
    [center[0] - 0.008, center[1] - 0.006, "Community Medical Center (Urgent Care & Trauma)"]
  ];

  const policePoints: [number, number, string][] = [
    [center[0] - 0.004, center[1] + 0.008, "Police Precinct #4 Patrol Unit"],
    [center[0] + 0.007, center[1] - 0.003, "SWAT Command Response Center"]
  ];

  const powerGridPoints: [number, number, string][] = [
    [center[0] + 0.010, center[1] + 0.012, "Power Grid Substation Node (150MW Load)"],
    [center[0] - 0.012, center[1] - 0.010, "Solar Generation Hub A"]
  ];

  const trafficCorridor: [number, number][] = [
    [center[0] - 0.010, center[1] - 0.010],
    [center[0], center[1]],
    [center[0] + 0.010, center[1] + 0.010]
  ];

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-2xl glass-panel flex items-center justify-center font-mono text-xs text-cyanGlow">
        <span>Initializing 2D GIS Live Spatial Vector Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden glass-panel relative">
      {/* Map Layer Overlays */}
      <div className="absolute top-3 right-3 z-[500] bg-darkBg/90 backdrop-blur-md p-2.5 rounded-xl border border-white/10 space-y-1.5 text-[11px] font-mono shadow-xl">
        <span className="text-cyanGlow font-bold block mb-0.5">2D GIS LAYERS</span>
        <label className="flex items-center space-x-2 text-gray-200 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.traffic}
            onChange={(e) => setLayers({ ...layers, traffic: e.target.checked })}
            className="accent-cyanGlow"
          />
          <span>Traffic Flow Corridors</span>
        </label>
        <label className="flex items-center space-x-2 text-gray-200 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.emergency}
            onChange={(e) => setLayers({ ...layers, emergency: e.target.checked })}
            className="accent-alertRed"
          />
          <span>Police Patrol Squads</span>
        </label>
        <label className="flex items-center space-x-2 text-gray-200 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.hospitals}
            onChange={(e) => setLayers({ ...layers, hospitals: e.target.checked })}
            className="accent-emerald-400"
          />
          <span>Hospitals & ICU Units</span>
        </label>
        <label className="flex items-center space-x-2 text-gray-200 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.power}
            onChange={(e) => setLayers({ ...layers, power: e.target.checked })}
            className="accent-amber-400"
          />
          <span>Power Substation Nodes</span>
        </label>
      </div>

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ width: "100%", height: "100%", minHeight: "400px" }}>
        <MapRecenter center={center} />
        <MapClickHandler onMapClick={onMapClick} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Current / Selected GPS Location Marker */}
        <Marker position={center} icon={createIcon("#00f2fe")}>
          <Popup>Current GPS Location: {center[0].toFixed(4)}, {center[1].toFixed(4)}</Popup>
        </Marker>

        {/* Traffic Express Polyline */}
        {layers.traffic && (
          <Polyline positions={trafficCorridor} pathOptions={{ color: "#00f2fe", weight: 5, opacity: 0.8 }} />
        )}

        {/* Hospitals */}
        {layers.hospitals && hospitalPoints.map((pt, i) => (
          <Marker key={`hosp-${i}`} position={[pt[0], pt[1]]} icon={createIcon("#06d6a0")}>
            <Popup>{pt[2]}</Popup>
          </Marker>
        ))}

        {/* Police */}
        {layers.emergency && policePoints.map((pt, i) => (
          <Marker key={`pol-${i}`} position={[pt[0], pt[1]]} icon={createIcon("#ff4b4b")}>
            <Popup>{pt[2]}</Popup>
          </Marker>
        ))}

        {/* Power Substation */}
        {layers.power && powerGridPoints.map((pt, i) => (
          <Marker key={`pow-${i}`} position={[pt[0], pt[1]]} icon={createIcon("#ffb703")}>
            <Popup>{pt[2]}</Popup>
          </Marker>
        ))}

        {/* Radius Circle */}
        <Circle center={center} radius={1500} pathOptions={{ color: "#00f2fe", fillColor: "#00f2fe", fillOpacity: 0.15 }} />
      </MapContainer>
    </div>
  );
};
