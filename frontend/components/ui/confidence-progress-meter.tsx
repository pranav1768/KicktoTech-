"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, Lock, CheckCircle2, AlertTriangle } from "lucide-react";

interface ConfidenceProgressMeterProps {
  confidenceScore: number;
  triageUrgency: "CRITICAL" | "ELEVATED" | "ROUTINE";
  safetyGateTriggered: boolean;
  safetyAuditNotes: string;
  attendingOverrideSigned: boolean;
  onToggleOverrideSign: () => void;
}

export function ConfidenceProgressMeter({
  confidenceScore,
  triageUrgency,
  safetyGateTriggered,
  safetyAuditNotes,
  attendingOverrideSigned,
  onToggleOverrideSign,
}: ConfidenceProgressMeterProps) {
  const isBelowThreshold = confidenceScore < 85 || safetyGateTriggered;

  return (
    <div className="space-y-3">
      {/* 21st.dev Dark Clinical Confidence Telemetry Card */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            {isBelowThreshold ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              AI Diagnostic Confidence & Governance Gate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${
                triageUrgency === "CRITICAL"
                  ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                  : triageUrgency === "ELEVATED"
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
              }`}
            >
              TRIAGE: {triageUrgency}
            </span>
            <span
              className={`font-mono text-sm font-bold px-2 py-0.5 rounded border ${
                isBelowThreshold
                  ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
                  : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
              }`}
            >
              {confidenceScore}%
            </span>
          </div>
        </div>

        {/* Progress Bar with 85% Governance Marker */}
        <div className="relative h-3 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-amber-400/90"
            style={{ left: "85%" }}
            title="85% Clinical Safety Threshold"
          />
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isBelowThreshold
                ? "bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500"
                : "bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-400"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, confidenceScore))}%` }}
          />
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>0% (Low SNR)</span>
          <span className="text-amber-300/90">▲ 85% Safety Governance Gate</span>
          <span>100% (Validated)</span>
        </div>
      </div>

      {/* Automatic AI Safety Governance Banner (<85%) */}
      {isBelowThreshold && (
        <div className="rounded-xl border border-rose-500/50 bg-rose-950/40 p-4 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    AI Safety Governance Gate Triggered ({confidenceScore}% &lt; 85%)
                  </h4>
                  <span className="text-[10px] font-mono bg-rose-500/20 text-rose-200 px-2 py-0.5 rounded border border-rose-500/30">
                    AUTO-SIGN LOCKED
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                  {safetyAuditNotes}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleOverrideSign}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                      attendingOverrideSigned
                        ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                        : "bg-rose-500/25 hover:bg-rose-500/35 text-rose-100 border-rose-400/40"
                    }`}
                  >
                    {attendingOverrideSigned ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Attending Co-Signature Recorded (Override Active)
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                        Attending Radiologist Manual Co-Sign Override
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
