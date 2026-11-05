#!/usr/bin/env node

/**
 * export_diagram.mjs
 * 
 * Cross-platform CLI wrapper for exporting Draw.io XML (.drawio.xml) to SVG or PNG
 * using Draw.io Desktop CLI with automatic executable discovery and graceful fallback.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Find Draw.io Desktop executable across Windows, macOS, and Linux
 */
export function findDrawioExecutable() {
  // 1. Check DRAWIO_PATH environment variable
  if (process.env.DRAWIO_PATH && fs.existsSync(process.env.DRAWIO_PATH)) {
    return process.env.DRAWIO_PATH;
  }

  const isWin = os.platform() === 'win32';
  const isMac = os.platform() === 'darwin';
  const isLinux = os.platform() === 'linux';

  // 2. Check PATH via system lookup command
  const lookupCmd = isWin ? 'where.exe' : 'which';
  const binName = isWin ? 'draw.io.exe' : 'drawio';

  try {
    const res = spawnSync(lookupCmd, [binName], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    if (res.status === 0 && res.stdout) {
      const firstLine = res.stdout.split(/\r?\n/)[0].trim();
      if (firstLine && fs.existsSync(firstLine)) {
        return firstLine;
      }
    }
  } catch {
    // lookup failed, continue checking candidate paths
  }

  if (isWin) {
    try {
      const resAlt = spawnSync(lookupCmd, ['drawio.exe'], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
      if (resAlt.status === 0 && resAltAltMatch(resAlt)) {
        return resAltAltMatch(resAlt);
      }
    } catch {
      // ignore
    }
  }

  function resAltAltMatch(r) {
    if (r.status === 0 && r.stdout) {
      const line = r.stdout.split(/\r?\n/)[0].trim();
      if (line && fs.existsSync(line)) return line;
    }
    return null;
  }

  // 3. Platform-specific well-known paths
  const candidatePaths = [];

  if (isWin) {
    const progFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const progFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env['LOCALAPPDATA'] || (process.env['USERPROFILE'] ? path.join(process.env['USERPROFILE'], 'AppData', 'Local') : '');

    candidatePaths.push(
      path.join(progFiles, 'draw.io', 'draw.io.exe'),
      path.join(progFilesX86, 'draw.io', 'draw.io.exe'),
      path.join(localAppData, 'Programs', 'draw.io', 'draw.io.exe'),
      path.join(progFiles, 'draw.io', 'drawio.exe'),
      path.join(localAppData, 'Programs', 'draw.io', 'drawio.exe')
    );
  } else if (isMac) {
    const home = process.env.HOME || '';
    candidatePaths.push(
      '/Applications/draw.io.app/Contents/MacOS/draw.io',
      path.join(home, 'Applications', 'draw.io.app', 'Contents', 'MacOS', 'draw.io')
    );
  } else if (isLinux) {
    candidatePaths.push(
      '/usr/bin/drawio',
      '/usr/local/bin/drawio',
      '/snap/bin/drawio',
      '/var/lib/flatpak/exports/bin/com.jgraph.drawio.desktop'
    );
  }

  for (const cand of candidatePaths) {
    if (cand && fs.existsSync(cand)) {
      return cand;
    }
  }

  return null;
}

/**
 * Print detailed installation instructions for Draw.io Desktop
 */
export function printInstallGuide() {
  console.log('\n[!] Draw.io Desktop CLI không được tìm thấy trong hệ thống.');
  console.log('--- HƯỚNG DẪN CÀI ĐẶT DRAW.IO DESKTOP ---');
  console.log('1. Windows:');
  console.log('   - Cài qua winget:   winget install JGraph.Draw');
  console.log('   - Hoặc tải trực tiếp từ GitHub Releases:');
  console.log('     https://github.com/jgraph/drawio-desktop/releases');
  console.log('2. macOS:');
  console.log('   - Cài qua Homebrew: brew install --cask drawio');
  console.log('3. Linux:');
  console.log('   - Tải file .deb/.rpm từ GitHub Releases hoặc dùng snap:');
  console.log('     sudo snap install drawio');
  console.log('4. Tùy chỉnh đường dẫn thực thi:');
  console.log('   - Thiết lập biến môi trường DRAWIO_PATH:');
  console.log('     PowerShell: $env:DRAWIO_PATH = "C:\\path\\to\\draw.io.exe"');
  console.log('     Bash:       export DRAWIO_PATH="/path/to/drawio"\n');
}

/**
 * CLI Argument Parser
 */
function parseArgs(args) {
  const options = {
    input: null,
    output: null,
    format: null,
    check: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '--check') {
      options.check = true;
    } else if (arg === '-i' || arg === '--input') {
      options.input = args[++i];
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i];
    } else if (arg === '-f' || arg === '--format') {
      options.format = args[++i];
    } else if (!arg.startsWith('-') && !options.input) {
      options.input = arg;
    }
  }

  return options;
}

/**
 * Print Help
 */
function printHelp() {
  console.log(`
Sử dụng: node export_diagram.mjs [tùy chọn]

Tùy chọn:
  -i, --input <file>     Đường dẫn tệp Draw.io XML nguồn (.drawio.xml)
  -o, --output <file>    Đường dẫn tệp hình ảnh xuất (.svg hoặc .png)
  -f, --format <format>  Định dạng xuất: 'svg' hoặc 'png' (mặc định: svg)
  --check                Kiểm tra xem Draw.io Desktop CLI có sẵn trên máy không
  -h, --help             Hiển thị trợ giúp này

Ví dụ:
  node export_diagram.mjs --check
  node export_diagram.mjs -i PTTKHTTT/xml/01-use-case.drawio.xml -o PTTKHTTT/diagrams/01-use-case.svg
  node export_diagram.mjs -i PTTKHTTT/xml/01-use-case.drawio.xml -f png
`);
}

/**
 * Main execution
 */
export function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    return 0;
  }

  const drawioBin = findDrawioExecutable();

  if (options.check) {
    if (drawioBin) {
      console.log(`[OK] Đã tìm thấy Draw.io CLI: ${drawioBin}`);
      return 0;
    } else {
      printInstallGuide();
      return 1;
    }
  }

  if (!options.input) {
    console.error('[LỖI] Thiếu tham số tệp đầu vào (-i hoặc --input).');
    printHelp();
    return 1;
  }

  const inputPath = path.resolve(process.cwd(), options.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`[LỖI] Không tìm thấy tệp đầu vào: ${inputPath}`);
    return 1;
  }

  // Determine format and output path
  let format = (options.format || '').toLowerCase();
  let outputPath = options.output;

  if (!outputPath) {
    if (!format) format = 'svg';
    const parsed = path.parse(inputPath);
    let baseName = parsed.name;
    if (baseName.endsWith('.drawio')) {
      baseName = path.parse(baseName).name;
    }
    outputPath = path.join(parsed.dir, '..', 'diagrams', `${baseName}.${format}`);
  } else {
    outputPath = path.resolve(process.cwd(), outputPath);
    if (!format) {
      const ext = path.extname(outputPath).toLowerCase().replace('.', '');
      format = ext === 'png' ? 'png' : 'svg';
    }
  }

  if (format !== 'svg' && format !== 'png') {
    console.error(`[LỖI] Định dạng xuất '${format}' không hợp lệ. Chỉ hỗ trợ 'svg' hoặc 'png'.`);
    return 1;
  }

  // Check if Draw.io Desktop CLI is available
  if (!drawioBin) {
    console.log(`\n[*] Tệp Draw.io XML nguồn: ${inputPath}`);
    console.log(`[*] Tệp xuất mong muốn:    ${outputPath} (Định dạng: ${format.toUpperCase()})`);
    console.warn('\n[!] Draw.io Desktop CLI chưa được cài đặt trong môi trường này.');
    console.warn('[!] Mã nguồn Draw.io XML hoàn chỉnh và hợp lệ vẫn được bảo toàn tại:');
    console.warn(`    ${inputPath}`);
    console.warn('[!] Trạng thái xuất ảnh: Chờ cài đặt Draw.io Desktop CLI (Visual verification pending).');
    printInstallGuide();
    return 1;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`[*] Đang xuất biểu đồ:`);
  console.log(`    Nguồn: ${inputPath}`);
  console.log(`    Đích:  ${outputPath}`);
  console.log(`    CLI:   ${drawioBin}`);

  const cmdArgs = ['-x', '-f', format, '-o', outputPath, inputPath];
  if (os.platform() === 'linux' && process.getuid && process.getuid() === 0) {
    cmdArgs.unshift('--no-sandbox');
  }

  try {
    const execRes = spawnSync(drawioBin, cmdArgs, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe']
    });

    if (execRes.status !== 0) {
      console.error(`[LỖI] Draw.io CLI trả về mã lỗi: ${execRes.status}`);
      if (execRes.stderr) console.error(execRes.stderr);
      return execRes.status || 1;
    }

    if (fs.existsSync(outputPath)) {
      const stat = fs.statSync(outputPath);
      console.log(`[THÀNH CÔNG] Đã xuất tệp ảnh thành công (${stat.size} bytes):`);
      console.log(`             ${outputPath}`);
      return 0;
    } else {
      console.error(`[LỖI] Lệnh Draw.io chạy thành công nhưng không tìm thấy tệp đầu ra tại: ${outputPath}`);
      return 1;
    }
  } catch (err) {
    console.error(`[LỖI] Quá trình thực thi Draw.io CLI thất bại: ${err.message}`);
    return 1;
  }
}

// Execute when invoked directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const exitCode = main();
  process.exit(exitCode);
}

