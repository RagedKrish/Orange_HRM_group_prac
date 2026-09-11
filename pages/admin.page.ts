import { expect, type Locator, type Page } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly systemUsersHeading: Locator;
  readonly addUserHeading: Locator;
  readonly saveButton: Locator;
  readonly requiredMessages: Locator;
  readonly passwordMismatchMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
    this.addUserHeading = page.getByRole('heading', { name: 'Add User' });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.requiredMessages = page.getByText('Required', { exact: true });
    this.passwordMismatchMessage = page.getByText(/Passwords do not match/i);
  }

  private fieldInput(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('..').locator('input');
  }

  async openSystemUsers(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
    await expect(this.systemUsersHeading).toBeVisible();
  }

  async openAddUser(): Promise<void> {
    await this.page.getByRole('button', { name: /Add/ }).click();
    await expect(this.addUserHeading).toBeVisible();
  }

  async submitEmptyUserForm(): Promise<void> {
    await this.saveButton.click();
  }

  async fillMismatchedPasswords(password: string, confirmation: string): Promise<void> {
    const passwordInputs = this.page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill(password);
    await passwordInputs.nth(1).fill(confirmation);
  }

  async searchUser(username: string): Promise<void> {
    await this.page.getByRole('textbox').nth(1).fill(username);
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();
  }

  async openUserEdit(username: string): Promise<void> {
    const row = this.page.getByRole('row', {
      name: new RegExp(`\\b${username}\\s+Admin\\b`),
    }).first();
    await expect(row).toBeVisible();
    await row.locator('i.bi-pencil-fill').locator('..').click();
  }

  async expectEditFormForUser(username: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
    await expect(this.page.getByRole('textbox').last()).toHaveValue(username);
  }
}