"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search, Navigation } from "lucide-react";
import { detectLocation } from "@/lib/api";

const LiveMap = dynamic(() => import("@/components/LiveMap").then((m) => m.LiveMap), { ssr: false });

const WORLD_CITIES = [
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "New York", country: "United States", lat: 40.7128, lon: -74.0060 },
  { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777 },
  { name: "Delhi", country: "India", lat: 28.6139, lon: 77.2090 },
  { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946 },
  { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 }
];

export default function MapPage() {
  const [coords, setCoords] = useState<[number, number]>([40.7128, -74.0060]);
  const [locDetails, setLocDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const loadLocation = async (lat: number, lon: number, cityName?: string) => {
    setCoords([lat, lon]);
    try {
      const details = await detectLocation(lat, lon);
      if (details) {
        setLocDetails(details);
      } else {
        const clientRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
          headers: { "User-Agent": "CityVerseAI/1.0" }
        });
        if (clientRes.ok) {
          const data = await clientRes.json();
          const addr = data.address || {};
          const city = cityName || addr.city || addr.town || addr.village || addr.county || "Local Sector";
          setLocDetails({
            city,
            current_address: data.display_name || `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
          });
        }
      }
    } catch (e) {
      console.warn("Map page location error:", e);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadLocation(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          loadLocation(40.7128, -74.0060, "New York");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      loadLocation(40.7128, -74.0060, "New York");
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched = WORLD_CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
  }, [searchQuery]);

  const handleSelectSuggestion = (c: any) => {
    setSearchQuery(`${c.name}, ${c.country}`);
    setShowSuggestions(false);
    loadLocation(c.lat, c.lon, c.name);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!searchQuery.trim()) return;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
      const res = await fetch(url, { headers: { "User-Agent": "CityVerseAI/1.0" } });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          loadLocation(lat, lon);
        }
      }
    } catch (err) {
      console.warn("Search submit error:", err);
    }
  };

  const handleMapClick = (lat: number, lon: number) => {
    loadLocation(lat, lon);
  };

  return (
    <div className="space-y-4 md:space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 relative">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyanGlow" />
            <span>2D INTERACTIVE GIS COMMAND MAP</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            📍 Target: <strong className="text-cyanGlow">{locDetails?.city || "Active Sector"}</strong> ({locDetails?.current_address || `Lat: ${coords[0].toFixed(4)}, Lon: ${coords[1].toFixed(4)}`})
          </p>
        </div>

        {/* Global 2D Map City Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto relative">
          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              placeholder="Search 2D GIS city..."
              className="w-full bg-darkBg/80 border border-cyanGlow/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyanGlow"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1 bg-cyanGlow/20 hover:bg-cyanGlow/30 text-cyanGlow rounded-lg transition"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-darkBg/95 backdrop-blur-md rounded-xl border border-cyanGlow/40 max-h-48 overflow-y-auto shadow-2xl space-y-1 p-1">
                {suggestions.map((c, i) => (
                  <div
                    key={`${c.name}-${i}`}
                    onClick={() => handleSelectSuggestion(c)}
                    className="px-3 py-2 hover:bg-cyanGlow/20 rounded-lg cursor-pointer flex justify-between items-center text-xs text-gray-200 hover:text-cyanGlow transition"
                  >
                    <span className="font-bold">{c.name}, <span className="text-gray-400 text-[11px]">{c.country}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="w-full h-[72vh] min-h-[480px]">
        <LiveMap center={coords} zoom={14} onMapClick={handleMapClick} />
      </div>
    </div>
  );
}
