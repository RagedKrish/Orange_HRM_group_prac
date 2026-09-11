import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/login.page';

type LoginData = {
  testCaseId: string;
  scenario: string;
  username: string;
  password: string;
  expectedResult: 'success' | 'failure';
};

const loginData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../test-data/loginData.json'), 'utf-8'),
) as LoginData[];

test.describe('Login validation tests', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const data of loginData) {
    test(`${data.testCaseId} - ${data.scenario}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await test.step('Arrange: open the login page', async () => {
        await loginPage.navigate();
        await loginPage.verifyLoginPage();
      });

      await test.step('Act: submit the data-driven credentials', async () => {
        await loginPage.login(data.username, data.password);
      });

      await test.step('Assert: verify the expected authentication result', async () => {
        if (data.expectedResult === 'success') {
          await expect(loginPage.dashboardHeading).toBeVisible();
          await expect(page).toHaveURL(/\/dashboard\/index/);
        } else {
          await expect(loginPage.dashboardHeading).not.toBeVisible();
          await expect(loginPage.loginError).toBeVisible();
        }
      });
    });
  }
});

test.describe('Authenticated session tests', () => {
  test('opens the dashboard from storage state', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Act: open the application root', async () => {
      await page.goto('/web/index.php/dashboard/index');
    });

    await test.step('Assert: verify the stored session is authenticated', async () => {
      await expect(loginPage.dashboardHeading).toBeVisible();
      await expect(page).toHaveURL(/\/dashboard\/index/);
    });
  });
});