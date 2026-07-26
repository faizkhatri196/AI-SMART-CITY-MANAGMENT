"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, X, Sparkles, CheckCircle, ShieldAlert, Navigation } from "lucide-react";
import { sendCopilotQuery } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  toolAction?: string;
  toolResult?: any;
  timestamp: string;
}

export const AICopilotDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userGps, setUserGps] = useState<{ lat: number; lon: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "copilot",
      text: "Greetings! I am CityVerse Global AI Copilot. Ask me about nearby hospitals, traffic predictions, police precinct readiness, power outages, or restaurants relative to your current location.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Request browser GPS position on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserGps({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.warn("Copilot GPS auto-detect fallback:", err),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await sendCopilotQuery(q, userGps?.lat, userGps?.lon);
      const copilotMsg: Message = {
        id: `copilot-${Date.now()}`,
        sender: "copilot",
        text: res.reply,
        toolAction: res.tool_action,
        toolResult: res.tool_result,
        timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "copilot",
          text: "I encountered a network issue communicating with the AI gateway. Please retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Nearest hospital",
    "Safest hotel nearby",
    "Find good restaurants around me",
    "Show live traffic near me",
    "Where is the nearest police station?",
    "Best tourist places within 20 km",
    "Show nearby flood alerts",
    "Find parking near my current location",
    "Navigate to closest metro station"
  ];

  return (
    <>
      {/* Floating Trigger Widget */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[999] bg-gradient-to-r from-cyanGlow to-blueGlow text-darkBg p-3.5 rounded-2xl shadow-2xl shadow-cyanGlow/40 flex items-center space-x-2 font-bold font-mono hover:scale-105 transition-all group"
      >
        <div className="relative">
          <Bot className="w-6 h-6 fill-darkBg" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-darkBg animate-ping"></span>
        </div>
        <span className="hidden sm:inline text-xs font-extrabold tracking-wider">AI COPILOT</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-darkBg/60 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-md h-full glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyanGlow to-blueGlow flex items-center justify-center text-darkBg">
                  <Bot className="w-4 h-4 fill-darkBg" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">CITYVERSE AI COPILOT</h3>
                  <p className="text-[10px] text-cyanGlow font-mono flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    <span>GPS: {userGps ? `${userGps.lat.toFixed(3)}, ${userGps.lon.toFixed(3)}` : "AUTO-DETECTING"}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Sample Queries Pill Bar */}
            <div className="px-4 py-2 bg-darkBg/40 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/5 hover:bg-cyanGlow/20 text-gray-300 hover:text-cyanGlow border border-white/10 shrink-0 transition"
                >
                  {sq}
                </button>
              ))}
            </div>

            {/* Messages Chat Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-cyanGlow to-blueGlow text-darkBg font-medium rounded-tr-none shadow-lg shadow-cyanGlow/10"
                        : "glass-panel text-gray-200 border border-white/10 rounded-tl-none"
                    }`}
                  >
                    {msg.sender === "copilot" && (
                      <div className="flex items-center space-x-1 text-cyanGlow text-[10px] mb-1 font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>AI COPILOT AGENT</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Tool Execution Result Card Rendering */}
                    {msg.toolResult && msg.toolAction !== "none" && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] space-y-2">
                        <div className="flex items-center justify-between text-cyanGlow font-bold">
                          <span className="uppercase text-[10px]">TOOL EXECUTION: {msg.toolAction}</span>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </div>

                        {msg.toolAction === "search_hospitals" && (
                          <div className="bg-darkBg/60 p-2 rounded-xl border border-white/5 space-y-1 text-gray-300">
                            <span className="text-emerald-400 font-bold">ICU Capacity Available: {msg.toolResult.icu_available_total} Beds</span>
                            <div className="text-[10px] text-gray-400">
                              {msg.toolResult.hospitals?.slice(0, 2).map((h: any, idx: number) => (
                                <div key={idx} className="truncate">• {h.title}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.toolAction === "predict_traffic" && (
                          <div className="bg-darkBg/60 p-2 rounded-xl border border-white/5 space-y-1 text-gray-300">
                            <span className="text-amber-300 font-bold">{msg.toolResult.recommended_route}</span>
                            <p className="text-[10px] text-gray-400">Avg Speed: {msg.toolResult.predicted_speed_kmh} km/h</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-cyanGlow font-mono text-xs animate-pulse">
                  <Bot className="w-4 h-4" />
                  <span>Processing natural language & executing tools...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/10 glass-panel">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask copilot..."
                  className="flex-1 bg-darkBg/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyanGlow font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-cyanGlow to-blueGlow hover:from-cyan-400 hover:to-blue-500 text-darkBg p-2.5 rounded-xl font-bold transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4 fill-darkBg" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
