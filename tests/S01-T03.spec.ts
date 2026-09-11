import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { DashboardPage } from '../pages/dashboard.page';

type QuickLaunchData = {
  testCaseId: string;
  scenario: string;
  item: string;
  expectedHeading: string;
  expectedUrl: string;
};

const quickLaunchData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../test-data/s01-t03-quick-launch.json'), 'utf-8'),
) as QuickLaunchData[];

test.describe('S01-T03: Use Dashboard Quick Launch', () => {
  test('S01-T03 - Use Dashboard Quick Launch', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Requirement coverage: S01-T03
    // Reuses the authenticated admin session already created via global setup/storageState.
    await dashboardPage.gotoDashboard();

    for (const item of quickLaunchData) {
      await test.step(`Open Quick Launch item ${item.item} using data-driven test data`, async () => {
        await dashboardPage.openQuickLaunchItem(item.item);
        await dashboardPage.expectPageLoaded(item.expectedHeading, item.expectedUrl);
      });

      await dashboardPage.gotoDashboard();
    }
  });
});
