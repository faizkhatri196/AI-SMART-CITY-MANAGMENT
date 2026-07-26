"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";

interface HumanApprovalModalProps {
  request: {
    id: string;
    agent_name: string;
    action: string;
    reason: string;
    risk_level: string;
  };
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-glow max-w-lg w-full p-6 rounded-2xl border border-amber-500/50 space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center space-x-3 text-amber-400">
          <ShieldAlert className="w-8 h-8 shrink-0 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold tracking-wide">HUMAN SAFETY OVERRIDE REQUIRED</h2>
            <p className="text-xs text-amber-300/80 font-mono">High Risk Autonomous Agent Directive</p>
          </div>
        </div>

        <div className="bg-darkBg/80 p-4 rounded-xl border border-white/10 space-y-2 font-mono text-xs">
          <div className="flex justify-between text-gray-400">
            <span>REQUEST ID:</span>
            <span className="text-white font-bold">{request.id}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>AGENT SOURCE:</span>
            <span className="text-cyanGlow font-bold">{request.agent_name}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>RISK CATEGORY:</span>
            <span className="text-red-400 font-bold">{request.risk_level}</span>
          </div>
          <div className="pt-2 border-t border-white/10">
            <span className="text-gray-400 block mb-1">PROPOSED DIRECTIVE:</span>
            <p className="text-amber-200 leading-relaxed bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30">
              {request.reason}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 font-mono">Dispatcher Verification Comment (Optional):</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g., Authorized by City Command Chief."
            className="w-full bg-darkBg/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyanGlow"
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => onApprove(request.id, comment)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle className="w-4 h-4" />
            <span>AUTHORIZE DIRECTIVE</span>
          </button>
          <button
            onClick={() => onReject(request.id, comment)}
            className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/20"
          >
            <XCircle className="w-4 h-4" />
            <span>DENY / OVERRIDE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
