import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly dashboardHeading: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.loginError = page.getByText(/Invalid credentials|Required/i).first();
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isDashboardVisible(): Promise<boolean> {
    return this.dashboardHeading.isVisible();
  }

  async getLoginError(): Promise<string> {
    await expect(this.loginError).toBeVisible();
    return (await this.loginError.textContent())?.trim() ?? '';
  }

  async logout(): Promise<void> {
    await this.page.getByRole('banner').getByText(/profile/i).click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await this.verifyLoginPage();
  }

  async verifyLoginPage(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}