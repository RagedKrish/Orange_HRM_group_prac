import { chromium, expect, type FullConfig } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { LoginPage } from './pages/login.page';

async function globalSetup(config: FullConfig): Promise<void> {
  const storagePath = path.resolve(config.rootDir, '../storage/admin.json');
  await fs.mkdir(path.dirname(storagePath), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: config.projects[0].use.baseURL });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('Admin', 'admin123');
  await page.waitForURL(/\/web\/index\.php\/dashboard\/index$/, { timeout: 15000 });
  await context.storageState({ path: storagePath });

  await browser.close();
}

export default globalSetup;