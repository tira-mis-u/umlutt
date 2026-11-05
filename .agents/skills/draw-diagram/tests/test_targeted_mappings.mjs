import fs from 'node:fs';
import path from 'node:path';

// Targeted UML Mapping and Documentation Consistency Test Script
// PART 1: Documentation Consistency Checks (Markdown references)
// PART 2: Actual Draw.io XML Symbol & Structural Verification (minimal-uml-symbols.drawio.xml)

const docFiles = {
  xmlGuide: '.agents/skills/draw-diagram/references/xml-style-guide.md',
  layoutGrammars: '.agents/skills/draw-diagram/references/layout-grammars.md',
  geometrySystem: '.agents/skills/draw-diagram/references/geometry-system.md',
  drawSkill: '.agents/skills/draw-diagram/SKILL.md',
  umlSkill: '.agents/skills/system-analysis-uml/SKILL.md',
  umlMatrix: '.agents/skills/system-analysis-uml/references/uml-consistency-matrix.md'
};

const fixturePath = '.agents/skills/draw-diagram/tests/fixtures/minimal-uml-symbols.drawio.xml';

const contents = {};
for (const [key, relPath] of Object.entries(docFiles)) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Documentation file missing: ${relPath}`);
    process.exit(1);
  }
  contents[key] = fs.readFileSync(fullPath, 'utf8');
}

if (!fs.existsSync(path.resolve(fixturePath))) {
  console.error(`[FAIL] Test fixture missing: ${fixturePath}`);
  process.exit(1);
}
const fixtureXml = fs.readFileSync(path.resolve(fixturePath), 'utf8');

let failed = false;
function assertCheck(name, condition, details = '') {
  if (condition) {
    console.log(`  [PASS] ${name}`);
  } else {
    console.error(`  [FAIL] ${name}${details ? ': ' + details : ''}`);
    failed = true;
  }
}

console.log('==========================================================');
console.log('  PART 1: DOCUMENTATION CONSISTENCY CHECKS (Markdown Files)');
console.log('==========================================================');

console.log('\n1.1. Synchronous Call Marker (classic;endFill=1) in reference guides:');
assertCheck(
  'xml-style-guide.md references classic;endFill=1 for Synchronous Call',
  contents.xmlGuide.includes('endArrow=classic;endFill=1;endSize=8;')
);
assertCheck(
  'layout-grammars.md references classic;endFill=1 for Synchronous Call',
  contents.layoutGrammars.includes('endArrow=classic;endFill=1;endSize=8;')
);
assertCheck(
  'SKILL.md (draw-diagram) references classic;endFill=1 for Synchronous Call',
  contents.drawSkill.includes('endArrow=classic;endFill=1;endSize=8;')
);
assertCheck(
  'SKILL.md (system-analysis-uml) references classic;endFill=1 for Synchronous Call',
  contents.umlSkill.includes('endArrow=classic;endFill=1')
);
assertCheck(
  'uml-consistency-matrix.md references classic;endFill=1 for Synchronous Call',
  contents.umlMatrix.includes('endArrow=classic;endFill=1;endSize=8;')
);

console.log('\n1.2. Generalization Marker (classic;endFill=0 candidate) in reference guides:');
assertCheck(
  'xml-style-guide.md references candidate classic;endFill=0 for Generalization',
  contents.xmlGuide.includes('endArrow=classic;endFill=0;endSize=10;')
);
assertCheck(
  'layout-grammars.md references candidate classic;endFill=0 for Generalization',
  contents.layoutGrammars.includes('endArrow=classic;endFill=0;endSize=10;')
);
assertCheck(
  'geometry-system.md references candidate classic;endFill=0 for Generalization',
  contents.geometrySystem.includes('endArrow=classic;endFill=0;endSize=10;')
);
assertCheck(
  'SKILL.md (draw-diagram) references candidate classic;endFill=0 for Generalization',
  contents.drawSkill.includes('endArrow=classic;endFill=0;endSize=10;')
);
assertCheck(
  'SKILL.md (system-analysis-uml) references candidate classic;endFill=0 for Generalization',
  contents.umlSkill.includes('endArrow=classic;endFill=0;endSize=10')
);

console.log('\n1.3. Create Message (UML 2.5.1 Section 17.4 - dashed line & open arrow) in documentation:');
assertCheck(
  'xml-style-guide.md specifies dashed=1 and endArrow=open;endFill=0 for Create Message',
  contents.xmlGuide.includes('messageSort=createMessage') &&
  contents.xmlGuide.includes('dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;')
);
assertCheck(
  'xml-style-guide.md specifies Lifeline starts at creation vertical coordinate',
  contents.xmlGuide.includes('Lifeline của Participant mới BẮT ĐẦU TẠI ĐÚNG CAO ĐỘ')
);
assertCheck(
  'layout-grammars.md specifies dashed=1 and open arrow for Create Message',
  contents.layoutGrammars.includes('dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;')
);
assertCheck(
  'SKILL.md (draw-diagram) specifies dashed line and creation timestamp for Create Message',
  contents.drawSkill.includes('dashed=1;dashPattern=4 4;endArrow=open;endFill=0;')
);
assertCheck(
  'SKILL.md (system-analysis-uml) specifies dashed line and creation timestamp for Create Message',
  contents.umlSkill.includes('dashed=1;dashPattern=4 4;endArrow=open;endFill=0')
);
assertCheck(
  'uml-consistency-matrix.md flags solid Create Message as anti-pattern',
  contents.umlMatrix.includes('dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;')
);

console.log('\n1.4. Flow Final Node (circle with X, no OR gate, no Unicode character default) in documentation:');
assertCheck(
  'xml-style-guide.md documents Flow Final as circle with X without mxgraph.flowchart.or as valid shape',
  contents.xmlGuide.includes('Flow Final Node') &&
  !contents.xmlGuide.includes('hoặc `shape=mxgraph.flowchart.or;html=1;`')
);
assertCheck(
  'layout-grammars.md documents Flow Final as circle with X without mxgraph.flowchart.or',
  contents.layoutGrammars.includes('Nút kết thúc luồng đơn lẻ (Flow Final Node)') &&
  !contents.layoutGrammars.includes('hoặc `shape=mxgraph.flowchart.or;`')
);
assertCheck(
  'SKILL.md (system-analysis-uml) explicitly distinguishes Flow Final from Destruction Occurrence',
  contents.umlSkill.includes('phân biệt triệt để với Destruction Occurrence trong Sequence Diagram')
);

console.log('\n1.5. Default Style for umlDestroy (strokeWidth=1, no strokeWidth=3) across references:');
assertCheck(
  'No occurrences of strokeWidth=3 on umlDestroy across xml-style-guide.md',
  !contents.xmlGuide.includes('shape=umlDestroy;whiteSpace=wrap;html=1;strokeWidth=3;')
);
assertCheck(
  'No occurrences of strokeWidth=3 on umlDestroy across geometry-system.md',
  !contents.geometrySystem.includes('shape=umlDestroy;whiteSpace=wrap;html=1;strokeWidth=3;')
);
assertCheck(
  'No occurrences of strokeWidth=3 on umlDestroy across layout-grammars.md',
  !contents.layoutGrammars.includes('strokeWidth=3')
);
assertCheck(
  'No occurrences of strokeWidth=3 on umlDestroy across draw-diagram SKILL.md',
  !contents.drawSkill.includes('shape=umlDestroy;strokeWidth=3;')
);
assertCheck(
  'No occurrences of strokeWidth=3 on umlDestroy across system-analysis-uml SKILL.md',
  !contents.umlSkill.includes('shape=umlDestroy;strokeWidth=3;')
);
assertCheck(
  'No occurrences of strokeWidth=3 on umlDestroy across uml-consistency-matrix.md',
  !contents.umlMatrix.includes('shape=umlDestroy;strokeWidth=3;')
);

console.log('\n1.6. Self-message exact description string in documentation:');
assertCheck(
  'xml-style-guide.md contains exact string: Không phải một Message Sort có kiểu đầu mũi tên riêng',
  contents.xmlGuide.includes('Không phải một Message Sort có kiểu đầu mũi tên riêng')
);
assertCheck(
  'layout-grammars.md contains exact string: Không phải một Message Sort có kiểu đầu mũi tên riêng',
  contents.layoutGrammars.includes('Không phải một Message Sort có kiểu đầu mũi tên riêng')
);
assertCheck(
  'SKILL.md (system-analysis-uml) contains exact string: Không phải một Message Sort có kiểu đầu mũi tên riêng',
  contents.umlSkill.includes('Không phải một Message Sort có kiểu đầu mũi tên riêng')
);

console.log('\n1.7. Reply Message description in documentation (UML 2.5.1 open or filled head allowance):');
assertCheck(
  'xml-style-guide.md clarifies UML 2.5.1 allows open or filled head for Reply Message',
  contents.xmlGuide.includes('UML 2.5.1 cho phép thông điệp trả về dùng đầu mũi tên mở hoặc tam giác tô kín')
);
assertCheck(
  'layout-grammars.md clarifies UML 2.5.1 allows open or filled head for Reply Message',
  contents.layoutGrammars.includes('UML 2.5.1 cho phép thông điệp trả về dùng đầu mũi tên mở hoặc tam giác tô kín')
);

console.log('\n==========================================================');
console.log('  PART 2: ACTUAL DRAW.IO XML ELEMENT & STRUCTURAL VERIFICATION');
console.log('  Fixture: minimal-uml-symbols.drawio.xml');
console.log('==========================================================');

// Helper to parse mxCells from Draw.io XML
function parseCells(xmlString) {
  const cells = new Map();
  const cellRegex = /<mxCell\s+([^>]+?)(?:\/>|>(.*?)<\/mxCell>)/gis;
  let match;

  while ((match = cellRegex.exec(xmlString)) !== null) {
    const attrString = match[1];
    const innerContent = match[2] || '';

    const attrs = {};
    const attrPairRegex = /([a-zA-Z0-9_]+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrPairRegex.exec(attrString)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }

    if (!attrs.id) continue;

    // Parse mxGeometry if present
    const geoMatch = /<mxGeometry\s+([^>]+?)(?:\/>|>(.*?)<\/mxGeometry>)/is.exec(innerContent || attrString);
    if (geoMatch) {
      const geoAttrs = {};
      let gMatch;
      while ((gMatch = attrPairRegex.exec(geoMatch[1])) !== null) {
        geoAttrs[gMatch[1]] = gMatch[2];
      }
      attrs.geometry = geoAttrs;
    }

    cells.set(attrs.id, attrs);
  }
  return cells;
}

const cells = parseCells(fixtureXml);

// 1. Use Case Association
console.log('\n2.1. Use Case Association (edge-uc-assoc):');
const ucAssoc = cells.get('edge-uc-assoc');
assertCheck('Edge exists', !!ucAssoc);
assertCheck('Association has endArrow=none and endFill=0', ucAssoc && ucAssoc.style.includes('endArrow=none') && ucAssoc.style.includes('endFill=0'));
assertCheck('Source is Actor and Target is Use Case', ucAssoc && ucAssoc.source === 'actor-sub' && ucAssoc.target === 'uc-base');

// 2. Use Case Generalization
console.log('\n2.2. Use Case Generalization (edge-uc-generalization):');
const ucGen = cells.get('edge-uc-generalization');
assertCheck('Edge exists', !!ucGen);
assertCheck('Generalization uses candidate classic;endFill=0', ucGen && ucGen.style.includes('endArrow=classic') && ucGen.style.includes('endFill=0'));
assertCheck('Direction is strictly Child (actor-sub) -> Parent (actor-base)', ucGen && ucGen.source === 'actor-sub' && ucGen.target === 'actor-base');

// 3. Use Case Include
console.log('\n2.3. Use Case Include (edge-uc-include):');
const ucInc = cells.get('edge-uc-include');
assertCheck('Edge exists', !!ucInc);
assertCheck('Include is dashed with open arrow', ucInc && ucInc.style.includes('dashed=1') && ucInc.style.includes('endArrow=open'));
assertCheck('Direction is Base (uc-base) -> Included (uc-included)', ucInc && ucInc.source === 'uc-base' && ucInc.target === 'uc-included');

// 4. Use Case Extend
console.log('\n2.4. Use Case Extend (edge-uc-extend):');
const ucExt = cells.get('edge-uc-extend');
assertCheck('Edge exists', !!ucExt);
assertCheck('Extend is dashed with open arrow', ucExt && ucExt.style.includes('dashed=1') && ucExt.style.includes('endArrow=open'));
assertCheck('Direction is Extending (uc-extending) -> Base (uc-base)', ucExt && ucExt.source === 'uc-extending' && ucExt.target === 'uc-base');

// 5. Activity Control Flow
console.log('\n2.5. Activity Control Flow (edge-act-flow1):');
const actFlow = cells.get('edge-act-flow1');
assertCheck('Edge exists', !!actFlow);
assertCheck('Control flow is solid with open arrow', actFlow && actFlow.style.includes('endArrow=open') && actFlow.style.includes('endFill=0') && !actFlow.style.includes('dashed=1'));
assertCheck('Connects Action (act-1) to Decision (act-decision)', actFlow && actFlow.source === 'act-1' && actFlow.target === 'act-decision');

// 6. Activity Decision/Merge
console.log('\n2.6. Activity Decision/Merge (act-decision):');
const actDecision = cells.get('act-decision');
assertCheck('Node exists', !!actDecision);
assertCheck('Decision uses rhombus shape', actDecision && actDecision.style.includes('rhombus') && actDecision.vertex === '1');

// 7. Activity Fork/Join
console.log('\n2.7. Activity Fork/Join (act-fork):');
const actFork = cells.get('act-fork');
assertCheck('Node exists', !!actFork);
assertCheck('Fork/Join is a solid black synchronization bar', actFork && actFork.style.includes('fillColor=#000000') && actFork.style.includes('strokeColor=#000000'));

// 8. Activity Flow Final — 12-point geometry verification
console.log('\n2.8. Activity Flow Final (act-flow-final & inscribed diagonals):');
const flowFinal = cells.get('act-flow-final');
const diag1 = cells.get('flow-final-diag1');
const diag2 = cells.get('flow-final-diag2');
const edgeToFinal = cells.get('edge-act-to-final');

// Check 1: Parent circle is 30×30 and has collapsible=0
const parentGeo = flowFinal && flowFinal.geometry;
assertCheck(
  'Check 1 (Parent circle 30×30, collapsible=0): act-flow-final has width=30, height=30, container=1, collapsible=0',
  parentGeo && parseFloat(parentGeo.width) === 30 && parseFloat(parentGeo.height) === 30 &&
  flowFinal && flowFinal.style.includes('container=1') && flowFinal.style.includes('collapsible=0')
);

// Check 2: Both diagonals are children of the circle
assertCheck(
  'Check 2 (Parent/child): diag1 and diag2 have parent="act-flow-final"',
  diag1 && diag1.parent === 'act-flow-final' && diag2 && diag2.parent === 'act-flow-final'
);

// Check 3: Child geometry uses LOCAL coordinates (x in [0,30), y in [0,30) — not canvas coords ~340,~289)
const d1Geo = diag1 && diag1.geometry;
const d2Geo = diag2 && diag2.geometry;
// Canvas coords would be ~340+ for x and ~275+ for y; local coords must be within [0, 30]
const d1IsLocal = d1Geo &&
  parseFloat(d1Geo.x) >= 0 && parseFloat(d1Geo.x) < 30 &&
  parseFloat(d1Geo.y) >= 0 && parseFloat(d1Geo.y) < 30;
const d2IsLocal = d2Geo &&
  parseFloat(d2Geo.x) >= 0 && parseFloat(d2Geo.x) < 30 &&
  parseFloat(d2Geo.y) >= 0 && parseFloat(d2Geo.y) < 30;
assertCheck(
  'Check 3 (Local coordinates): Child geometry uses local coords (x<30, y<30), NOT canvas-absolute coords',
  !!(d1IsLocal && d2IsLocal)
);

// Check 4: Center of each diagonal (before rotation) is at local (15, 15)
// Diagonal geometry: x=0, y=14, w=30, h=2 → center = (0+30/2, 14+2/2) = (15, 15)
const d1CenterX = d1Geo ? parseFloat(d1Geo.x) + parseFloat(d1Geo.width) / 2 : NaN;
const d1CenterY = d1Geo ? parseFloat(d1Geo.y) + parseFloat(d1Geo.height) / 2 : NaN;
const d2CenterX = d2Geo ? parseFloat(d2Geo.x) + parseFloat(d2Geo.width) / 2 : NaN;
const d2CenterY = d2Geo ? parseFloat(d2Geo.y) + parseFloat(d2Geo.height) / 2 : NaN;
assertCheck(
  'Check 4 (Center at local 15,15): Both diagonals have shape center at (15,15) before rotation',
  Math.abs(d1CenterX - 15) < 0.01 && Math.abs(d1CenterY - 15) < 0.01 &&
  Math.abs(d2CenterX - 15) < 0.01 && Math.abs(d2CenterY - 15) < 0.01
);

// Check 5: Width (pre-rotation horizontal length) is 30 px — the diameter
assertCheck(
  'Check 5 (Width=30px diameter): Both diagonals have width=30 (chord through center equals diameter)',
  d1Geo && d2Geo && parseFloat(d1Geo.width) === 30 && parseFloat(d2Geo.width) === 30
);

// Check 6: Rotation angles are 45 and -45
assertCheck(
  'Check 6 (Rotation 45/-45): diag1 has rotation=45 and diag2 has rotation=-45',
  diag1 && diag2 &&
  diag1.style.includes('rotation=45') &&
  diag2.style.includes('rotation=-45')
);

// Explicit Mathematical Rotation Geometry Calculations
const rot1Match = diag1 && diag1.style.match(/rotation=([-\d\.]+)/);
const rot2Match = diag2 && diag2.style.match(/rotation=([-\d\.]+)/);
const rot1 = rot1Match ? parseFloat(rot1Match[1]) : NaN;
const rot2 = rot2Match ? parseFloat(rot2Match[1]) : NaN;

const halfW1 = d1Geo ? parseFloat(d1Geo.width) / 2 : NaN;
const halfW2 = d2Geo ? parseFloat(d2Geo.width) / 2 : NaN;
const rad1 = (rot1 * Math.PI) / 180;
const rad2 = (rot2 * Math.PI) / 180;

// Rotation center is (d1CenterX, d1CenterY) = (15, 15)
// Endpoints after rotation:
const e1A = { x: d1CenterX - halfW1 * Math.cos(rad1), y: d1CenterY - halfW1 * Math.sin(rad1) };
const e1B = { x: d1CenterX + halfW1 * Math.cos(rad1), y: d1CenterY + halfW1 * Math.sin(rad1) };
const e2A = { x: d2CenterX - halfW2 * Math.cos(rad2), y: d2CenterY - halfW2 * Math.sin(rad2) };
const e2B = { x: d2CenterX + halfW2 * Math.cos(rad2), y: d2CenterY + halfW2 * Math.sin(rad2) };

// Verify endpoints lie on circle perimeter: distance from parent center (15, 15) equals radius 15 px
const pCenterX = parentGeo ? parseFloat(parentGeo.width) / 2 : 15;
const pCenterY = parentGeo ? parseFloat(parentGeo.height) / 2 : 15;
const parentRadius = pCenterX; // 15 px

const dist1A = Math.hypot(e1A.x - pCenterX, e1A.y - pCenterY);
const dist1B = Math.hypot(e1B.x - pCenterX, e1B.y - pCenterY);
const dist2A = Math.hypot(e2A.x - pCenterX, e2A.y - pCenterY);
const dist2B = Math.hypot(e2B.x - pCenterX, e2B.y - pCenterY);

const allEndpointsOnPerimeter =
  Math.abs(dist1A - parentRadius) < 0.01 &&
  Math.abs(dist1B - parentRadius) < 0.01 &&
  Math.abs(dist2A - parentRadius) < 0.01 &&
  Math.abs(dist2B - parentRadius) < 0.01;

assertCheck(
  'Check 6a (Post-rotation endpoints reach perimeter): All 4 rotated endpoints are at distance ~15px (radius) from center',
  allEndpointsOnPerimeter
);

// Verify two rotated lines intersect at parent circle center (15, 15)
const mid1 = { x: (e1A.x + e1B.x) / 2, y: (e1A.y + e1B.y) / 2 };
const mid2 = { x: (e2A.x + e2B.x) / 2, y: (e2A.y + e2B.y) / 2 };
const intersectAtCenter =
  Math.abs(mid1.x - pCenterX) < 0.01 && Math.abs(mid1.y - pCenterY) < 0.01 &&
  Math.abs(mid2.x - pCenterX) < 0.01 && Math.abs(mid2.y - pCenterY) < 0.01;

assertCheck(
  'Check 6b (Intersection at circle center): The two diagonals intersect exactly at parent center (15,15)',
  intersectAtCenter
);

// Verify local coordinate independence under non-zero canvas coordinates
const canvasX = parentGeo ? parseFloat(parentGeo.x) : 0;
const canvasY = parentGeo ? parseFloat(parentGeo.y) : 0;
const nonZeroCanvas = canvasX > 0 && canvasY > 0;
const localDecoupled = nonZeroCanvas &&
  parseFloat(d1Geo.x) === 0 && parseFloat(d1Geo.y) === 14 &&
  parseFloat(d2Geo.x) === 0 && parseFloat(d2Geo.y) === 14;

assertCheck(
  'Check 6c (Non-zero canvas decoupling): Child local coords remain (0,14) while parent sits at canvas (340,275)',
  localDecoupled
);

// Check 7: No connector semantics on diagonals (vertex, no edge, no source/target, connectable=0)
const noConnectorSemantics = diag1 && diag2 &&
  diag1.vertex === '1' && diag2.vertex === '1' &&
  diag1.edge !== '1' && diag2.edge !== '1' &&
  !diag1.source && !diag1.target &&
  !diag2.source && !diag2.target &&
  diag1.connectable === '0' && diag2.connectable === '0';
assertCheck(
  'Check 7 (No connector semantics): vertex=1, edge!=1, no source/target, connectable=0',
  noConnectorSemantics
);

// Check 8: connectable=0 specifically
assertCheck(
  'Check 8 (connectable=0): Both child vertices explicitly block external connections',
  diag1 && diag1.connectable === '0' && diag2 && diag2.connectable === '0'
);

// Check 9: External connector targets parent circle only
assertCheck(
  'Check 9 (External connector): Control flow targets act-flow-final circle, NOT diagonal children',
  edgeToFinal && edgeToFinal.target === 'act-flow-final'
);

// Check 10: No self-loop edges used as diagonal lines
let hasSelfLoopOnFlowFinal = false;
for (const cell of cells.values()) {
  if (cell.edge === '1' && cell.source && cell.target && cell.source === cell.target) {
    if (cell.source === 'act-flow-final' || cell.id === 'flow-final-diag1' || cell.id === 'flow-final-diag2') {
      hasSelfLoopOnFlowFinal = true;
      break;
    }
  }
}
assertCheck('Check 10 (No self-loops): Zero self-loop edges used as diagonal lines', !hasSelfLoopOnFlowFinal);

// Check 11: No old absolute-coordinate geometry (x=344.4 or x~344 is a canvas coord, must not appear)
const noOldAbsoluteCoords = d1Geo && d2Geo &&
  Math.abs(parseFloat(d1Geo.x) - 344.4) > 1 &&
  Math.abs(parseFloat(d2Geo.x) - 344.4) > 1 &&
  Math.abs(parseFloat(d1Geo.width) - 21.2) > 1 &&
  Math.abs(parseFloat(d2Geo.width) - 21.2) > 1;
assertCheck(
  'Check 11 (No old absolute coords): Old geometry x=344.4,w=21.2 no longer present in child vertices',
  noOldAbsoluteCoords
);

// Check 12: No hardcoded colors or stroke widths on any Flow Final cell
const noHardcodedStyle = flowFinal && diag1 && diag2 &&
  !flowFinal.style.includes('strokeColor=#000000') && !flowFinal.style.includes('strokeWidth') &&
  !diag1.style.includes('strokeColor=#000000') && !diag1.style.includes('strokeWidth') &&
  !diag2.style.includes('strokeColor=#000000') && !diag2.style.includes('strokeWidth');
assertCheck(
  'Check 12 (Default style): No hardcoded strokeColor=#000000 or strokeWidth on Flow Final cells',
  noHardcodedStyle
);

// 9. State Transition
console.log('\n2.9. State Transition (edge-state-trans):');
const stateTrans = cells.get('edge-state-trans');
assertCheck('Edge exists', !!stateTrans);
assertCheck('Transition is solid with open arrow', stateTrans && stateTrans.style.includes('endArrow=open') && stateTrans.style.includes('endFill=0'));
assertCheck('Transition label follows trigger [guard] / effect syntax', stateTrans && stateTrans.value.includes('[hopLe]') && stateTrans.value.includes('/'));

// 10. Sequence Synchronous Call
console.log('\n2.10. Sequence Synchronous Call (edge-seq-sync):');
const seqSync = cells.get('edge-seq-sync');
assertCheck('Edge exists', !!seqSync);
assertCheck('Synchronous call uses classic;endFill=1 (standard filled triangle)', seqSync && seqSync.style.includes('endArrow=classic') && seqSync.style.includes('endFill=1'));

// 11. Sequence Asynchronous Message
console.log('\n2.11. Sequence Asynchronous Message (edge-seq-async):');
const seqAsync = cells.get('edge-seq-async');
assertCheck('Edge exists', !!seqAsync);
assertCheck('Asynchronous message uses open arrow', seqAsync && seqAsync.style.includes('endArrow=open') && seqAsync.style.includes('endFill=0'));

// 12. Sequence Reply Message
console.log('\n2.12. Sequence Reply Message (edge-seq-reply):');
const seqReply = cells.get('edge-seq-reply');
assertCheck('Edge exists', !!seqReply);
assertCheck('Reply message is dashed with open arrow', seqReply && seqReply.style.includes('dashed=1') && seqReply.style.includes('endArrow=open') && seqReply.style.includes('endFill=0'));

// 13. Sequence Self-message
console.log('\n2.13. Sequence Self-message (edge-seq-self):');
const seqSelf = cells.get('edge-seq-self');
assertCheck('Edge exists', !!seqSelf);
assertCheck('Self-message has identical source and target (loopback)', seqSelf && seqSelf.source === 'seq-p2' && seqSelf.target === 'seq-p2');
assertCheck('Self-call uses synchronous arrowhead (classic;endFill=1)', seqSelf && seqSelf.style.includes('endArrow=classic') && seqSelf.style.includes('endFill=1'));

// 14. Sequence Create Message
console.log('\n2.14. Sequence Create Message (edge-seq-create & seq-p3):');
const seqCreate = cells.get('edge-seq-create');
const seqP3 = cells.get('seq-p3');
assertCheck('Create message edge exists', !!seqCreate);
assertCheck('Create message is dashed with open arrow (UML 2.5.1 Section 17.4)', seqCreate && seqCreate.style.includes('dashed=1') && seqCreate.style.includes('endArrow=open') && seqCreate.style.includes('endFill=0'));
assertCheck('Create message targets newly created participant (seq-p3)', seqCreate && seqCreate.target === 'seq-p3');
assertCheck('New participant Lifeline starts at creation point (y=240, NOT at diagram top y=50)', seqP3 && seqP3.geometry && parseFloat(seqP3.geometry.y) >= 240);

// 15. Sequence Destroy Message & Destruction Occurrence
console.log('\n2.15. Sequence Destroy Message (edge-seq-destroy & seq-destroy):');
const seqDestroy = cells.get('seq-destroy');
const seqDestEdge = cells.get('edge-seq-destroy');
const seqP2 = cells.get('seq-p2');

assertCheck('Destruction occurrence vertex exists', !!seqDestroy);
assertCheck('Destruction occurrence uses shape=umlDestroy without strokeWidth=3', seqDestroy && seqDestroy.style.includes('shape=umlDestroy') && !seqDestroy.style.includes('strokeWidth=3'));
assertCheck('Destroy message targets Destruction Occurrence (seq-destroy)', seqDestEdge && seqDestEdge.target === 'seq-destroy');
const p2Bottom = seqP2 && seqP2.geometry ? parseFloat(seqP2.geometry.y) + parseFloat(seqP2.geometry.height) : 0;
const destTop = seqDestroy && seqDestroy.geometry ? parseFloat(seqDestroy.geometry.y) : 0;
assertCheck('Destruction occurrence is positioned at the exact bottom of lifeline', destTop >= p2Bottom);

// ==========================================================
// PART 3: SIBLING OVERLAP REGRESSION CHECK (validate_drawio_xml.ps1)
// Fixture: case-flow-final-sibling-collision.drawio.xml
// ==========================================================
console.log('\n==========================================================');
console.log('  PART 3: SIBLING OVERLAP REGRESSION VERIFICATION');
console.log('  Fixture: case-flow-final-sibling-collision.drawio.xml');
console.log('==========================================================');

import { execSync } from 'node:child_process';
const regressionFixturePath = path.resolve('.agents/skills/draw-diagram/tests/fixtures/case-flow-final-sibling-collision.drawio.xml');
const validatorScriptPath = path.resolve('.agents/skills/draw-diagram/scripts/validate_drawio_xml.ps1');

let validatorOutput = '';
let validatorExitCode = 0;
try {
  validatorOutput = execSync(
    `powershell -ExecutionPolicy Bypass -File "${validatorScriptPath}" -FilePath "${regressionFixturePath}"`,
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
  );
  validatorExitCode = 0;
} catch (err) {
  validatorExitCode = err.status;
  validatorOutput = (err.stdout || '') + (err.stderr || '');
}

// Case A Verification: Valid Flow Final Composite Vertex pair is accepted (NO collision)
const flowFinalNoCollision = !validatorOutput.includes('flow-final-diag1') && !validatorOutput.includes('flow-final-diag2');
assertCheck(
  'Case A (Valid Flow Final): Diagonals inside act-flow-final circle are accepted without collision error',
  flowFinalNoCollision
);

// Case B Verification: Non-Flow-Final non-connectable siblings MUST trigger collision
const subNodeCollisionDetected = validatorOutput.includes("Node-Node Collision") &&
  validatorOutput.includes("sub-node-1") &&
  validatorOutput.includes("sub-node-2");
assertCheck(
  'Case B (Invalid Sibling Overlap): Two non-connectable children in test-container correctly trigger Node-Node Collision',
  subNodeCollisionDetected
);

assertCheck(
  'Regression Exit Code: Validator exits with code 1 due to Case B violation',
  validatorExitCode === 1
);

// ==========================================================
// PART 4: PHASE 1.3 MXGRAPH PARITY & GEOMETRIC VERIFICATIONS
// (Unit Tests & Integration Tests)
// ==========================================================
console.log('\n==========================================================');
console.log('  PART 4: PHASE 1.3 MXGRAPH PARITY & GEOMETRIC VERIFICATIONS');
console.log('  (Mathematical Unit Tests & Direct PowerShell Integration Tests)');
console.log('==========================================================');

// Helper for running PowerShell validator synchronously
function runValidator(xmlPath) {
  try {
    const out = execSync(
      `powershell -ExecutionPolicy Bypass -File "${validatorScriptPath}" -FilePath "${xmlPath}"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return { exitCode: 0, output: out };
  } catch (err) {
    return { exitCode: err.status, output: (err.stdout || '') + (err.stderr || '') };
  }
}

// ----------------------------------------------------------
// 4.1. Flow Final Container with collapsible=0
// ----------------------------------------------------------
console.log('\n4.1. Flow Final Container with collapsible=0:');
assertCheck(
  '[Unit] Parent circle act-flow-final is a valid container with collapsible=0',
  flowFinal && flowFinal.style.includes('container=1') && flowFinal.style.includes('collapsible=0')
);

// ----------------------------------------------------------
// 4.2. Test 1 (Case 20): Edge Label relative=0 on 4-point Polyline
// ----------------------------------------------------------
console.log('\n4.2. Test 1 (Case 20): Edge label relative=0 parity:');
// Unit Math: mxGraphView.prototype.updateEdgeLabelOffset calculates midpoint of P0 and Pe
const p0_c20 = { x: 90, y: 100 };
const pe_c20 = { x: 490, y: 100 };
const mid_p0_pe = { x: p0_c20.x + (pe_c20.x - p0_c20.x) / 2, y: p0_c20.y + (pe_c20.y - p0_c20.y) / 2 };
const offset_c20 = { x: -40, y: 30 };
const anchor_c20 = { x: mid_p0_pe.x + offset_c20.x, y: mid_p0_pe.y + offset_c20.y };

assertCheck('[Unit] P0-Pe midpoint is (290, 100), not polyline bounding box center (290, 70)', mid_p0_pe.x === 290 && mid_p0_pe.y === 100);
assertCheck('[Unit] Case 20 mxGraph anchor is exactly at (250, 130)', anchor_c20.x === 250 && anchor_c20.y === 130);

// Integration Test: execute validate_drawio_xml.ps1 on case20 fixture
const case20Path = path.resolve('.agents/skills/draw-diagram/tests/fixtures/case20-edge-label-relative-false.drawio.xml');
const resCase20 = runValidator(case20Path);
const case20AnchorDetected = resCase20.output.includes('at (250, 130)') && resCase20.output.includes("overlaps Node 'mid-obstacle' at (250, 130)");
assertCheck('[Integration] Case 20 PowerShell validator detects label collision at exact mxGraph anchor (250, 130)', case20AnchorDetected);
assertCheck('[Integration] Case 20 exits with 0 (diagnostic warning)', resCase20.exitCode === 0);

// ----------------------------------------------------------
// 4.3. Test 4: Polyline getPoint Discrete Traversal & Case 21 Y-Sign Parity
// ----------------------------------------------------------
console.log('\n4.3. Test 4: Polyline getPoint discrete segment traversal & Case 21 Y-sign parity:');

// 4.3.1. Case 21 Y-Sign Parity Unit Math
// mxGraph formula: y = p0.y + dy * factor - (ny * gy - offsetY) * scale
// For horizontal edge (dy=0, ny=1, offsetY=0, scale=1): y = by - ny * gy = by - gy
// Proving the sign rule:
// - If edge is at y=100 and gy=15: y = 100 - (1 * 15) = 85 (displaced UPWARD towards negative Y)
// - If edge is at y=100 and gy=-15: y = 100 - (1 * -15) = 115 (displaced DOWNWARD towards positive Y)
const calcY = (by, ny, gy) => by - (ny * gy);
assertCheck('[Unit] mxGraph y-formula: on y=100 with gy=15 gives y=85 (upward)', calcY(100, 1, 15) === 85);
assertCheck('[Unit] mxGraph y-formula: on y=100 with gy=-15 gives y=115 (downward)', calcY(100, 1, -15) === 115);

// In case21 fixture: edge horizontal bypass segment is at y=60, and geometry.y is "-55":
// y = 60 - (1 * -55) = 60 + 55 = 115
assertCheck('[Unit] Case 21 actual fixture: by=60, gy=-55 gives anchor y = 115', calcY(60, 1, -55) === 115);

// Case 21 Integration Test: execute validate_drawio_xml.ps1 on case21 fixture
const case21Path = path.resolve('.agents/skills/draw-diagram/tests/fixtures/case21-edge-label-y-normal-offset.drawio.xml');
const resCase21 = runValidator(case21Path);
const case21NormalDetected = resCase21.output.includes('at (290, 115)') && resCase21.output.includes("overlaps Node 'node-obs21' at (290, 115)");
assertCheck('[Integration] Case 21 PowerShell validator applies normal vector offset to detect obstacle collision at (290, 115)', case21NormalDetected);
assertCheck('[Integration] Case 21 exits with 0 (diagnostic warning)', resCase21.exitCode === 0);

// 4.3.2. Polyline Boundary Segment Selection Integration Test (PowerShell execution)
// 2-segment polyline: P0(100, 100) -> P1(200, 100) -> P2(200, 250)
// L0 = 100, L1 = 150, totalLen = 250
// Label at rx = -0.2 (gx = -0.1) -> dist = Round((-0.1 + 0.5) * 250) = 100 (exact boundary L0)
// With ry = 20:
// - If stayed on Segment 0 (wrong): nx=0, ny=1 -> anchor = (200, 80)
// - If advanced to Segment 1 (correct mxGraph): nx=1, ny=0, factor=0 -> anchor = (220, 100)
const tempPolylineXml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Electron" version="24.0.0">
  <diagram id="temp-poly-diag" name="Page-1">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="src-p" value="Src" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="80" y="80" width="40" height="40" as="geometry" />
        </mxCell>
        <mxCell id="tgt-p" value="Tgt" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="180" y="230" width="40" height="40" as="geometry" />
        </mxCell>
        <!-- Obstacle positioned at anchor of Segment 1: (220, 100) -->
        <mxCell id="obs-junction" value="Obs" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="200" y="80" width="40" height="40" as="geometry" />
        </mxCell>
        <mxCell id="edge-junction" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;" edge="1" parent="1" source="src-p" target="tgt-p">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="200" y="100" />
            </Array>
          </mxGeometry>
        </mxCell>
        <!-- Label with relative="1", x="-0.2" (dist=100 lands on junction), y="20" -->
        <mxCell id="lbl-junction" value="BoundaryLabel" style="edgeLabel;html=1;align=center;verticalAlign=middle;" vertex="1" connectable="0" parent="edge-junction">
          <mxGeometry x="-0.2" y="20" relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

const tempPolylinePath = path.resolve('.agents/skills/draw-diagram/tests/fixtures/temp-polyline-boundary.drawio.xml');
fs.writeFileSync(tempPolylinePath, tempPolylineXml, 'utf8');
try {
  const resPoly = runValidator(tempPolylinePath);
  const boundaryCollision = resPoly.output.includes("Label 'BoundaryLabel' on edge 'edge-junction' overlaps Node 'obs-junction' at (220, 100)");
  assertCheck('[Integration] PowerShell validator advances to segment k+1 at exact junction and detects obstacle at (220, 100)', boundaryCollision);
} finally {
  if (fs.existsSync(tempPolylinePath)) {
    fs.unlinkSync(tempPolylinePath);
  }
}

// ----------------------------------------------------------
// 4.4. Test 2 (Case 24): Ellipse Corner Safe Clip vs Interior Cut
// ----------------------------------------------------------
console.log('\n4.4. Test 2 (Case 24): Ellipse numerical accuracy & dual behavior:');
// Unit Math: Ellipse at [100, 100, 100x60], center C(150, 130), a=50, b=30
// Scaling Y by a/b = 5/3 transforms ellipse into circle with radius R=50 at C'(150, 216.666667)
const a_el = 50, b_el = 30, cx_el = 150, cy_el = 130;
const scaleY = a_el / b_el; // 5/3
const c_norm = { x: cx_el, y: cy_el * scaleY }; // (150, 216.666667)

// Segment A: (70, 160) -> (140, 55). Penetrates AABB at (100, 115) and (110, 100)
const p1_cA = { x: 70, y: 160 }, p2_cA = { x: 140, y: 55 };
const p1_norm = { x: p1_cA.x, y: p1_cA.y * scaleY }; // (70, 266.666667)
const p2_norm = { x: p2_cA.x, y: p2_cA.y * scaleY }; // (140, 91.666667)

const dx_norm = p2_norm.x - p1_norm.x; // 70
const dy_norm = p2_norm.y - p1_norm.y; // -175
const segLenSq = dx_norm * dx_norm + dy_norm * dy_norm; // 4900 + 30625 = 35525

// Projection parameter t = (C' - P1') . D' / |D'|^2
// (C' - P1') = (80, -50)
// Dot product = 80*70 + (-50)*(-175) = 5600 + 8750 = 14350
// t = 14350 / 35525 = 82 / 203 ~= 0.4039408867
const t_param = ((c_norm.x - p1_norm.x) * dx_norm + (c_norm.y - p1_norm.y) * dy_norm) / segLenSq;
const t_clamped = Math.max(0, Math.min(1, t_param));
assertCheck('[Unit] Projection parameter t is exactly 82/203 (~0.403941)', Math.abs(t_clamped - (82 / 203)) < 1e-6);

// Closest point in normalized space Q' = P1' + t * D'
const closestX_norm = p1_norm.x + t_clamped * dx_norm; // 70 + (82/203)*70 = 98.275862
const closestY_norm = p1_norm.y + t_clamped * dy_norm; // 266.666667 - (82/203)*175 = 195.977011
assertCheck('[Unit] Normalized closest point Q\' is (98.28, 195.98)', Math.abs(closestX_norm - 98.275862) < 0.01 && Math.abs(closestY_norm - 195.977011) < 0.01);

// Closest point in original space Q = (Q'x, Q'y / scaleY)
const closestX_orig = closestX_norm;
const closestY_orig = closestY_norm / scaleY;
assertCheck('[Unit] Original space closest point Q is (98.28, 117.59)', Math.abs(closestX_orig - 98.275862) < 0.01 && Math.abs(closestY_orig - 117.586207) < 0.01);

// Exact normalized distance: dist = |Q' - C'| = sqrt((-51.724138)^2 + (-20.689655)^2) = 55.708602 px
const normDist = Math.sqrt((closestX_norm - c_norm.x) ** 2 + (closestY_norm - c_norm.y) ** 2);
const clearance_el = normDist - a_el;

assertCheck('[Unit] Segment A normalized distance to center is 55.709 px (within 0.001)', Math.abs(normDist - 55.7086) < 0.001);
assertCheck('[Unit] Segment A radial clearance is 5.709 px (> 5.0 px threshold -> Safe)', clearance_el > 5.0);

// Integration Test: execute validate_drawio_xml.ps1 on case24 fixture
const case24Path = path.resolve('.agents/skills/draw-diagram/tests/fixtures/case24-edge-through-ellipse-corner-aabb.drawio.xml');
const resCase24 = runValidator(case24Path);
const case24SafeCorner = !resCase24.output.includes("edge-corner-clip") || !resCase24.output.includes("cuts through unrelated Node 'ellipse-node'");
const case24TrueCollision = resCase24.output.includes("edge-cutting-through") && resCase24.output.includes("cuts through unrelated Node 'ellipse-node'");
assertCheck('[Integration] Case 24: Corner clip edge does NOT trigger false collision', case24SafeCorner);
assertCheck('[Integration] Case 24: True cutting edge MUST trigger collision error', case24TrueCollision);
assertCheck('[Integration] Case 24 exits with code 1 due to true interior cut', resCase24.exitCode === 1);

// ----------------------------------------------------------
// 4.5. Test 3: Rhombus Collinear Segment Overlap
// ----------------------------------------------------------
console.log('\n4.5. Test 3: Rhombus segment collision & collinear overlap:');
// Unit Math: Rhombus [100, 125, 100x50], center (150, 150), hw=50, hh=25
// Top-right edge from (150, 125) to (200, 150). Collinear segment: (160, 130) -> (190, 145)
const hwR = 50, hhR = 25, cxR = 150, cyR = 150;
const rP1 = { x: 150, y: 125 }, rP2 = { x: 200, y: 150 };
const colS1 = { x: 160, y: 130 }, colS2 = { x: 190, y: 145 };
const rDx = rP2.x - rP1.x, rDy = rP2.y - rP1.y; // 50, 25
const sDx = colS2.x - colS1.x, sDy = colS2.y - colS1.y; // 30, 15
const crossP = rDx * sDy - rDy * sDx; // 50*15 - 25*30 = 750 - 750 = 0
assertCheck('[Unit] Collinear segment has zero 2D cross product with rhombus edge', crossP === 0);

// Integration Test: Create temporary XML fixture with Rhombus & Collinear Edge
const tempRhombusXml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Electron" version="24.0.0">
  <diagram id="temp-rhombus-diag" name="Page-1">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="rhombus-node" value="Decision" style="rhombus;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="125" width="100" height="50" as="geometry" />
        </mxCell>
        <mxCell id="src-node" value="S" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="10" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="tgt-node" value="T" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="250" y="180" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="edge-collinear" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;" edge="1" parent="1" source="src-node" target="tgt-node">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="160" y="130" />
              <mxPoint x="190" y="145" />
            </Array>
          </mxGeometry>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

const tempRhombusPath = path.resolve('.agents/skills/draw-diagram/tests/fixtures/temp-rhombus-collinear.drawio.xml');
fs.writeFileSync(tempRhombusPath, tempRhombusXml, 'utf8');
try {
  const resRhombus = runValidator(tempRhombusPath);
  const collinearDetected = resRhombus.output.includes("edge-collinear") && resRhombus.output.includes("cuts through unrelated Node 'rhombus-node'");
  assertCheck('[Integration] PowerShell validator detects collinear edge-rhombus segment overlap', collinearDetected);
  assertCheck('[Integration] Temporary collinear rhombus test exits with code 1', resRhombus.exitCode === 1);
} finally {
  if (fs.existsSync(tempRhombusPath)) {
    fs.unlinkSync(tempRhombusPath);
  }
}

// ----------------------------------------------------------
// 4.6. Test 5: OBB SAT Two-Way Verification (Separation vs Collision)
// ----------------------------------------------------------
console.log('\n4.6. Test 5: OBB SAT Separation vs Collision:');
// Unit Math:
// Rect A at (100, 100), Rect B (separated) at (170, 100), both W=60, H=40, rot=45 deg
const sepDist = 70 * Math.sin(Math.PI / 4) - 40; // 9.497 px
assertCheck('[Unit] Separated rotated rectangles have 9.497 px clearance on Axis 2', Math.abs(sepDist - 9.497) < 0.01);
// Rect C (colliding) at (130, 100):
const overlapDist = 40 - (30 * Math.sin(Math.PI / 4)); // 18.787 px
assertCheck('[Unit] Overlapping rotated rectangles have 18.787 px penetration on Axis 2', Math.abs(overlapDist - 18.787) < 0.01);

// Integration Test 5A: Case 23 Separated (False Positive Prevention)
const case23Path = path.resolve('.agents/skills/draw-diagram/tests/fixtures/case23-rotated-rect-aabb-vs-obb.drawio.xml');
const resCase23 = runValidator(case23Path);
assertCheck('[Integration] Case 23 SAT eliminates AABB false overlap (0 hard overlaps, exit code 0)', resCase23.exitCode === 0 && resCase23.output.includes('Zero hard overlaps'));

// Integration Test 5B: Temporary Colliding Rotated Rectangles (False Negative Prevention)
const tempRotOverlapXml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Electron" version="24.0.0">
  <diagram id="temp-rot-diag" name="Page-1">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="rot-rect-1" value="Rot1" style="rounded=0;whiteSpace=wrap;html=1;rotation=45;" vertex="1" parent="1">
          <mxGeometry x="70" y="80" width="60" height="40" as="geometry" />
        </mxCell>
        <mxCell id="rot-rect-2" value="Rot2" style="rounded=0;whiteSpace=wrap;html=1;rotation=45;" vertex="1" parent="1">
          <mxGeometry x="100" y="80" width="60" height="40" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

const tempRotPath = path.resolve('.agents/skills/draw-diagram/tests/fixtures/temp-rotated-rect-overlap.drawio.xml');
fs.writeFileSync(tempRotPath, tempRotOverlapXml, 'utf8');
try {
  const resRot = runValidator(tempRotPath);
  const rotOverlapDetected = resRot.output.includes('Node-Node Collision') && resRot.output.includes('rot-rect-1') && resRot.output.includes('rot-rect-2');
  assertCheck('[Integration] PowerShell validator detects true OBB collision between rotated rectangles', rotOverlapDetected);
  assertCheck('[Integration] Colliding rotated rectangles fixture exits with code 1', resRot.exitCode === 1);
} finally {
  if (fs.existsSync(tempRotPath)) {
    fs.unlinkSync(tempRotPath);
  }
}

console.log('==========================================================');
if (failed) {
  console.error('RESULT: FAILED - One or more checks failed.');
  process.exit(1);
} else {
  console.log('RESULT: PASSED - All Part 1 documentation checks, Part 2 XML symbol checks, Part 3 regression checks, and Part 4 Unit/Integration tests passed successfully!');
  process.exit(0);
}
