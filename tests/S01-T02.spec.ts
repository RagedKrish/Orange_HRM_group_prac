import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { DashboardPage } from '../pages/dashboard.page';

type NavigationData = {
  testCaseId: string;
  scenario: string;
  item: string;
  expectedHeading: string;
  expectedUrl: string;
};

const navigationData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../test-data/s01-t02-navigation.json'), 'utf-8'),
) as NavigationData[];

test.describe('S01-T02: Navigate from Dashboard to requested modules', () => {
  test('S01-T02 - Navigate from Dashboard to requested modules', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Requirement coverage: S01-T02
    // Reuses the authenticated admin session already created via global setup/storageState.
    await dashboardPage.gotoDashboard();

    for (const item of navigationData) {
      await test.step(`Navigate to ${item.item} using data-driven test data`, async () => {
        await dashboardPage.openNavigationItem(item.item);
        await dashboardPage.expectPageLoaded(item.expectedHeading, item.expectedUrl);
      });

      await dashboardPage.gotoDashboard();
    }
  });
});
