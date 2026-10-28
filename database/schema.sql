-- ============================================================================
-- RadiX Enterprise PACS & Clinical Knowledge Graph Database Schema
-- Compatible with SQLite 3.x and PostgreSQL 15+
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. DICOM Studies & Patient Metadata Table
CREATE TABLE IF NOT EXISTS dicom_studies (
    case_id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_age_sex TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('XR', 'CT', 'MRI')),
    slice_thickness TEXT NOT NULL,
    kvp INTEGER NOT NULL,
    mas REAL NOT NULL,
    window_center INTEGER NOT NULL,
    window_width INTEGER NOT NULL,
    institution TEXT NOT NULL,
    accession_number TEXT NOT NULL UNIQUE,
    acquisition_date TEXT NOT NULL,
    study_description TEXT NOT NULL,
    series_number TEXT NOT NULL,
    manufacturer_model TEXT NOT NULL,
    scan_image_path TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clinical Knowledge Graph Nodes Table
CREATE TABLE IF NOT EXISTS clinical_graph_nodes (
    node_id TEXT PRIMARY KEY,
    node_type TEXT NOT NULL CHECK (
        node_type IN (
            'Pathology',
            'AnatomicalSite',
            'StandardProtocol',
            'Contraindication',
            'HistoricalPrecedent'
        )
    ),
    label TEXT NOT NULL,
    clinical_code TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('CRITICAL', 'ELEVATED', 'ROUTINE')),
    evidence_level TEXT NOT NULL,
    citation TEXT NOT NULL,
    description TEXT NOT NULL
);

-- 3. Clinical Knowledge Graph Directed Edges Table
CREATE TABLE IF NOT EXISTS clinical_graph_edges (
    edge_id TEXT PRIMARY KEY,
    source_node_id TEXT NOT NULL,
    target_node_id TEXT NOT NULL,
    relation_type TEXT NOT NULL CHECK (
        relation_type IN ('INDICATES', 'TREATED_BY', 'CONTRADICTS')
    ),
    weight REAL NOT NULL,
    rationale TEXT NOT NULL,
    FOREIGN KEY (source_node_id) REFERENCES clinical_graph_nodes(node_id),
    FOREIGN KEY (target_node_id) REFERENCES clinical_graph_nodes(node_id)
);

-- 4. Multi-Agent Diagnostic Analyses Table
CREATE TABLE IF NOT EXISTS diagnostic_analyses (
    analysis_id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    pathology_node_id TEXT NOT NULL,
    triage_urgency TEXT NOT NULL CHECK (triage_urgency IN ('CRITICAL', 'ELEVATED', 'ROUTINE')),
    confidence_score INTEGER NOT NULL,
    safety_gate_triggered INTEGER NOT NULL DEFAULT 0,
    safety_audit_notes TEXT NOT NULL,
    primary_finding TEXT NOT NULL,
    rationale TEXT NOT NULL,
    post_op_summary TEXT NOT NULL,
    latency_ms INTEGER NOT NULL,
    FOREIGN KEY (case_id) REFERENCES dicom_studies(case_id),
    FOREIGN KEY (pathology_node_id) REFERENCES clinical_graph_nodes(node_id)
);

-- 5. Segmented Regions of Interest (ROIs / Bounding Boxes)
CREATE TABLE IF NOT EXISTS regions_of_interest (
    roi_id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    label TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'ELEVATED', 'ROUTINE')),
    x_pct REAL NOT NULL,
    y_pct REAL NOT NULL,
    width_pct REAL NOT NULL,
    height_pct REAL NOT NULL,
    finding_code TEXT NOT NULL,
    density_metric TEXT NOT NULL,
    agent_source TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES dicom_studies(case_id)
);

-- 6. Differential Diagnoses Table
CREATE TABLE IF NOT EXISTS differential_diagnoses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT NOT NULL,
    rank_order INTEGER NOT NULL,
    condition_name TEXT NOT NULL,
    probability_pct INTEGER NOT NULL,
    icd10_code TEXT NOT NULL,
    supporting_feature TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES dicom_studies(case_id)
);

-- 7. Trilingual Patient Empathy Translations (EN / Marathi / Hindi)
CREATE TABLE IF NOT EXISTS patient_translations (
    case_id TEXT PRIMARY KEY,
    summary_english TEXT NOT NULL,
    summary_marathi TEXT NOT NULL,
    summary_hindi TEXT NOT NULL,
    comforting_analogy TEXT NOT NULL,
    questions_json TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES dicom_studies(case_id)
);

-- 8. AI Safety Governance & Attending Override Audit Logs
CREATE TABLE IF NOT EXISTS governance_audit_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT NOT NULL,
    confidence_score INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    attending_physician TEXT NOT NULL,
    notes TEXT NOT NULL,
    logged_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES dicom_studies(case_id)
);
