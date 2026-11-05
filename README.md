# umlutt: System Analysis & Draw.io Diagram Pipeline

A standardized Agent Skills library providing domain-specific workflows, structural rules, and rendering tooling for Information Systems Analysis and Design (Phan Tich va Thiet Ke He Thong Thong Tin - PTTKHTTT) course projects. Designed for interoperability across modern AI coding agents, including Google Antigravity / Gemini CLI, Anthropic Claude Code, and OpenAI Codex.

---

## 1. Project Overview

Academic software engineering and system analysis projects often suffer from fragmented documentation, inconsistent modeling syntax, and disconnected diagrams. When AI coding agents generate system specifications, they frequently produce:
- Syntactically invalid or non-standard UML symbols.
- Disconnected identifiers between requirements, domain models, and database schemas.
- Overlapping geometric elements, chaotic routing, and colliding text when rendering diagrams directly.

This repository resolves these challenges by providing:
- Structured multi-tier agent skills governing the full analysis and design lifecycle.
- Strict naming conventions (PascalCase entities, camelCase class members, structured Use Cases).
- An automated Draw.io XML generation and geometry validation pipeline.
- Cross-agent compatibility through a Single Source of Truth architecture and Thin Proxies.

---

## 2. Architecture

The system is organized into a three-tier hierarchical architecture that separates high-level lifecycle coordination, domain-specific semantic modeling, and low-level geometric rendering.

```text
[User Request / Course Assignment]
                 |
                 v
[Tier 1 Coordinator: system-analysis]
  - Assesses project state: State A (Empty), State B (Docs), State C (Code)
  - Schedules milestones and orchestrates Phase 1 to Phase 6
                 |
                 v
[Tier 2 Producer Skills]
  - system-analysis-survey       -> Scope baseline & problem statements (VD-xx)
  - system-analysis-requirements -> Functional (FR-xx), Non-functional (NFR-xx), BR-xx, UC-xx
  - system-analysis-uml          -> 7 OMG UML semantic models (PlantUML / Mermaid)
  - system-analysis-data         -> ERD, 3NF normalization, PK/FK mappings
  - system-analysis-ui           -> Screen interaction flows & low-fidelity wireframes
  - system-analysis-audit        -> End-to-end traceability & pre-implementation gate
                 |
                 v
[Semantic Models Output: PTTKHTTT/models/]
                 |
                 v
[Infrastructure Renderer: draw-diagram]
  - Translates semantic models into valid Draw.io XML (<mxfile>)
  - Applies orthogonal layout grammars and explicit connection ports
  - Stores output in PTTKHTTT/xml/<diagram>.drawio.xml
                 |
                 +-----------------------+
                 |                       |
                 v                       v
      [Geometry Validation]      [Image Export Wrapper]
      validate_drawio_xml.ps1    export_diagram.mjs
      - OBB/SAT separation       - Locates Draw.io CLI
      - Liang-Barsky clipping    - Exports SVG / PNG to
      - Boundary & text check      PTTKHTTT/diagrams/
```

### Skill Coordination & Anti-Recursion
- **Instruction-Level Orchestration:** Skills provide procedural knowledge and prompt instructions for AI agents. They do not run as a persistent background daemon.
- **Strict Decoupling:** The Tier 1 coordinator (`system-analysis`) invokes domain producer skills sequentially and calls `draw-diagram` only during the rendering stage.
- **Anti-Recursion Constraint:** The `draw-diagram` skill is strictly an infrastructure renderer and validator. It is barred from calling back into `system-analysis` to request business analysis modifications, preventing circular reasoning loops.

---

## 3. Skills Structure

The repository maintains a strict separation between canonical skill definitions, platform adapters, and universal rules:

- **`.agents/skills/` (Single Source of Truth):**
  Contains the canonical skill implementations. Each skill folder includes a primary `SKILL.md` file with standardized YAML frontmatter (`name`, `description`) and optional `references/`, `scripts/`, or `examples/` subdirectories. Directly consumed by Antigravity, Gemini CLI, and OpenAI Codex.
- **`.claude/skills/` (Thin Proxy Layer):**
  Provides lightweight adapter files for Claude Code. Each proxy `SKILL.md` references the canonical skill via relative paths (e.g., `../../../.agents/skills/<skill-name>/SKILL.md`), eliminating content duplication.
- **`.agents/rules/` (Cross-Cutting Constraints):**
  Always-active repository rules:
  - `system-naming.md`: Enforces PascalCase for Classes, Actors, Use Cases, Entities, States, and Components; camelCase for Class attributes and methods; snake_case for physical database schemas.
  - `relative-paths.md`: Enforces portable relative pathing and strictly prohibits hardcoded absolute machine paths.

---

## 4. Diagram Support

The system provides formal style specifications, layout grammars, and reference implementations for nine core diagram types:

1. **Use Case Diagram:** Actors, Use Cases (`[StrongVerb] + [Noun]`), Associations (`endArrow=none;endFill=0;`), `<<include>>` and `<<extend>>` dependencies (`dashed=1;endArrow=open;`), and Generalization (`classic;endFill=0;`).
2. **Class Diagram:** Domain entities formatted as single-cell table containers with `<hr>` compartment dividers, PascalCase class names, and camelCase attributes/methods.
3. **Sequence Diagram:** Lifelines, Synchronous Call (`classic;endFill=1;`), Asynchronous Call (`open;endFill=0;`), Reply Message (`dashed=1;endArrow=open;`), Create Message (`dashed=1;endArrow=open;`), and Destruction Occurrence (`umlDestroy;strokeWidth=1;`).
4. **Activity Diagram:** Actions (rounded rectangles), Decision/Merge nodes (rhombus), Fork/Join synchronization bars (solid black bars with isolated ports), Initial nodes, Activity Final (bullseye), and Flow Final (circle with X, `collapsible=0;`).
5. **State Machine Diagram:** States (rounded rectangles), Transitions with triggers and `[guard]` conditions, Initial states, and Final states.
6. **Component Diagram:** Components with standard folder icons, Provided Interfaces (Lollipop circles), and Required Interfaces (dashed dependency connectors).
7. **Deployment Diagram:** Hardware nodes (3D cube shapes), Devices, Execution Environments, Artifacts, and Communication Paths with explicit boundary ports.
8. **Entity-Relationship Diagram (ERD):** Physical database tables with column definitions, Primary Keys (PK), Foreign Keys (FK), and Crow's foot cardinality notation (`ERoneToMany`, `ERmandatoryOne`).
9. **UI Wireframe Dashboard:** Low-fidelity mockups using modular layout grids, header bars, sidebar navigation, data tables, and form controls.

---

## 5. Diagram Workflow

The process of generating publication-ready diagrams proceeds through four distinct stages:

```text
[Input Specification / Domain Model]
                 │
                 ▼
Stage 1: Semantic Modeling (Producer Skills)
         Generates PlantUML (.puml) or Mermaid (.mmd) files in PTTKHTTT/models/
                 │
                 ▼
Stage 2: Draw.io XML Serialization (draw-diagram)
         Computes node dimensions, port offsets, and connector routing.
         Produces standard Draw.io XML in PTTKHTTT/xml/<diagram>.drawio.xml
                 │
                 ▼
Stage 3: Automated Geometry Validation (validate_drawio_xml.ps1)
         Parses mxGraph geometry and checks 10 validation criteria:
         - Node-node overlap and container containment.
         - Edge-node penetrations via Liang-Barsky line clipping.
         - Oriented Bounding Box (OBB) separation using SAT for rotated elements.
         - Ellipse and rhombus specific boundary collisions.
         - Multiline and wrapped text boundary overflow.
         - Port congestion and connection distribution.
                 │
                 ▼
Stage 4: Graphic Export (export_diagram.mjs)
         Invokes Draw.io Desktop CLI to render cropped SVG/PNG files into PTTKHTTT/diagrams/.
         Falls back gracefully with manual export guidance if CLI is not installed.
```

---

## 6. Repository Structure

The actual repository layout is structured as follows:

```text
.
|-- .agents/
|   |-- rules/
|   |   |-- relative-paths.md
|   |   `-- system-naming.md
|   `-- skills/
|       |-- draw-diagram/
|       |   |-- SKILL.md
|       |   |-- examples/
|       |   |   |-- 01-use-case.drawio.xml
|       |   |   |-- 02-class-diagram.drawio.xml
|       |   |   |-- 03-sequence-diagram.drawio.xml
|       |   |   |-- 04-activity-diagram.drawio.xml
|       |   |   |-- 05-state-machine.drawio.xml
|       |   |   |-- 06-component-diagram.drawio.xml
|       |   |   |-- 07-deployment-diagram.drawio.xml
|       |   |   |-- 08-erd-physical.drawio.xml
|       |   |   `-- 09-wireframe-dashboard.drawio.xml
|       |   |-- references/
|       |   |   |-- geometry-system.md
|       |   |   |-- layout-grammars.md
|       |   |   `-- xml-style-guide.md
|       |   |-- scripts/
|       |   |   |-- export_diagram.mjs
|       |   |   `-- validate_drawio_xml.ps1
|       |   `-- tests/
|       |       |-- fixtures/
|       |       |-- run_tests.ps1
|       |       |-- test_e2e_pipeline.mjs
|       |       `-- test_targeted_mappings.mjs
|       |-- system-analysis/
|       |   |-- SKILL.md
|       |   `-- references/
|       |       |-- project-lifecycle.md
|       |       `-- traceability-matrix.md
|       |-- system-analysis-audit/
|       |   |-- SKILL.md
|       |   `-- references/
|       |       `-- audit-protocols.md
|       |-- system-analysis-data/
|       |   |-- SKILL.md
|       |   `-- references/
|       |       `-- data-modeling-guide.md
|       |-- system-analysis-requirements/
|       |   |-- SKILL.md
|       |   `-- references/
|       |       `-- requirements-templates.md
|       |-- system-analysis-survey/
|       |   |-- SKILL.md
|       |   `-- references/
|       |       `-- survey-templates.md
|       |-- system-analysis-ui/
|       |   |-- SKILL.md
|       |   `-- references/
|       |       `-- wireframe-patterns.md
|       `-- system-analysis-uml/
|           |-- SKILL.md
|           `-- references/
|               `-- uml-consistency-matrix.md
|-- .claude/
|   `-- skills/
|       |-- draw-diagram/
|       |-- system-analysis/
|       |-- system-analysis-audit/
|       |-- system-analysis-data/
|       |-- system-analysis-requirements/
|       |-- system-analysis-survey/
|       |-- system-analysis-ui/
|       `-- system-analysis-uml/
|-- bin/
|   `-- cli.mjs
|-- scripts/
|   |-- .gitkeep
|   `-- export_diagram.mjs
|-- .gitignore
|-- AGENTS.md
|-- CLAUDE.md
|-- package.json
`-- README.md
```

---

## 7. Installation & Requirements

### Automated Installation via NPX
The quickest way to add the skills to an existing project is using `npx`:

```bash
# Initialize and install all skills into the current workspace:
npx umlutt init

# Install a specific skill (e.g., Draw.io rendering engine):
npx umlutt add draw-diagram

# Run environment diagnosis (Node.js, PowerShell, Draw.io Desktop CLI):
npx umlutt doctor

# List all available skills:
npx umlutt list
```

### Prerequisites
- **Node.js:** v18.0.0 or later (v20.x LTS recommended). ES module support enabled.
- **PowerShell:** Windows PowerShell 5.1 (bundled with Windows) or PowerShell 7+ (`pwsh`) on Unix/macOS.
- **Draw.io Desktop CLI:** Required for automated SVG/PNG image rendering.

### Installing Draw.io Desktop
- **Windows (winget):**
  ```powershell
  winget install JGraph.Draw
  ```
- **macOS (Homebrew):**
  ```bash
  brew install --cask drawio
  ```
- **Linux (Debian/Ubuntu):**
  ```bash
  sudo apt install drawio
  ```

### Configuring `DRAWIO_PATH`
If Draw.io Desktop is installed in a non-standard location or used in portable mode, configure the `DRAWIO_PATH` environment variable:

- **Windows (PowerShell):**
  ```powershell
  $env:DRAWIO_PATH = "C:\CustomPath\draw.io\draw.io.exe"
  ```
- **macOS / Linux:**
  ```bash
  export DRAWIO_PATH="/custom/path/to/drawio"
  ```

---

## 8. Usage

### AI Agent Invocations
When interacting with AI coding assistants supporting AG Kit, Antigravity, or Claude Code:
- Trigger overall project lifecycle analysis:
  ```text
  /system-analysis
  ```
- Request direct Draw.io XML generation and diagram rendering:
  ```text
  /draw-diagram
  ```

### Validating Draw.io XML Files
Run the PowerShell geometry validator directly against any `.drawio.xml` file:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/draw-diagram/scripts/validate_drawio_xml.ps1 -FilePath .agents/skills/draw-diagram/examples/01-use-case.drawio.xml
```

Add the `-Detailed` flag for verbose geometric reporting:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/draw-diagram/scripts/validate_drawio_xml.ps1 -FilePath .agents/skills/draw-diagram/examples/01-use-case.drawio.xml -Detailed
```

### Exporting Diagrams
Check if the Draw.io CLI is detected on the local system:

```bash
node scripts/export_diagram.mjs --check
```

Export a diagram to SVG (default) or PNG:

```bash
node scripts/export_diagram.mjs -i PTTKHTTT/xml/01-use-case.drawio.xml -o PTTKHTTT/diagrams/01-use-case.svg
node scripts/export_diagram.mjs -i PTTKHTTT/xml/01-use-case.drawio.xml -f png
```

---

## 9. Testing

The repository provides automated test suites verifying documentation consistency, XML symbol correctness, geometry calculations, and CLI integration.

### Test Commands

Run the primary Node.js test suites (targeted mappings + e2e pipeline):
```bash
npm test
```

Run targeted documentation, symbol mapping, and geometric unit math checks:
```bash
npm run test:targeted
```

Run the four-part integration test suite:
```bash
npm run test:e2e
```

Run the 26-case PowerShell geometry false positive/negative test suite:
```powershell
npm run test:pwsh
```

Run all test suites sequentially:
```bash
npm run test:all
```

### Test Suite Descriptions
- **`npm run test:targeted` (`test_targeted_mappings.mjs`):**
  - *Part 1:* Asserts documentation consistency across reference guides (synchronous call markers, generalization candidates, create message dashed lines, Flow Final circle with X, destruction marker styling).
  - *Part 2:* Validates XML fixtures (`minimal-uml-symbols.drawio.xml`) to ensure generated tags match UML 2.5.1 standards.
  - *Part 3:* Regression testing for container attributes, collinear overlaps, and port balance.
  - *Part 4:* Unit and integration testing for mathematical geometry functions (Separating Axis Theorem for OBBs, ellipse boundary clipping, and rhombus collinearity).
- **`npm run test:e2e` (`test_e2e_pipeline.mjs`):**
  - *Part 1:* Structural and semantic token validation across all 9 canonical example XML files in `examples/`.
  - *Part 2:* Executes `validate_drawio_xml.ps1` against all 9 reference examples, verifying zero geometric errors.
  - *Part 3:* Verifies that `export_diagram.mjs` handles missing CLI dependencies gracefully without unhandled exceptions.
  - *Part 4:* Simulates an end-to-end pipeline run from model artifact creation through validation and export handling.
- **`npm run test:pwsh` (`run_tests.ps1`):**
  - Executes 26 distinct geometric boundary cases against `validate_drawio_xml.ps1`, testing false positive prevention and false negative detection across node collisions, container nesting, diagonal cutting edges, text overflows, port congestion, and rotated shapes.

---

## 10. Limitations

Users and integrators should be aware of the following architectural and environment boundaries:

- **Pipeline Simulation in E2E Testing:**
  Part 4 of `test_e2e_pipeline.mjs` is an integration test harness. It creates a sample model file and copies a reference XML to verify file flow and validator execution. It demonstrates pipeline mechanics and CLI safety, but does not represent an autonomous compiler compiling freeform text to XML at runtime. In actual use, model-to-XML conversion is performed by the LLM agent using the provided skill instructions.
- **Image Export & Visual QA:**
  In environments where Draw.io Desktop CLI is not installed, the export wrapper records a pending status and exits safely (code 1) with installation instructions. Because the test environment did not have Draw.io Desktop installed, rendered SVG/PNG artifacts have not been visually verified by human inspection. Visual layout quality relies on the mathematical guarantees of the geometry validator.
- **Cross-Platform Test Execution:**
  All test scripts and PowerShell suites have been executed and verified on Windows with PowerShell 5.1 and Node.js v20. On Linux and macOS, execution of `npm run test:pwsh` and the PowerShell subprocess in `test_e2e_pipeline.mjs` requires PowerShell Core (`pwsh`) or aliasing `powershell -> pwsh`. Full Unix/macOS automation has not yet been verified in a dedicated POSIX CI pipeline.
- **Diagram Modeling Simplifications:**
  Certain UML elements use pragmatic simplifications to avoid geometric false positives. For example, the reference Class Diagram utilizes single-cell table compartments with `<hr>` dividers rather than deeply nested child vertices, omitting explicit floating cardinality labels (`1`, `0..*`). Similarly, the reference Sequence Diagram models lifelines and arrows without explicit activation execution specification boxes.

---

## 11. Output Structure

When executing an analysis and design project, artifacts are organized within the `PTTKHTTT/` deliverable directory:

```text
PTTKHTTT/
|-- README.md                          # Traceability matrix and artifact map
|-- 01-khao-sat-va-pham-vi.md          # Survey findings & problem statements (VD-xx)
|-- 02-yeu-cau-va-use-case.md          # Requirements (FR/NFR/BR) & Use Case catalog (UC-xx)
|-- 03-so-do-use-case.md               # Use Case diagrams & subsystem breakdowns
|-- 04-bieu-do-lop.md                  # Domain Class Diagram
|-- 05-bieu-do-tuan-tu.md              # Sequence Diagrams for core transactions
|-- 06-bieu-do-hoat-dong.md            # Activity Diagrams for operational workflows
|-- 07-bieu-do-trang-thai.md           # State Machine Diagrams for lifecycle entities
|-- 08-bieu-do-thanh-phan.md           # Component Diagram and architectural services
|-- 09-bieu-do-trien-khai.md           # Deployment Diagram and infrastructure nodes
|-- 10-mo-hinh-du-lieu-erd.md          # Physical ERD, 3NF normalization & data dictionary
|-- 11-thiet-ke-giao-dien-wireframe.md # Low-fidelity wireframes & interaction flows
|-- models/                            # Source models (.puml, .mmd, scenario specs)
|-- xml/                               # Editable Draw.io XML files (.drawio.xml)
`-- diagrams/                          # Rendered publication diagrams (.svg, .png)
```

- **`PTTKHTTT/models/`:** Contains formal semantic source code (PlantUML `@startuml ... @enduml` or Mermaid code) and text scenario specifications generated by Producer Skills.
- **`PTTKHTTT/xml/`:** Contains fully serialized, geometry-validated Draw.io XML files (`<diagram-name>.drawio.xml`) that can be edited directly in Draw.io or diagrams.net.
- **`PTTKHTTT/diagrams/`:** Contains final rendered vector (`.svg`) or bitmap (`.png`) images exported via the Draw.io Desktop CLI for inclusion in reports, theses, or presentations.

---

## 12. License

This repository is distributed under the [MIT License](package.json).
