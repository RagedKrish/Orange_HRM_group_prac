import fs from 'node:fs/promises';
import path from 'node:path';
import type { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig): Promise<void> {
  const temporaryArtifacts = path.resolve(config.rootDir, 'storage', '*.tmp');

  try {
    await fs.rm(temporaryArtifacts, { force: true });
  } catch {
    // Temporary cleanup must not hide test results.
  }
}

export default globalTeardown;