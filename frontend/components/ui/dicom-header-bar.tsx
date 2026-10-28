"use client";

import React from "react";
import {
  Activity,
  Clock,
  Sliders,
  ShieldAlert,
  Stethoscope,
  HeartHandshake,
  Cpu,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import type { DicomMetadata } from "@/lib/clinical-graph";

interface DicomHeaderBarProps {
  dicom: DicomMetadata;
  latencyMs: number;
  viewMode: "clinical" | "empathy";
  onChangeViewMode: (mode: "clinical" | "empathy") => void;
  simulateAmbiguity: boolean;
  onToggleAmbiguity: () => void;
  windowWidth: number;
  windowCenter: number;
  onChangeWindow: (ww: number, wc: number) => void;
  onResetViewport: () => void;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
}

export function DicomHeaderBar({
  dicom,
  latencyMs,
  viewMode,
  onChangeViewMode,
  simulateAmbiguity,
  onToggleAmbiguity,
  windowWidth,
  windowCenter,
  onChangeWindow,
  onResetViewport,
  onOpenApiKeyModal,
  hasCustomKey,
}: DicomHeaderBarProps) {
  return (
    <header className="border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Patient DICOM Tag Strip */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 pr-3 border-r border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-100">
                  RadiX
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  PACS v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Multi-Agent Clinical Co-Pilot
              </p>
            </div>
          </div>

          {/* DICOM Header Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
              <span className="text-slate-500 mr-1">PT:</span>
              <span className="font-semibold text-emerald-300">{dicom.patientId}</span>
              <span className="text-slate-400 ml-1.5 hidden sm:inline">
                ({dicom.patientAgeSex})
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-bold">
              MODALITY: {dicom.modality}
            </div>

            <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hidden md:block">
              <span className="text-slate-500">SLICE:</span> {dicom.sliceThickness} •{" "}
              <span className="text-slate-500">KVP:</span> {dicom.kvp}kVp
            </div>

            <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hidden xl:block">
              {dicom.institution}
            </div>

            <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Window/Level, Simulate Ambiguity (<85%), Empathy Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Interactive DICOM Window/Level Control */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">WW:</span>
            <input
              type="range"
              min={50}
              max={400}
              value={windowWidth}
              onChange={(e) => onChangeWindow(Number(e.target.value), windowCenter)}
              className="w-16 accent-cyan-400 cursor-pointer"
              aria-label="DICOM Window Width"
            />
            <span className="text-cyan-300 w-7">{windowWidth}</span>
            <span className="text-slate-400 ml-1">WL:</span>
            <input
              type="range"
              min={10}
              max={120}
              value={windowCenter}
              onChange={(e) => onChangeWindow(windowWidth, Number(e.target.value))}
              className="w-16 accent-emerald-400 cursor-pointer"
              aria-label="DICOM Window Level"
            />
            <span className="text-emerald-300 w-6">{windowCenter}</span>
            <button
              type="button"
              onClick={onResetViewport}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Reset DICOM Window/Level"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Simulate Ambiguity (<85%) Governance Test Button */}
          <button
            type="button"
            onClick={onToggleAmbiguity}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              simulateAmbiguity
                ? "bg-rose-500/25 text-rose-200 border-rose-400/60 shadow-sm shadow-rose-500/20"
                : "bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Ambiguity (&lt;85%)</span>
          </button>

          {/* Empathy Toggle: Clinical PACS Workstation vs Patient Empathy View */}
          <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => onChangeViewMode("clinical")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "clinical"
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Clinical PACS Workstation</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode("empathy")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "empathy"
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Patient Empathy View (EN / मराठी / हिंदी)</span>
            </button>
          </div>

          {/* Optional Gemini 2.5 Flash Key Config */}
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 border transition ${
              hasCustomKey
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
            title="Configure @google/genai Gemini 2.5 Flash API Key"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{hasCustomKey ? "Gemini Live" : "API Key"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
