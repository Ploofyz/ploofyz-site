#!/usr/bin/env node

/**
 * Script to run preservation property tests
 */

import { spawn } from 'child_process';

const testProcess = spawn('npx', [
  'vitest',
  'run',
  'src/components/TeamCarousel/ProfileSlide.preservation.property.test.tsx',
  'src/components/TeamCarousel/TeamCarousel.preservation.property.test.tsx',
  '--reporter=verbose'
], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', (code) => {
  process.exit(code);
});
