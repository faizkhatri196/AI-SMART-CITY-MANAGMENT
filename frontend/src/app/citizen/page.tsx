"use client";

import React, { useState } from "react";
import { UserCheck, AlertOctagon, Send, CheckCircle2, MessageSquare, MapPin } from "lucide-react";
import { submitCitizenSOS } from "@/lib/api";

export default function CitizenPage() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("5th Ave & 42nd St");
  const [sosType, setSosType] = useState("Medical Emergency");
  const [description, setDescription] = useState("");
  const [sosResult, setSosResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitCitizenSOS(name || "Anonymous Citizen", location, sosType, description);
    setSosResult(res);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-cyanGlow" />
            <span>CITIZEN EMERGENCY SOS & CIVIC PORTAL</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Direct public channel for filing emergency assistance signals, pothole grievances, and civic service requests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citizen SOS Form */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <div className="flex items-center space-x-2 text-alertRed">
            <AlertOctagon className="w-6 h-6 shrink-0" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Instant Citizen SOS Emergency Signal
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-mono">Citizen Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-darkBg/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-cyanGlow outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-mono">Current Geo-Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-darkBg/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-mono">Emergency Type:</label>
              <select
                value={sosType}
                onChange={(e) => setSosType(e.target.value)}
                className="w-full bg-darkBg/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Medical Emergency">Medical Emergency / Ambulance</option>
                <option value="Crime in Progress">Crime in Progress / Police</option>
                <option value="Fire Hazard">Fire Hazard / Rescue</option>
                <option value="Pothole / Road Hazard">Pothole / Road Infrastructure Defect</option>
                <option value="Water Burst Pipe">Water Burst Pipe / Utility Leak</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-mono">Incident Description:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe situation..."
                className="w-full bg-darkBg/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-cyanGlow outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/20"
            >
              <Send className="w-4 h-4" />
              <span>DISPATCH EMERGENCY SOS</span>
            </button>
          </form>
        </div>

        {/* AI Triage & Response Feed */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h2 className="text-sm font-mono font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyanGlow" />
            <span>Citizen AI Triage & Response</span>
          </h2>

          {sosResult ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>SOS DISPATCH CONFIRMED</span>
                </div>
                <div className="text-gray-300">
                  <span>Incident Ticket: </span>
                  <span className="text-white font-bold">{sosResult.incident_id}</span>
                </div>
              </div>

              <div className="bg-darkBg/80 p-4 rounded-xl border border-white/10 space-y-2 font-mono text-xs">
                <span className="text-cyanGlow block font-bold">Citizen Support AI Response:</span>
                <p className="text-gray-300 leading-relaxed">
                  {sosResult.agent_response?.decision}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 space-y-2 border border-dashed border-white/10 rounded-2xl">
              <UserCheck className="w-8 h-8 text-gray-600" />
              <p className="text-xs font-mono">Submit an SOS ticket on the left to activate Citizen AI triage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
