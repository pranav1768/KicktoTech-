"use client";

import React, { useRef } from "react";
import {
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Contrast,
  Crosshair,
  Upload,
  Layers,
  ScanLine,
} from "lucide-react";
import type { RegionOfInterest } from "@/app/api/analyze/route";
import type { DicomMetadata } from "@/lib/clinical-graph";

export interface PresetCaseOption {
  id: string;
  code: string;
  title: string;
  modality: "XR" | "CT" | "MRI";
  urgency: "CRITICAL" | "ELEVATED" | "ROUTINE";
  imageSrc: string;
}

interface PacsViewportProps {
  presets: PresetCaseOption[];
  activeCaseId: string;
  onSelectPreset: (id: string) => void;
  imageSrc: string;
  onUploadCustomImage: (dataUrl: string, fileName: string) => void;
  dicom: DicomMetadata;
  rois: RegionOfInterest[];
  showOverlays: boolean;
  onToggleOverlays: () => void;
  hoveredRoiId: string | null;
  onHoverRoi: (id: string | null) => void;
  zoom: number;
  onChangeZoom: (z: number) => void;
  invertLut: boolean;
  onToggleInvert: () => void;
  showCrosshair: boolean;
  onToggleCrosshair: () => void;
  windowWidth: number;
  windowCenter: number;
  isAnalyzing: boolean;
}

export function PacsViewport({
  presets,
  activeCaseId,
  onSelectPreset,
  imageSrc,
  onUploadCustomImage,
  dicom,
  rois,
  showOverlays,
  onToggleOverlays,
  hoveredRoiId,
  onHoverRoi,
  zoom,
  onChangeZoom,
  invertLut,
  onToggleInvert,
  showCrosshair,
  onToggleCrosshair,
  windowWidth,
  windowCenter,
  isAnalyzing,
}: PacsViewportProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUploadCustomImage(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Convert DICOM WW/WL into visual contrast & brightness percentages
  const contrastPct = Math.round(60 + ((400 - windowWidth) / 350) * 85);
  const brightnessPct = Math.round(70 + ((120 - windowCenter) / 110) * 55);

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800/90 bg-slate-900/70 backdrop-blur-md overflow-hidden">
      {/* Case Selector & Custom DICOM/Image Uploader Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((preset) => {
            const active = activeCaseId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition ${
                  active
                    ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/50 shadow-sm"
                    : "bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300">
                  {preset.modality}
                </span>
                <span>{preset.title}</span>
              </button>
            );
          })}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/30 flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Scan / Drag &amp; Drop</span>
          </button>
        </div>
      </div>

      {/* PACS Viewport Toolbar */}
      <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleOverlays}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 border transition ${
              showOverlays
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-950 text-slate-400 border-slate-800"
            }`}
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>AI Bounding Boxes ({rois.length})</span>
          </button>

          <button
            type="button"
            onClick={onToggleInvert}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 border transition ${
              invertLut
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span>Invert LUT</span>
          </button>

          <button
            type="button"
            onClick={onToggleCrosshair}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 border transition ${
              showCrosshair
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Crosshair</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <button
            type="button"
            onClick={() => onChangeZoom(Math.max(0.75, Number((zoom - 0.15).toFixed(2))))}
            className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[11px] text-slate-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onChangeZoom(Math.min(2.0, Number((zoom + 0.15).toFixed(2))))}
            className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive DICOM Diagnostic Canvas */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              onUploadCustomImage(reader.result, file.name);
            }
          };
          reader.readAsDataURL(file);
        }}
        className="relative flex-1 min-h-[420px] bg-black flex items-center justify-center overflow-hidden select-none"
      >
        {/* Corner DICOM Burn-In Overlays */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none font-mono text-[11px] text-emerald-400/90 space-y-0.5 bg-slate-950/75 px-2.5 py-1.5 rounded border border-slate-800/80">
          <div className="font-bold text-slate-100">{dicom.patientName}</div>
          <div>ID: {dicom.patientId} • {dicom.patientAgeSex}</div>
          <div>ACC: {dicom.accessionNumber}</div>
          <div className="text-cyan-300">{dicom.studyDescription}</div>
        </div>

        <div className="absolute top-3 right-3 z-20 pointer-events-none font-mono text-[11px] text-right text-slate-300 space-y-0.5 bg-slate-950/75 px-2.5 py-1.5 rounded border border-slate-800/80">
          <div className="text-amber-300 font-semibold">{dicom.manufacturerModel}</div>
          <div>{dicom.seriesNumber}</div>
          <div>kVp: {dicom.kvp} • mAs: {dicom.mas}</div>
          <div>WW: {windowWidth} / WL: {windowCenter}</div>
        </div>

        {/* Scale Ruler on Right Margin */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden sm:flex flex-col items-end gap-2 font-mono text-[9px] text-emerald-400/70">
          {[0, 2, 4, 6, 8, 10].map((cm) => (
            <div key={cm} className="flex items-center gap-1">
              <span>{cm}cm</span>
              <div className="w-2.5 h-0.5 bg-emerald-400/70" />
            </div>
          ))}
        </div>

        {/* Crosshair Reference Axes */}
        {showCrosshair && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/35 border-t border-dashed border-cyan-400/50" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/35 border-l border-dashed border-cyan-400/50" />
          </div>
        )}

        {/* Active Multi-Agent Scan Laser Overlay during Re-Analysis */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-30 bg-slate-950/55 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
            <ScanLine className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-300">
              Executing Stage-1 Parallel Agents &amp; CMO Graph Verification...
            </span>
          </div>
        )}

        {/* Image + Synced Bounding Box Container */}
        <div
          className="relative w-full max-w-[490px] aspect-square transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={imageSrc}
            alt={dicom.studyDescription}
            className="w-full h-full object-contain rounded"
            style={{
              filter: `contrast(${contrastPct}%) brightness(${brightnessPct}%) ${
                invertLut ? "invert(100%)" : ""
              }`,
            }}
          />

          {/* Interactive SVG/HTML Bounding Box Overlays */}
          {showOverlays &&
            rois.map((roi) => {
              const isHovered = hoveredRoiId === roi.id;
              const colorClasses =
                roi.severity === "CRITICAL"
                  ? "border-rose-500 bg-rose-500/15 text-rose-200 shadow-rose-500/30"
                  : roi.severity === "ELEVATED"
                  ? "border-amber-400 bg-amber-400/15 text-amber-100 shadow-amber-400/30"
                  : "border-emerald-400 bg-emerald-400/15 text-emerald-100 shadow-emerald-400/30";

              return (
                <div
                  key={roi.id}
                  onMouseEnter={() => onHoverRoi(roi.id)}
                  onMouseLeave={() => onHoverRoi(null)}
                  onClick={() => onHoverRoi(isHovered ? null : roi.id)}
                  style={{
                    left: `${roi.x}%`,
                    top: `${roi.y}%`,
                    width: `${roi.width}%`,
                    height: `${roi.height}%`,
                  }}
                  className={`absolute z-20 border-2 rounded-md cursor-pointer transition-all duration-150 ${colorClasses} ${
                    isHovered ? "ring-2 ring-white scale-[1.02] shadow-lg bg-opacity-30" : ""
                  }`}
                >
                  <div className="absolute -top-6 left-0 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/95 border border-slate-700 text-[10px] font-mono font-semibold flex items-center gap-1 shadow">
                    <span>{roi.label}</span>
                    <span className="text-cyan-300">({roi.densityMetric})</span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Bottom ROI Legend Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-950/85 border border-slate-800/90 px-3 py-1.5 rounded-lg text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hover any ROI box or right-pane finding to cross-localize</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> CRITICAL
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> ELEVATED
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> INTACT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
