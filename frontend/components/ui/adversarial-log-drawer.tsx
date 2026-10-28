"use client";

import React from "react";
import {
  BrainCircuit,
  GitBranch,
  CheckCircle2,
  AlertOctagon,
  Wrench,
  FileSpreadsheet,
  Target,
} from "lucide-react";
import type {
  ClinicalAnalysisPayload,
  RegionOfInterest,
} from "@/app/api/analyze/route";

interface AdversarialLogDrawerProps {
  payload: ClinicalAnalysisPayload;
  hoveredRoiId: string | null;
  onHoverRoi: (id: string | null) => void;
  activeRightTab: "telemetry" | "cot" | "graph";
  onChangeRightTab: (tab: "telemetry" | "cot" | "graph") => void;
}

export function AdversarialLogDrawer({
  payload,
  hoveredRoiId,
  onHoverRoi,
  activeRightTab,
  onChangeRightTab,
}: AdversarialLogDrawerProps) {
  return (
    <div className="space-y-4">
      {/* Primary Finding Headline Card */}
      <div className="rounded-xl border border-slate-800/90 bg-slate-900/75 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            CMO Orchestrator Primary Headline
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Engine: {payload.executionMode}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
          {payload.primary_finding}
        </h2>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          {payload.rationale}
        </p>
      </div>

      {/* Right Pane Sub-Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
        <button
          type="button"
          onClick={() => onChangeRightTab("telemetry")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeRightTab === "telemetry"
              ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Differential &amp; ROIs</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeRightTab("cot")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeRightTab === "cot"
              ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Glass-Box CoT (5 Steps)</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeRightTab("graph")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeRightTab === "graph"
              ? "bg-amber-500/20 text-amber-200 border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Knowledge Graph</span>
        </button>
      </div>

      {/* TAB 1: Differential Diagnoses, Interactive ROIs, & Post-Op Surgical Sites */}
      {activeRightTab === "telemetry" && (
        <div className="space-y-4">
          {/* Interactive Regions of Interest (Synced with Viewport Bounding Boxes) */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Segmented Regions of Interest (Hover to Highlight Scan)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {payload.regions_of_interest.length} Vectors
              </span>
            </div>
            <div className="space-y-2">
              {payload.regions_of_interest.map((roi: RegionOfInterest) => {
                const isHovered = hoveredRoiId === roi.id;
                return (
                  <div
                    key={roi.id}
                    onMouseEnter={() => onHoverRoi(roi.id)}
                    onMouseLeave={() => onHoverRoi(null)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isHovered
                        ? "bg-slate-800/90 border-cyan-400 shadow-sm"
                        : "bg-slate-950/75 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            roi.severity === "CRITICAL"
                              ? "bg-rose-500"
                              : roi.severity === "ELEVATED"
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-100">
                          {roi.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-cyan-300">{roi.densityMetric}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {roi.findingCode}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Differential Diagnosis Probability Bars */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              PathologyDifferentialAgent Probability Tree
            </h3>
            <div className="space-y-3">
              {payload.differential_diagnoses.map((ddx, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-100">
                      {idx + 1}. {ddx.condition}
                    </span>
                    <span className="font-mono font-bold text-emerald-300">
                      {ddx.probability_pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                          : idx === 1
                          ? "bg-amber-500/80"
                          : "bg-slate-600"
                      }`}
                      style={{ width: `${ddx.probability_pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <span className="font-mono text-cyan-300 mr-1.5">[{ddx.icd10}]</span>
                    {ddx.supporting_feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Post-Op Hardware & Surgical Sites Assessment */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              <Wrench className="w-4 h-4 text-emerald-400" />
              Surgical Sites &amp; Fixation Integrity Audit
            </div>
            <p className="text-xs text-slate-300 mb-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              {payload.post_op_summary}
            </p>
            <div className="space-y-2">
              {payload.surgical_sites.map((site, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-100">
                      {site.site_name}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {site.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 font-mono">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        site.status === "CRITICAL_ALERT"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : site.status === "MONITOR"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {site.status}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Conf: {site.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5-Step Glass-Box Chain-of-Thought Verification Pipeline */}
      {activeRightTab === "cot" && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              5-Step Sequential Chain-of-Thought &amp; Multi-Agent Audit
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">
              Total: {payload.latencyMs}ms
            </span>
          </div>

          {/* Step Progress Bar */}
          <div className="grid grid-cols-5 gap-1.5">
            {payload.diagnostic_steps.map((s) => (
              <div
                key={s.step}
                className={`h-1.5 rounded-full ${
                  s.status === "ADVERSARIAL_CHALLENGE"
                    ? "bg-rose-500"
                    : "bg-emerald-400"
                }`}
              />
            ))}
          </div>

          <div className="space-y-2.5 pt-1">
            {payload.diagnostic_steps.map((step) => (
              <div
                key={step.step}
                className={`p-3 rounded-lg border ${
                  step.status === "ADVERSARIAL_CHALLENGE"
                    ? "bg-rose-950/35 border-rose-500/50"
                    : "bg-slate-950/80 border-slate-800/90"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-300 font-mono text-[11px] font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                    <span className="text-xs font-bold text-slate-100">
                      {step.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                      {step.agent}
                    </span>
                    <span className="text-slate-400">{step.durationMs}ms</span>
                    {step.status === "ADVERSARIAL_CHALLENGE" ? (
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Clinical Knowledge Graph Multi-Hop Traversal */}
      {activeRightTab === "graph" && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              In-Memory Clinical Knowledge Graph (`queryClinicalGraph`)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-hop traversal across typed nodes (`Pathology`, `AnatomicalSite`, `StandardProtocol`, `Contraindication`, `HistoricalPrecedent`)
            </p>
          </div>

          {/* Traversed Directed Paths */}
          <div className="space-y-1.5 bg-slate-950/90 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
            {payload.knowledge_graph.multiHopPaths.map((pathStr, idx) => (
              <div key={idx} className="text-emerald-300 leading-relaxed">
                {pathStr}
              </div>
            ))}
          </div>

          {/* Standard Protocol Node */}
          {payload.knowledge_graph.standardProtocols.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/40"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 mb-1">
                <span>EDGE: TREATED_BY → StandardProtocol ({node.code})</span>
                <span>{node.evidenceLevel}</span>
              </div>
              <div className="text-xs font-bold text-slate-100">{node.label}</div>
              <p className="text-xs text-slate-300 mt-1">{node.description}</p>
              <div className="text-[10px] font-mono text-slate-400 mt-1.5">
                Citation: {node.citation}
              </div>
            </div>
          ))}

          {/* Contraindication Node */}
          {payload.knowledge_graph.contraindications.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-rose-300 mb-1">
                <span>EDGE: CONTRADICTS → Contraindication ({node.code})</span>
                <span>SAFETY LOCK</span>
              </div>
              <div className="text-xs font-bold text-rose-200">{node.label}</div>
              <p className="text-xs text-rose-100/90 mt-1">{node.description}</p>
            </div>
          ))}

          {/* Historical Precedent Node */}
          {payload.knowledge_graph.historicalPrecedents.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-lg bg-cyan-950/25 border border-cyan-500/30"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 mb-1">
                <span>EDGE: INDICATES → HistoricalPrecedent ({node.code})</span>
                <span>{node.evidenceLevel}</span>
              </div>
              <div className="text-xs font-bold text-slate-100">{node.label}</div>
              <p className="text-xs text-slate-300 mt-1">{node.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
