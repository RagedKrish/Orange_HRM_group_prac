import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/web/index.php/dashboard/index');
    await expect(this.page).toHaveURL(/\/web\/index\.php\/dashboard\/index$/);
    await expect(this.dashboardHeading).toBeVisible({ timeout: 15000 });
  }

  async openNavigationItem(item: string): Promise<void> {
    await this.page.getByRole('link', { name: item }).click();
  }

  async openQuickLaunchItem(item: string): Promise<void> {
    await this.page.getByRole('button', { name: item }).click();
  }

  async expectPageLoaded(expectedHeading: string, expectedUrl: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: expectedHeading })).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(expectedUrl.replace(/\//g, '\\/')));
  }
}
