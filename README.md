# umlutt: System Analysis & Draw.io Diagram Pipeline

[![npm version](https://img.shields.io/npm/v/umlutt.svg)](https://www.npmjs.com/package/umlutt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](package.json)

A standardized, Vietnamese-first AI Agent Skills library specialized in Information Systems Analysis and Design (PTTKHTTT) for academic coursework and capstone projects. Built for seamless cross-platform operation with Google Antigravity, Gemini CLI, Anthropic Claude Code, and OpenAI Codex.

---

## 1. Quick Start

Install and configure the complete skill suite in your project in under 30 seconds:

### Step 1: Initialize into your workspace
Run in your project root:

```bash
npx umlutt init
```

This command automatically deploys:
- `.agents/skills/`: Canonical skills and layout grammars (Antigravity / Gemini / Codex).
- `.claude/skills/`: Thin proxy adapters for Claude Code.
- `.agents/rules/`: Shared naming rules (`system-naming.md`) and relative path rules (`relative-paths.md`).
- `scripts/`: Graphic export tooling (`export_diagram.mjs`).

### Step 2: Trigger AI Agent Slash Commands
Open your project with Antigravity, Claude Code, or Gemini CLI and use slash commands in the chat prompt:

```text
/system-analysis
```
Coordinates the complete 6-phase project lifecycle according to your current repository state (State A: Empty, State B: Existing docs, State C: Existing codebase).

```text
/draw-diagram Create a Use Case diagram for library borrowing management
```
Generates geometry-validated Draw.io XML (`<mxfile>`) and saves it directly to `PTTKHTTT/xml/`.

### Step 3: Export Diagrams to SVG / PNG
Export your validated XML files to publication-ready vector or bitmap images:

```bash
node scripts/export_diagram.mjs -i PTTKHTTT/xml/01-use-case.drawio.xml -o PTTKHTTT/diagrams/01-use-case.svg
```

---

## 2. CLI Reference

Manage your agent skills using the built-in `umlutt` CLI:

- **Initialize all skills and rules:**
  ```bash
  npx umlutt init
  ```
- **Install a specific skill (and its dependencies):**
  ```bash
  npx umlutt add draw-diagram
  npx umlutt add system-analysis
  ```
- **Diagnose local environment (Node.js, PowerShell, Draw.io CLI):**
  ```bash
  npx umlutt doctor
  ```
- **List all available skills in the catalog:**
  ```bash
  npx umlutt list
  ```
- **View detailed information about a skill:**
  ```bash
  npx umlutt info draw-diagram
  ```

---

## 3. Supported Diagrams

The library provides formal XML style guides, layout grammars, and reference implementations for 9 core diagram types:

- **Use Case Diagram:** Actors, Use Cases (`[StrongVerb] + [Noun]`), solid associations, dashed `<<include>>`/`<<extend>>`, and generalization (`examples/01-use-case.drawio.xml`).
- **Class Diagram:** Domain classes with single-cell table compartments, `<hr>` dividers, PascalCase class names, and camelCase attributes/methods (`examples/02-class-diagram.drawio.xml`).
- **Sequence Diagram:** Lifelines, synchronous calls (`classic;endFill=1`), asynchronous messages, reply messages, and create messages (`examples/03-sequence-diagram.drawio.xml`).
- **Activity Diagram:** Actions (rounded rect), Decision/Merge (rhombus), vertical Fork/Join synchronization bars with isolated ports, and Flow Final with X (`examples/04-activity-diagram.drawio.xml`).
- **State Machine Diagram:** States, transitions with triggers and guards, initial nodes, and final states (`examples/05-state-machine.drawio.xml`).
- **Component Diagram:** Components with OMG folder icons, Provided Interfaces (Lollipop), and Required Interfaces (`examples/06-component-diagram.drawio.xml`).
- **Deployment Diagram:** Hardware nodes (3D cube), execution environments, artifacts, and communication paths (`examples/07-deployment-diagram.drawio.xml`).
- **Entity-Relationship Diagram (ERD):** Physical database tables with PK/FK definitions and Crow's foot cardinality notation (`examples/08-erd-physical.drawio.xml`).
- **UI Wireframe Dashboard:** Low-fidelity mockups with header navigation, sidebar menus, and data tables (`examples/09-wireframe-dashboard.drawio.xml`).

---

## 4. Architecture

The library follows a decoupled, three-tier architecture that prevents circular dependencies:

- **Tier 1 (Coordinator):** `/system-analysis` orchestrates the project lifecycle, schedules milestones, and verifies traceability across deliverables.
- **Tier 2 (Domain Producers):**
  - `system-analysis-survey`: Problem statements (`VD-xx`), interviews, and scope baseline.
  - `system-analysis-requirements`: Functional (`FR-xx`), Non-functional (`NFR-xx`), Business Rules (`BR-xx`), and Use Cases (`UC-xx`).
  - `system-analysis-uml`: Semantic UML modeling for 7 OMG diagram types (PlantUML primary, Mermaid fallback).
  - `system-analysis-data`: Conceptual, logical, and physical data modeling (3NF normalization, snake_case DB mapping).
  - `system-analysis-ui`: Screen interaction flows and low-fidelity wireframes.
  - `system-analysis-audit`: End-to-end traceability verification and pre-implementation gatekeeping.
- **Infrastructure Engine:** `/draw-diagram` ingests semantic models, calculates geometry, serializes Draw.io XML, and executes automated collision validation.

---

## 5. Output Deliverables Structure

All project deliverables are organized within the standardized `PTTKHTTT/` directory:

```text
PTTKHTTT/
|-- README.md                          # Traceability matrix and milestone index
|-- 01-khao-sat-va-pham-vi.md          # Survey findings and scope baseline
|-- 02-yeu-cau-va-use-case.md          # Requirements catalog and Use Case specs
|-- 03-so-do-use-case.md               # Use Case diagrams
|-- 04-bieu-do-lop.md                  # Domain Class Diagram
|-- 05-bieu-do-tuan-tu.md              # Sequence Diagrams for core workflows
|-- 06-bieu-do-hoat-dong.md            # Activity Diagrams
|-- 07-bieu-do-trang-thai.md           # State Machine Diagrams
|-- 08-bieu-do-thanh-phan.md           # Component Diagram
|-- 09-bieu-do-trien-khai.md           # Deployment Diagram
|-- 10-mo-hinh-du-lieu-erd.md          # Physical ERD and data dictionary
|-- 11-thiet-ke-giao-dien-wireframe.md # Low-fidelity wireframes
|-- models/                            # Source models (.puml, .mmd)
|-- xml/                               # Editable Draw.io XML files (.drawio.xml)
`-- diagrams/                          # Exported vector / raster diagrams (.svg, .png)
```

---

## 6. Automated Testing

Run the automated verification suite to validate XML mappings and mathematical geometry:

```bash
# Run targeted documentation, symbol mapping, and integration tests:
npm test

# Run the 26-case mathematical geometry validator (OBB/SAT, clipping, collision):
npm run test:pwsh
```

---

## 7. Requirements & Limitations

- **Prerequisites:** Node.js >= 18.0.0, Windows PowerShell 5.1 or PowerShell Core 7+ (`pwsh`).
- **Graphic Export:** Headless SVG/PNG rendering requires Draw.io Desktop (`winget install JGraph.Draw` or `brew install --cask drawio`). When absent, the exporter provides manual export guidance.
- **Pipeline Simulation:** Part 4 of the E2E test suite is an integration harness simulating file flow; model-to-XML conversion during actual development is driven by the LLM agent using skill instructions.
- **Environment Verification:** Automated test suites are verified on Windows. Running PowerShell tests on Linux/macOS requires `pwsh`.

---

## 8. License

Distributed under the [MIT License](package.json).
