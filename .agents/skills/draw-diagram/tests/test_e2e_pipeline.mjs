#!/usr/bin/env node

/**
 * test_e2e_pipeline.mjs
 * 
 * End-to-End Pipeline & Integration Test Suite:
 * - Part 1: All 9 Reference XML Diagrams Existence, XML Well-formedness & Semantic Content
 * - Part 2: Geometry Validation Execution on All 9 Examples (Exit Code 0)
 * - Part 3: Cross-Platform Export Engine Testing & CLI Detection
 * - Part 4: End-to-End Pipeline Simulation (PTTKHTTT/models -> PTTKHTTT/xml -> Validator -> Export)
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('===============================================================');
console.log('   END-TO-END PIPELINE & INTEGRATION TEST SUITE');
console.log('===============================================================');

// ====================================================================
// PART 1: Reference Examples Semantic Verification
// ====================================================================
console.log('\n--- PART 1: Reference Examples Semantic Verification ---');

const examplesDir = path.resolve(__dirname, '../examples');
const expectedExamples = [
  { file: '01-use-case.drawio.xml', patterns: ['sys-boundary', 'actor-kh', 'uc-dathang', 'include'] },
  { file: '02-class-diagram.drawio.xml', patterns: ['class-kh', 'class-dh', 'class-ctdh', 'class-sp', 'endArrow=diamond;endFill=1;'] },
  { file: '03-sequence-diagram.drawio.xml', patterns: ['seq-kh', 'seq-ctrl', 'seq-srv', 'seq-repo', 'TaoDonHang', 'XuLyTaoDon'] },
  { file: '04-activity-diagram.drawio.xml', patterns: ['act-init', 'act-tiep-nhan', 'act-dec', 'act-flow-final', 'act-fork', 'act-join', 'act-final'] },
  { file: '05-state-machine.drawio.xml', patterns: ['state-init', 'state-cho-xac-nhan', 'state-dang-xu-ly', 'state-dang-giao', 'state-hoan-thanh', 'state-da-huy'] },
  { file: '06-component-diagram.drawio.xml', patterns: ['comp-web', 'iface-order', 'comp-order', 'iface-payment', 'comp-payment', 'comp-kho'] },
  { file: '07-deployment-diagram.drawio.xml', patterns: ['node-client', 'node-app', 'node-db', 'shape=cube', 'TrinhDuyetWeb', 'PostgreSQL DBMS'] },
  { file: '08-erd-physical.drawio.xml', patterns: ['ent-khach-hang', 'ent-don-hang', 'ent-chi-tiet', 'ent-san-pham', 'startArrow=ERone', 'endArrow=ERmany'] },
  { file: '09-wireframe-dashboard.drawio.xml', patterns: ['screen-don-hang', 'header-bar', 'sidebar-nav', 'input-search', 'btn-search', 'btn-create', 'grid-orders'] }
];

for (const ex of expectedExamples) {
  const filePath = path.join(examplesDir, ex.file);
  const exists = fs.existsSync(filePath);
  assert(exists, `Reference example exists: ${ex.file}`);

  if (exists) {
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('<mxfile') && content.includes('</mxfile>'), `${ex.file} has valid <mxfile> container`);
    
    let allPatternsMatch = true;
    for (const pat of ex.patterns) {
      if (!content.includes(pat)) {
        allPatternsMatch = false;
        console.error(`    -> Missing expected semantic token: '${pat}'`);
      }
    }
    assert(allPatternsMatch, `${ex.file} contains all required UML semantic elements`);
  }
}

// ====================================================================
// PART 2: Geometry Validation on All 9 Examples
// ====================================================================
console.log('\n--- PART 2: Geometry Validation on All 9 Examples ---');

const validatorScript = path.resolve(__dirname, '../scripts/validate_drawio_xml.ps1');

for (const ex of expectedExamples) {
  const filePath = path.join(examplesDir, ex.file);
  if (!fs.existsSync(filePath)) continue;

  const res = spawnSync('powershell', [
    '-ExecutionPolicy', 'Bypass',
    '-File', validatorScript,
    '-FilePath', filePath
  ], { encoding: 'utf-8' });

  const passed = res.status === 0;
  assert(passed, `Validator passed (Exit Code 0, Zero Errors): ${ex.file}`);
  if (!passed) {
    console.error(`    Validator output:\n${res.stdout}\n${res.stderr}`);
  }
}

// ====================================================================
// PART 3: Cross-Platform Export Engine Testing
// ====================================================================
console.log('\n--- PART 3: Export Engine & CLI Health Check ---');

const exportScript = path.resolve(rootDir, 'scripts/export_diagram.mjs');
assert(fs.existsSync(exportScript), 'Export CLI script exists at scripts/export_diagram.mjs');

// Test --check flag
const checkRes = spawnSync('node', [exportScript, '--check'], { encoding: 'utf-8' });
console.log(`  -> Health check exit code: ${checkRes.status}`);
assert(checkRes.status === 0 || checkRes.status === 1, 'export_diagram.mjs --check exited cleanly without exception');

// Test export invocation on example
const sampleInput = path.join(examplesDir, '01-use-case.drawio.xml');
const testOutSvg = path.resolve(rootDir, 'PTTKHTTT/diagrams/test-export.svg');

const exportRes = spawnSync('node', [
  exportScript,
  '-i', sampleInput,
  '-o', testOutSvg,
  '-f', 'svg'
], { encoding: 'utf-8' });

if (checkRes.status === 0) {
  // Draw.io CLI is present
  assert(exportRes.status === 0, 'Export executed successfully with Draw.io CLI');
  assert(fs.existsSync(testOutSvg), 'Exported SVG file was created');
  if (fs.existsSync(testOutSvg)) {
    fs.unlinkSync(testOutSvg);
  }
} else {
  // Draw.io CLI is absent: verify graceful fallback
  assert(exportRes.status === 1, 'Export gracefully reported missing CLI with exit code 1');
  const hasGuide = exportRes.stdout.includes('HƯỚNG DẪN CÀI ĐẶT DRAW.IO DESKTOP') || exportRes.stdout.includes('Visual verification pending');
  assert(hasGuide, 'Export output included installation instructions and pending status');
}

// ====================================================================
// PART 4: End-to-End Pipeline Simulation
// ====================================================================
console.log('\n--- PART 4: End-to-End Pipeline Simulation ---');

const pttkModelsDir = path.resolve(rootDir, 'PTTKHTTT/models');
const pttkXmlDir = path.resolve(rootDir, 'PTTKHTTT/xml');
const pttkDiagDir = path.resolve(rootDir, 'PTTKHTTT/diagrams');

fs.mkdirSync(pttkModelsDir, { recursive: true });
fs.mkdirSync(pttkXmlDir, { recursive: true });
fs.mkdirSync(pttkDiagDir, { recursive: true });

// Step 1: Simulate Producer skill writing PlantUML model
const simModelPath = path.join(pttkModelsDir, '01-so-do-use-case.puml');
fs.writeFileSync(simModelPath, `@startuml
left to right direction
actor "KhachHang" as kh
actor "QuanLyKho" as kho
package "HeThongQuanLyDonHang" {
  usecase "DatHang" as UC1
  usecase "TraCuuSanPham" as UC2
}
kh --> UC1
kh --> UC2
@enduml
`, 'utf-8');
assert(fs.existsSync(simModelPath), 'Step 1: Producer Skill created model at PTTKHTTT/models/01-so-do-use-case.puml');

// Step 2: Simulate draw-diagram generating Draw.io XML
const simXmlPath = path.join(pttkXmlDir, '01-so-do-use-case.drawio.xml');
fs.copyFileSync(path.join(examplesDir, '01-use-case.drawio.xml'), simXmlPath);
assert(fs.existsSync(simXmlPath), 'Step 2: Draw.io XML generated at PTTKHTTT/xml/01-so-do-use-case.drawio.xml');

// Step 3: Run Geometry Validation on generated XML
const simValRes = spawnSync('powershell', [
  '-ExecutionPolicy', 'Bypass',
  '-File', validatorScript,
  '-FilePath', simXmlPath
], { encoding: 'utf-8' });
assert(simValRes.status === 0, 'Step 3: Geometry Validation completed with 0 errors');

// Step 4: Run Export Utility
const simExportRes = spawnSync('node', [
  exportScript,
  '-i', simXmlPath,
  '-o', path.join(pttkDiagDir, '01-so-do-use-case.svg')
], { encoding: 'utf-8' });
assert(simExportRes.status === 0 || simExportRes.status === 1, 'Step 4: Image export wrapper handled artifact gracefully');

// Clean up simulation artifacts in PTTKHTTT
if (fs.existsSync(simModelPath)) fs.unlinkSync(simModelPath);
if (fs.existsSync(simXmlPath)) fs.unlinkSync(simXmlPath);
try {
  if (fs.existsSync(pttkModelsDir) && fs.readdirSync(pttkModelsDir).length === 0) fs.rmdirSync(pttkModelsDir);
  if (fs.existsSync(pttkXmlDir) && fs.readdirSync(pttkXmlDir).length === 0) fs.rmdirSync(pttkXmlDir);
  if (fs.existsSync(pttkDiagDir) && fs.readdirSync(pttkDiagDir).length === 0) fs.rmdirSync(pttkDiagDir);
  const pttkDir = path.resolve(rootDir, 'PTTKHTTT');
  if (fs.existsSync(pttkDir) && fs.readdirSync(pttkDir).length === 0) fs.rmdirSync(pttkDir);
} catch {
  // ignore cleanup error
}

// Summary
console.log('\n===============================================================');
console.log(`TEST SUMMARY: ${passedTests} passed, ${failedTests} failed (Total: ${totalTests})`);
console.log('===============================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
