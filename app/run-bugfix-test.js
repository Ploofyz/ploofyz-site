import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTest() {
  try {
    const { stdout, stderr } = await execAsync(
      'npx vitest run src/components/TeamCarousel/ProfileSlide.bugfix.property.test.tsx --reporter=verbose',
      { cwd: process.cwd(), maxBuffer: 1024 * 1024 * 10 }
    );
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.log(error.stdout);
    console.error(error.stderr);
    process.exit(error.code || 1);
  }
}

runTest();
