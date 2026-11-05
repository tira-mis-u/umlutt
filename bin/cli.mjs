#!/usr/bin/env node

/**
 * Viet Agent Skills CLI
 * 
 * Interactive installer and manager for Vietnamese Information System Analysis & Design
 * Agent Skills. Supports Google Antigravity / Gemini CLI, Anthropic Claude Code, and OpenAI Codex.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

// Read version from package.json
let PACKAGE_VERSION = '0.1.0';
try {
  const pkgData = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf-8'));
  PACKAGE_VERSION = pkgData.version || PACKAGE_VERSION;
} catch {
  // fallback to default
}

// Colors for terminal formatting (ANSI)
const supportsColor = process.stdout.isTTY && !process.env.NO_COLOR;
const color = {
  reset: supportsColor ? '\x1b[0m' : '',
  bold: supportsColor ? '\x1b[1m' : '',
  dim: supportsColor ? '\x1b[2m' : '',
  green: supportsColor ? '\x1b[32m' : '',
  cyan: supportsColor ? '\x1b[36m' : '',
  yellow: supportsColor ? '\x1b[33m' : '',
  red: supportsColor ? '\x1b[31m' : '',
  magenta: supportsColor ? '\x1b[35m' : '',
};

// Skill Catalog Registry
const SKILL_CATALOG = [
  {
    name: 'system-analysis',
    tier: 'Tier 1 (Coordinator)',
    title: 'Skill Tong Dieu Phoi Vong Doi PTTKHTTT',
    desc: 'Dieu phoi toan dien vong doi phan tich thiet ke theo 3 trang thai (A: Trong, B: Co docs, C: Co code).',
    trigger: '/system-analysis',
  },
  {
    name: 'system-analysis-survey',
    tier: 'Tier 2 (Producer)',
    title: 'Khao Sat Hien Trang & Pham Vi He Thong',
    desc: 'Lap bien ban khao sat, bang cau hoi phong van, xac dinh van de VD-xx va muc tieu he thong.',
    trigger: '/system-analysis-survey',
  },
  {
    name: 'system-analysis-requirements',
    tier: 'Tier 2 (Producer)',
    title: 'Dac Ta Yeu Cau, Quy Tac BR & Danh Muc Use Case',
    desc: 'Chuyen hoa VD-xx thanh FR-xx, NFR-xx, BR-xx va dac ta chi tiet danh muc Use Case UC-xx.',
    trigger: '/system-analysis-requirements',
  },
  {
    name: 'system-analysis-uml',
    tier: 'Tier 2 (Producer)',
    title: 'Mo Hinh Hoa 7 Bieu Do UML Chuan OMG',
    desc: 'Thiet ke va kiem soat nhat quan 7 loai bieu do UML (PlantUML chinh, Mermaid du phong).',
    trigger: '/system-analysis-uml',
  },
  {
    name: 'system-analysis-data',
    tier: 'Tier 2 (Producer)',
    title: 'Thiet Ke Mo Hinh Du Lieu ERD & 3NF',
    desc: 'Chuyen hoa mo hinh lop sang ERD quan niem, logic, vat ly, chuan hoa 3NF va anh xa snake_case.',
    trigger: '/system-analysis-data',
  },
  {
    name: 'system-analysis-ui',
    tier: 'Tier 2 (Producer)',
    title: 'Thiet Ke Luong Tuong Tac & Wireframe Low-fi',
    desc: 'Anh xa kich ban Use Case sang giao dien bang Markdown/ASCII kem 5 trang thai man hinh.',
    trigger: '/system-analysis-ui',
  },
  {
    name: 'system-analysis-audit',
    tier: 'Tier 2 (Producer)',
    title: 'Tham Dinh & Kiem Toan Nhat Quan Ho So',
    desc: 'Kiem tra chuoi truy vet End-to-End, doi soat ma nguon As-is vs To-be va cong nghiem thu.',
    trigger: '/system-analysis-audit',
  },
  {
    name: 'draw-diagram',
    tier: 'Infrastructure (Renderer)',
    title: 'Ket Xuat Draw.io XML & Validator Hinh Hoc',
    desc: 'Chuyen hoa mo hinh sang Draw.io XML (<mxfile>), kiem dinh va cham OBB/SAT va ho tro xuat SVG/PNG.',
    trigger: '/draw-diagram',
  },
];

/**
 * Print CLI Header
 */
function printHeader() {
  console.log(`\n${color.cyan}${color.bold}======================================================${color.reset}`);
  console.log(`${color.cyan}${color.bold}   VIET AGENT SKILLS CLI - v${PACKAGE_VERSION}${color.reset}`);
  console.log(`${color.dim}   Thư viện kỹ năng AI Phân tích & Thiết kế HTTT${color.reset}`);
  console.log(`${color.cyan}${color.bold}======================================================${color.reset}\n`);
}

/**
 * Print Help
 */
function printHelp() {
  printHeader();
  console.log(`${color.bold}SỬ DỤNG:${color.reset}`);
  console.log(`  npx viet-agent-skills [lệnh] [tùy chọn]\n`);
  console.log(`${color.bold}CÁC LỆNH CHÍNH:${color.reset}`);
  console.log(`  ${color.green}init, install${color.reset}      Cài đặt toàn bộ bộ kỹ năng và quy tắc vào dự án hiện tại`);
  console.log(`  ${color.green}add <skill>${color.reset}        Cài đặt một kỹ năng cụ thể (kèm các rules phụ thuộc)`);
  console.log(`  ${color.green}list, ls${color.reset}           Liệt kê tất cả các kỹ năng khả dụng trong thư viện`);
  console.log(`  ${color.green}doctor, check${color.reset}      Kiểm tra môi trường (Node.js, PowerShell, Draw.io CLI, thư mục)`);
  console.log(`  ${color.green}info <skill>${color.reset}       Xem chi tiết về một kỹ năng cụ thể\n`);
  console.log(`${color.bold}TÙY CHỌN:${color.reset}`);
  console.log(`  ${color.yellow}-y, --yes${color.reset}          Tự động xác nhận cài đặt, không hỏi lại`);
  console.log(`  ${color.yellow}-f, --force${color.reset}        Ghi đè tệp tin đã tồn tại nếu có xung đột`);
  console.log(`  ${color.yellow}--dry-run${color.reset}          Xem trước danh sách tệp sẽ tạo, không ghi xuống ổ đĩa`);
  console.log(`  ${color.yellow}--agents-only${color.reset}      Chỉ cài đặt thư mục .agents/ (Antigravity, Gemini, Codex)`);
  console.log(`  ${color.yellow}--claude-only${color.reset}      Chỉ cài đặt thư mục .claude/ (Claude Code)`);
  console.log(`  ${color.yellow}-v, --version${color.reset}      Hiển thị phiên bản hiện tại`);
  console.log(`  ${color.yellow}-h, --help${color.reset}         Hiển thị hướng dẫn này\n`);
  console.log(`${color.bold}VÍ DỤ:${color.reset}`);
  console.log(`  ${color.dim}# Cài đặt trọn gói toàn bộ hệ sinh thái vào dự án hiện tại:${color.reset}`);
  console.log(`  npx viet-agent-skills init\n`);
  console.log(`  ${color.dim}# Chỉ cài đặt kỹ năng vẽ biểu đồ Draw.io:${color.reset}`);
  console.log(`  npx viet-agent-skills add draw-diagram\n`);
  console.log(`  ${color.dim}# Kiểm tra các công cụ hạ tầng trên máy:${color.reset}`);
  console.log(`  npx viet-agent-skills doctor\n`);
}

/**
 * List all available skills
 */
function listSkills() {
  printHeader();
  console.log(`${color.bold}DANH MỤC CÁC AGENT SKILLS HIỆN CÓ (${SKILL_CATALOG.length} KỸ NĂNG):${color.reset}\n`);

  for (const s of SKILL_CATALOG) {
    console.log(`  ${color.cyan}${color.bold}${s.name.padEnd(30)}${color.reset} [${color.magenta}${s.tier}${color.reset}]`);
    console.log(`    ${color.bold}${s.title}${color.reset}`);
    console.log(`    ${color.dim}${s.desc}${color.reset}`);
    console.log(`    Lệnh kích hoạt: ${color.green}${s.trigger}${color.reset}\n`);
  }

  console.log(`${color.dim}Để cài đặt một skill: npx viet-agent-skills add <tên-skill>${color.reset}`);
  console.log(`${color.dim}Để cài đặt toàn bộ:  npx viet-agent-skills init${color.reset}\n`);
}

/**
 * Display specific skill info
 */
function infoSkill(skillName) {
  const s = SKILL_CATALOG.find(x => x.name.toLowerCase() === skillName.toLowerCase());
  if (!s) {
    console.error(`\n${color.red}[LỖI] Không tìm thấy skill '${skillName}'.${color.reset}`);
    console.log(`Chạy ${color.yellow}npx viet-agent-skills list${color.reset} để xem danh sách kỹ năng khả dụng.\n`);
    process.exit(1);
  }

  printHeader();
  console.log(`${color.bold}THÔNG TIN KỸ NĂNG:${color.reset} ${color.cyan}${color.bold}${s.name}${color.reset}`);
  console.log(`- Phân tầng:      ${color.magenta}${s.tier}${color.reset}`);
  console.log(`- Tiêu đề:        ${s.title}`);
  console.log(`- Lệnh gọi:       ${color.green}${s.trigger}${color.reset}`);
  console.log(`- Mô tả:          ${s.desc}`);

  const skillPath = path.join(PACKAGE_ROOT, '.agents', 'skills', s.name);
  if (fs.existsSync(skillPath)) {
    console.log(`\n${color.bold}CẤU TRÚC TỆP NGUỒN:${color.reset}`);
    const files = fs.readdirSync(skillPath);
    for (const f of files) {
      console.log(`  - ${f}`);
    }
  }
  console.log();
}

/**
 * Deep copy helper with reporting
 */
function copyDirectorySync(srcDir, destDir, options = {}) {
  const { dryRun = false, force = false } = options;
  let copiedCount = 0;

  if (!fs.existsSync(srcDir)) return copiedCount;

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  if (!dryRun && !fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copiedCount += copyDirectorySync(srcPath, destPath, options);
    } else {
      const exists = fs.existsSync(destPath);
      if (exists && !force) {
        // file already exists, skipping
      } else {
        if (!dryRun) {
          const parentDir = path.dirname(destPath);
          if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
          }
          fs.copyFileSync(srcPath, destPath);
        }
        copiedCount++;
      }
    }
  }

  return copiedCount;
}

/**
 * Install all skills or selected skill
 */
function runInstall(targetSkill = null, options = {}) {
  const targetDir = process.cwd();
  const { dryRun = false, force = false, agentsOnly = false, claudeOnly = false } = options;

  printHeader();

  const modeText = targetSkill ? `kỹ năng '${targetSkill}'` : 'toàn bộ hệ sinh thái kỹ năng PTTKHTTT';
  console.log(`${color.bold}BẮT ĐẦU CÀI ĐẶT:${color.reset} ${modeText}`);
  console.log(`Thư mục đích: ${color.cyan}${targetDir}${color.reset}`);
  if (dryRun) console.log(`${color.yellow}[CHẾ ĐỘ XEM TRƯỚC (DRY RUN) - Không ghi tệp vào ổ đĩa]${color.reset}`);
  console.log();

  let totalFilesCopied = 0;

  // 1. Install Rules (Always needed for consistency)
  if (!claudeOnly) {
    const rulesSrc = path.join(PACKAGE_ROOT, '.agents', 'rules');
    const rulesDest = path.join(targetDir, '.agents', 'rules');
    console.log(`- Đang sao chép quy tắc chung (.agents/rules)...`);
    const count = copyDirectorySync(rulesSrc, rulesDest, { dryRun, force });
    totalFilesCopied += count;
  }

  // 2. Install Skills
  const skillsToInstall = targetSkill 
    ? [targetSkill] 
    : SKILL_CATALOG.map(s => s.name);

  for (const skName of skillsToInstall) {
    console.log(`- Đang cài đặt kỹ năng: ${color.green}${skName}${color.reset}...`);

    // .agents/skills/<name>
    if (!claudeOnly) {
      const srcSkillDir = path.join(PACKAGE_ROOT, '.agents', 'skills', skName);
      const destSkillDir = path.join(targetDir, '.agents', 'skills', skName);
      if (fs.existsSync(srcSkillDir)) {
        totalFilesCopied += copyDirectorySync(srcSkillDir, destSkillDir, { dryRun, force });
      }
    }

    // .claude/skills/<name> (Thin Proxy)
    if (!agentsOnly) {
      const srcClaudeDir = path.join(PACKAGE_ROOT, '.claude', 'skills', skName);
      const destClaudeDir = path.join(targetDir, '.claude', 'skills', skName);
      if (fs.existsSync(srcClaudeDir)) {
        totalFilesCopied += copyDirectorySync(srcClaudeDir, destClaudeDir, { dryRun, force });
      }
    }
  }

  // 3. Install Global Scripts & Guideline Docs
  if (!targetSkill || targetSkill === 'draw-diagram') {
    const scriptsSrc = path.join(PACKAGE_ROOT, 'scripts');
    const scriptsDest = path.join(targetDir, 'scripts');
    if (fs.existsSync(scriptsSrc)) {
      console.log(`- Đang sao chép công cụ thực thi (scripts/)...`);
      totalFilesCopied += copyDirectorySync(scriptsSrc, scriptsDest, { dryRun, force });
    }
  }

  // Copy AGENTS.md and CLAUDE.md if not existing or force
  const docFiles = [
    { src: 'AGENTS.md', dest: 'AGENTS.md', cond: !claudeOnly },
    { src: 'CLAUDE.md', dest: 'CLAUDE.md', cond: !agentsOnly },
  ];

  for (const doc of docFiles) {
    if (doc.cond) {
      const srcPath = path.join(PACKAGE_ROOT, doc.src);
      const destPath = path.join(targetDir, doc.dest);
      if (fs.existsSync(srcPath)) {
        if (!fs.existsSync(destPath) || force) {
          if (!dryRun) fs.copyFileSync(srcPath, destPath);
          totalFilesCopied++;
        }
      }
    }
  }

  console.log(`\n${color.green}${color.bold}[THÀNH CÔNG] Đã cài đặt hoàn tất!${color.reset}`);
  console.log(`Tổng số tệp được xử lý: ${color.bold}${totalFilesCopied}${color.reset} tệp.\n`);

  console.log(`${color.bold}HƯỚNG DẪN TIẾP THEO:${color.reset}`);
  console.log(`1. Mở dự án trong AI Coding Agent bạn đang sử dụng:`);
  console.log(`   - ${color.cyan}Google Antigravity / Gemini CLI:${color.reset} Tự động nạp từ .agents/skills/`);
  console.log(`   - ${color.cyan}Anthropic Claude Code:${color.reset}           Tự động nạp từ .claude/skills/`);
  console.log(`   - ${color.cyan}OpenAI Codex:${color.reset}                    Tự động nhận diện theo chuẩn AGENTS.md`);
  console.log(`2. Thử kích hoạt lệnh điều phối đầu tiên trong chat AI:`);
  console.log(`   ${color.yellow}/system-analysis${color.reset} hoặc ${color.yellow}/draw-diagram${color.reset}\n`);
}

/**
 * Doctor: Check local environment
 */
function runDoctor() {
  printHeader();
  console.log(`${color.bold}KIỂM TRA TÌNH TRẠNG MÔI TRƯỜNG HỆ THỐNG:${color.reset}\n`);

  // 1. Check Node.js
  const nodeVer = process.version;
  const major = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
  if (major >= 18) {
    console.log(`  [${color.green}OK${color.reset}] Node.js runtime: ${nodeVer} (Tương thích tốt)`);
  } else {
    console.log(`  [${color.yellow}CẢNH BÁO${color.reset}] Node.js runtime: ${nodeVer} (Khuyến nghị Node.js >= 18.0.0)`);
  }

  // 2. Check PowerShell
  const isWin = os.platform() === 'win32';
  const psCmd = isWin ? 'powershell.exe' : 'pwsh';
  try {
    const res = spawnSync(psCmd, ['-Command', '$PSVersionTable.PSVersion.ToString()'], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    if (res.status === 0 && res.stdout) {
      console.log(`  [${color.green}OK${color.reset}] PowerShell runtime: ${res.stdout.trim()} (${psCmd})`);
    } else {
      console.log(`  [${color.yellow}CẢNH BÁO${color.reset}] Không thể xác định phiên bản PowerShell (${psCmd})`);
    }
  } catch {
    console.log(`  [${color.red}THIẾU${color.reset}] Không tìm thấy lệnh PowerShell (${psCmd}) trên máy`);
  }

  // 3. Check Draw.io Desktop CLI
  const lookupCmd = isWin ? 'where.exe' : 'which';
  const binName = isWin ? 'draw.io.exe' : 'drawio';
  let drawioFound = false;
  let drawioPath = process.env.DRAWIO_PATH || null;

  if (drawioPath && fs.existsSync(drawioPath)) {
    drawioFound = true;
  } else {
    try {
      const res = spawnSync(lookupCmd, [binName], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
      if (res.status === 0 && res.stdout) {
        drawioPath = res.stdout.split(/\r?\n/)[0].trim();
        if (drawioPath && fs.existsSync(drawioPath)) drawioFound = true;
      }
    } catch {
      // ignore
    }
  }

  if (drawioFound) {
    console.log(`  [${color.green}OK${color.reset}] Draw.io Desktop CLI: Đã phát hiện tại ${drawioPath}`);
  } else {
    console.log(`  [${color.yellow}PENDING${color.reset}] Draw.io Desktop CLI: Chưa tìm thấy`);
    console.log(`     ${color.dim}(Cài đặt qua winget install JGraph.Draw hoặc brew install --cask drawio để bật tính năng xuất ảnh tự động)${color.reset}`);
  }

  // 4. Check Current Workspace Skills Status
  const cwd = process.cwd();
  const hasAgents = fs.existsSync(path.join(cwd, '.agents', 'skills'));
  const hasClaude = fs.existsSync(path.join(cwd, '.claude', 'skills'));
  console.log(`\n${color.bold}TRẠNG THÁI DỰ ÁN HIỆN HÀNH (${cwd}):${color.reset}`);
  console.log(`  - Thư mục .agents/skills: ${hasAgents ? color.green + 'Đã cài đặt' + color.reset : color.dim + 'Chưa cài' + color.reset}`);
  console.log(`  - Thư mục .claude/skills: ${hasClaude ? color.green + 'Đã cài đặt' + color.reset : color.dim + 'Chưa cài' + color.reset}`);
  console.log();
}

/**
 * Main Entry Point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Default interactive / fast init
    runInstall(null, { force: false, dryRun: false });
    return;
  }

  const command = args[0].toLowerCase();

  // Flags
  const force = args.includes('-f') || args.includes('--force');
  const dryRun = args.includes('--dry-run');
  const agentsOnly = args.includes('--agents-only');
  const claudeOnly = args.includes('--claude-only');

  switch (command) {
    case 'init':
    case 'install':
      runInstall(null, { force, dryRun, agentsOnly, claudeOnly });
      break;

    case 'add': {
      const skillName = args[1];
      if (!skillName) {
        console.error(`\n${color.red}[LỖI] Vui lòng chỉ định tên skill cần cài đặt.${color.reset}`);
        console.log(`Ví dụ: ${color.yellow}npx viet-agent-skills add draw-diagram${color.reset}\n`);
        process.exit(1);
      }
      const matched = SKILL_CATALOG.find(x => x.name.toLowerCase() === skillName.toLowerCase());
      if (!matched) {
        console.error(`\n${color.red}[LỖI] Kỹ năng '${skillName}' không tồn tại trong danh mục.${color.reset}`);
        console.log(`Chạy ${color.yellow}npx viet-agent-skills list${color.reset} để xem các skill khả dụng.\n`);
        process.exit(1);
      }
      runInstall(matched.name, { force, dryRun, agentsOnly, claudeOnly });
      break;
    }

    case 'list':
    case 'ls':
      listSkills();
      break;

    case 'doctor':
    case 'check':
      runDoctor();
      break;

    case 'info': {
      const skillName = args[1];
      if (!skillName) {
        console.error(`\n${color.red}[LỖI] Vui lòng chỉ định tên skill cần xem thông tin.${color.reset}\n`);
        process.exit(1);
      }
      infoSkill(skillName);
      break;
    }

    case '-v':
    case '--version':
    case 'version':
      console.log(`viet-agent-skills v${PACKAGE_VERSION}`);
      break;

    case '-h':
    case '--help':
    case 'help':
      printHelp();
      break;

    default:
      console.error(`\n${color.red}[LỖI] Lệnh '${command}' không hợp lệ.${color.reset}`);
      printHelp();
      process.exit(1);
  }
}

main();
