# RadiX — Enterprise AI Radiology PACS Workstation & Multi-Agent Clinical Co-Pilot

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **Framer Motion**, and **@google/genai (`gemini-2.5-flash`)**.

## Quick Start & Launch Instructions

```bash
# 1. Install dependencies with legacy peer deps
npm install @google/genai framer-motion lucide-react clsx tailwind-merge --legacy-peer-deps

# 2. Configure your Gemini API key (optional — Resilient Clinical Fallback works out of the box)
cp .env.local.example .env.local

# 3. Run production build verification
npm run build

# 4. Launch the PACS workstation on http://localhost:3000
npm run dev
```

## Architecture Highlights
- **Phase 1**: Next.js App Router + TypeScript + Tailwind dark clinical glassmorphic theme (`bg-slate-950`, `border-slate-800/80`).
- **Phase 2 (`lib/clinical-graph.ts`)**: Typed in-memory Clinical Knowledge Graph (`Pathology`, `AnatomicalSite`, `StandardProtocol`, `Contraindication`, `HistoricalPrecedent`) with directed edges (`INDICATES`, `TREATED_BY`, `CONTRADICTS`), multi-hop `queryClinicalGraph(pathologyTag)`, and DICOM header simulator.
- **Phase 3 (`app/api/analyze/route.ts`)**: Two-stage adversarial clinical backend using `@google/genai` (`gemini-2.5-flash`) with Stage 1 `Promise.all` parallel agents (`VisionSpatialAgent`, `PathologyDifferentialAgent`, `SafetyComplianceAgent`) and Stage 2 `Chief Medical Officer Orchestrator` + deterministic resilient demo fallback.
- **Phase 4 (`app/page.tsx` & `components/ui/*`)**: Split-pane hospital PACS workstation with interactive DICOM Window/Level (`WW`/`WL`) controls, bidirectional SVG/HTML bounding box ROI overlays, `<85%` AI Safety Governance Gate simulator, 5-step Glass-Box Chain-of-Thought drawer, and Trilingual Patient Empathy Co-Pilot (`English`, `मराठी`, `हिंदी`) with Web Speech API audio synthesis.
