# RadiX — Full-Stack 3-Tier Enterprise PACS & Multi-Agent Clinical Co-Pilot

This archive is organized into three separated architectural tiers: **Frontend**, **Backend**, and **Database**.

```text
radix-fullstack-architecture/
├── frontend/                  # Tier 1: Next.js 15 (App Router) + TypeScript + 21st.dev & shadcn/ui
│   ├── app/                   # PACS Workstation UI, Command Palette (⌘K), Radial SVG Gauges
│   ├── components/ui/         # Modular 21st.dev dark clinical glassmorphic components
│   ├── lib/                   # Clinical graph types & DICOM header utilities
│   ├── public/scans/          # Preset clinical radiographs & CT scans
│   └── package.json
├── backend/                   # Tier 2: Node.js + Express + TypeScript + @google/genai (gemini-2.5-flash)
│   ├── src/
│   │   ├── server.ts          # REST API (/api/analyze, /api/cases, /api/knowledge-graph/:tag)
│   │   ├── agents/            # Stage-1 Parallel Agents & Stage-2 CMO Orchestrator
│   │   └── services/          # Multi-Hop Clinical Knowledge Graph & DICOM Simulator services
│   └── package.json
├── database/                  # Tier 3: Relational + Clinical Knowledge Graph Database
│   ├── radix_clinical.sqlite  # Pre-built, populated SQLite3 database binary (ready to query)
│   ├── schema.sql             # SQL DDL for DICOM studies, graph nodes/edges, ROIs, & audit logs
│   ├── seed.sql               # Seed data for 15 clinical nodes, 12 directed edges, & 3 PACS cases
│   └── prisma/schema.prisma   # Prisma ORM schema for SQLite / PostgreSQL
├── docker-compose.yml         # Multi-container orchestration
└── package.json               # Root workspace convenience scripts
```

## Quick Start Instructions

### 1. Database Tier (`/database`)
The SQLite database (`database/radix_clinical.sqlite`) is already initialized and seeded. To inspect or re-seed manually:
```bash
cd database
sqlite3 radix_clinical.sqlite < schema.sql
sqlite3 radix_clinical.sqlite < seed.sql
```

### 2. Backend Tier (`/backend` — Port `4000`)
```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env           # Add your GEMINI_API_KEY (or use the resilient fallback)
npm run dev                    # Starts Express API server on http://localhost:4000
```

### 3. Frontend Tier (`/frontend` — Port `3000`)
```bash
cd frontend
npm install --legacy-peer-deps
cp .env.local.example .env.local
npm run dev                    # Launches the 21st.dev + shadcn/ui PACS Workstation on http://localhost:3000
```
