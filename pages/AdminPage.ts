import { expect, type Locator, type Page } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly saveButton: Locator;
  readonly searchButton: Locator;
  readonly requiredMessages: Locator;
  readonly passwordMismatchMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: /Add/ });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.requiredMessages = page.getByText('Required', { exact: true });
    this.passwordMismatchMessage = page.getByText(/passwords do not match|password mismatch/i);
  }

  private inputByLabel(label: string): Locator {
    return this.page.getByLabel(label, { exact: true });
  }

  private userRow(username: string): Locator {
    return this.page.getByRole('row').filter({ hasText: username });
  }

  async openSystemUsers(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
    await expect(this.page.getByRole('heading', { name: 'System Users' })).toBeVisible();
  }

  async openAddUser(): Promise<void> {
    await this.addButton.click();
    await expect(this.page.getByRole('heading', { name: /Add User/ })).toBeVisible();
  }

  async saveUser(): Promise<void> {
    await this.saveButton.click();
  }

  async fillPasswordConfirmation(password: string, confirmation: string): Promise<void> {
    await this.inputByLabel('Password').fill(password);
    await this.inputByLabel('Confirm Password').fill(confirmation);
  }

  async expectRequiredValidation(): Promise<void> {
    await expect(this.requiredMessages).toHaveCount(6);
  }

  async expectPasswordMismatchValidation(): Promise<void> {
    await expect(this.passwordMismatchMessage).toBeVisible();
  }

  async searchSystemUser(username: string): Promise<void> {
    await this.inputByLabel('Username').fill(username);
    await this.searchButton.click();
  }

  async expectUserRow(username: string): Promise<void> {
    await expect(this.userRow(username)).toBeVisible();
  }

  async openUserEdit(username: string): Promise<void> {
    const row = this.userRow(username);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /edit|pencil/i }).click();
  }

  async expectEditFormForUser(username: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Edit User/ })).toBeVisible();
    await expect(this.page.getByText(username, { exact: true })).toBeVisible();
  }
}