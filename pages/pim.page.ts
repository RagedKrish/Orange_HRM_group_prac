import { expect, type Locator, type Page } from '@playwright/test';

export class PimPage {
  readonly page: Page;
  readonly employeeNameInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly employeeTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeNameInput = page.getByPlaceholder('Type for hints...').first();
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
    this.employeeTable = page.getByRole('table');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(this.page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();
  }

  async searchEmployee(employeeName: string): Promise<void> {
    await this.employeeNameInput.fill(employeeName);
    const employeeSuggestion = this.page.getByRole('option', { name: employeeName, exact: true });
    if (await employeeSuggestion.isVisible()) {
      await employeeSuggestion.click();
    }
    await this.searchButton.click();
  }

  async resetSearch(): Promise<void> {
    await this.resetButton.click();
  }

  async verifyEmployeeExists(employeeName: string): Promise<void> {
    await expect(this.employeeTable).toBeVisible();
    await expect(this.employeeTable.getByRole('row').filter({ hasText: employeeName })).toBeVisible();
  }
}
