import { expect, type Locator, type Page } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly statusSelect: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly usersTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').first();
    this.statusSelect = page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-text').first();
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
    this.usersTable = page.getByRole('table');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
    await expect(this.page.getByRole('heading', { name: 'System Users' })).toBeVisible();
  }

  async searchUser(username: string, status: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.statusSelect.click();
    await this.page.getByText(status, { exact: true }).last().click();
    await this.searchButton.click();
  }

  async resetSearch(): Promise<void> {
    await this.resetButton.click();
  }

  async verifyUserExists(username: string): Promise<void> {
    await expect(this.usersTable).toBeVisible();
    await expect(this.usersTable.getByRole('row').filter({ hasText: username })).toBeVisible();
  }
}
