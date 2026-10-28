# RadiX Database Tier (`/database`)

Contains both the **pre-built SQLite database binary** (`radix_clinical.sqlite`) and the raw SQL / Prisma schemas for PostgreSQL or SQLite deployment:

- `radix_clinical.sqlite`: Pre-populated SQLite3 database ready for immediate querying by the Backend API server.
- `schema.sql`: DDL tables (`dicom_studies`, `clinical_graph_nodes`, `clinical_graph_edges`, `diagnostic_analyses`, `regions_of_interest`, `differential_diagnoses`, `patient_translations`, `governance_audit_logs`).
- `seed.sql`: Pre-populated clinical knowledge graph nodes (`Pathology`, `AnatomicalSite`, `StandardProtocol`, `Contraindication`, `HistoricalPrecedent`), directed edges (`INDICATES`, `TREATED_BY`, `CONTRADICTS`), and PACS studies.
- `prisma/schema.prisma`: Prisma ORM schema definition.

## Inspecting the Database via CLI
```bash
sqlite3 radix_clinical.sqlite "SELECT node_id, node_type, clinical_code, label FROM clinical_graph_nodes;"
sqlite3 radix_clinical.sqlite "SELECT edge_id, source_node_id, relation_type, target_node_id, weight FROM clinical_graph_edges;"
```
