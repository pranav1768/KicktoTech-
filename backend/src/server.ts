import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { queryClinicalGraph } from "./services/clinical-graph.service";
import { runMultiAgentAnalysis, PRESET_CLINICAL_PAYLOADS } from "./agents/cmo-orchestrator.agent";
import { simulateDicomMetadata } from "./services/dicom-simulator.service";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json({ limit: "25mb" }));

// 1. Health & Readiness Endpoint
app.get("/health", (_req, res) => {
  res.json({
    service: "radix-clinical-backend",
    version: "2.5.0",
    status: "OK",
    database: "connected (radix_clinical.sqlite)",
    timestamp: new Date().toISOString(),
  });
});

// 2. List Preset DICOM Clinical Studies
app.get("/api/cases", (_req, res) => {
  res.json({
    cases: ["case-1", "case-2", "case-3"].map((id) => ({
      caseId: id,
      dicom_metadata: simulateDicomMetadata(id),
      triage_urgency: PRESET_CLINICAL_PAYLOADS[id].triage_urgency,
      primary_finding: PRESET_CLINICAL_PAYLOADS[id].primary_finding,
    })),
  });
});

// 3. Query Clinical Knowledge Graph directly by Pathology Tag
app.get("/api/knowledge-graph/:pathologyTag", (req, res) => {
  const result = queryClinicalGraph(req.params.pathologyTag);
  res.json(result);
});

// 4. Multi-Agent Adversarial Clinical Analysis Pipeline (Stage 1 Promise.all + Stage 2 CMO)
app.post("/api/analyze", async (req, res) => {
  try {
    const { imageBase64, caseId = "case-1", simulateAmbiguity = false, customApiKey } = req.body;
    const payload = await runMultiAgentAnalysis({
      imageBase64,
      caseId,
      simulateAmbiguity: Boolean(simulateAmbiguity),
      apiKey: customApiKey || process.env.GEMINI_API_KEY,
    });
    res.status(200).json(payload);
  } catch (err) {
    console.error("[Backend /api/analyze Error]:", err);
    res.status(500).json({ error: "Analysis pipeline error" });
  }
});

// 5. Record Attending Radiologist Governance Override Co-Signature
app.post("/api/governance/override", (req, res) => {
  const { caseId = "case-1", attendingPhysician = "Attending Radiologist", notes = "Manual override approved" } = req.body;
  res.status(200).json({
    status: "RECORDED",
    caseId,
    attendingPhysician,
    notes,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[RadiX Backend] Multi-Agent PACS API listening on http://localhost:${PORT}`);
});
