#!/usr/bin/env node

/**
 * scripts/export_diagram.mjs
 * 
 * Global convenience entrypoint forwarding to .agents/skills/draw-diagram/scripts/export_diagram.mjs
 */

import { main } from '../.agents/skills/draw-diagram/scripts/export_diagram.mjs';

const exitCode = main(process.argv.slice(2));
process.exit(exitCode);

