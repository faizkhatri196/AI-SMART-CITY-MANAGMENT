"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Sparkles, X, ChevronRight, Activity, ShieldAlert, Wind, Hospital } from "lucide-react";
import { globalSearch, fetchLocationSummary } from "@/lib/api";

interface GlobalAISearchProps {
  onSelectLocation?: (loc: any) => void;
}

export const GlobalAISearch: React.FC<GlobalAISearchProps> = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 0) {
        const res = await globalSearch(query);
        if (res?.results) {
          setResults(res.results);
          setIsOpen(true);
        }
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (loc: any) => {
    setSelectedLocation(loc);
    setIsOpen(false);
    setLoadingSummary(true);
    if (onSelectLocation) onSelectLocation(loc);
    
    const sum = await fetchLocationSummary(loc.id);
    setSummary(sum);
    setLoadingSummary(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-cyanGlow">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(results.length > 0)}
          placeholder="Search Hospitals, Airports, Power Plants, Roads, EV Charging..."
          className="w-full bg-darkBg/90 backdrop-blur-md border border-white/15 focus:border-cyanGlow rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none shadow-xl transition-all font-mono"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-12 left-0 right-0 z-50 glass-panel-glow rounded-2xl p-2 border border-cyanGlow/40 max-h-96 overflow-y-auto space-y-1 shadow-2xl animate-in fade-in duration-150">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-gray-400 flex items-center justify-between border-b border-white/10">
            <span>AI SPATIAL RESULTS ({results.length})</span>
            <span className="text-cyanGlow font-bold">INSTANT AUTOCOMPLETE</span>
          </div>

          {results.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-cyanGlow/20 flex items-center justify-center text-cyanGlow border border-cyanGlow/30 group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyanGlow transition-colors">
                    {loc.name}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {loc.category} • {loc.city}, {loc.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-darkBg text-emerald-400 border border-emerald-500/30">
                  Risk: {loc.risk_score}%
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyanGlow" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Perplexity-Style AI Location Intelligence Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-2xl w-full p-6 rounded-2xl border border-cyanGlow/50 space-y-5 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyanGlow to-blueGlow flex items-center justify-center text-darkBg font-bold">
                  <Sparkles className="w-5 h-5 fill-darkBg" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{selectedLocation.name}</h2>
                  <p className="text-xs text-cyanGlow font-mono">{selectedLocation.category} • {selectedLocation.city}, {selectedLocation.country}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingSummary ? (
              <div className="h-48 flex items-center justify-center text-cyanGlow space-x-2 font-mono text-xs">
                <Activity className="w-5 h-5 animate-spin" />
                <span>GENERATING AI SPATIAL BRIEFING...</span>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                {/* AI Briefing Summary */}
                <div className="bg-darkBg/80 p-4 rounded-xl border border-white/10 space-y-2">
                  <span className="text-cyanGlow block font-bold">Executive AI Location Briefing:</span>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {summary?.ai_briefing}
                  </p>
                </div>

                {/* Risk & Telemetry Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-darkBg/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[10px]">RISK SCORE</span>
                    <span className="text-amber-400 font-bold">{summary?.risk_analysis?.risk_score_pct}%</span>
                  </div>
                  <div className="bg-darkBg/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[10px]">CRIME INDEX</span>
                    <span className="text-cyanGlow font-bold">{selectedLocation.crime_index} / 100</span>
                  </div>
                  <div className="bg-darkBg/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[10px]">AQI INDEX</span>
                    <span className="text-emerald-400 font-bold">{selectedLocation.aqi} AQI</span>
                  </div>
                  <div className="bg-darkBg/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[10px]">ALERT STATUS</span>
                    <span className="text-emerald-400 font-bold">{summary?.risk_analysis?.disaster_alert}</span>
                  </div>
                </div>

                {/* Nearby Emergency Services */}
                <div className="bg-darkBg/60 p-3 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-gray-400 block text-[10px]">NEARBY EMERGENCY SERVICES:</span>
                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-300">
                    {summary?.nearby_services?.hospitals?.map((h: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        🏥 {h}
                      </span>
                    ))}
                    {summary?.nearby_services?.police_stations?.map((p: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        👮 {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
