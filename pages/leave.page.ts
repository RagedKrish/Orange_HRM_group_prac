import { expect, type Locator, type Page } from '@playwright/test';

export class LeavePage {
  readonly page: Page;
  readonly employeeNameInput: Locator;
  readonly statusSelect: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly leaveTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeNameInput = page.getByPlaceholder('Type for hints...').first();
    this.statusSelect = page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-text').last();
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
    this.leaveTable = page.getByRole('table');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/leave/viewLeaveList');
    await expect(this.page.getByRole('heading', { name: 'Leave List' })).toBeVisible();
  }

  async searchLeave(employee: string, status: string): Promise<void> {
    await this.employeeNameInput.fill(employee);
    const employeeSuggestion = this.page.getByRole('option', { name: employee, exact: true });
    if (await employeeSuggestion.isVisible()) {
      await employeeSuggestion.click();
    }
    await this.statusSelect.click();
    await this.page.getByText(status, { exact: true }).last().click();
    await this.searchButton.click();
  }

  async resetSearch(): Promise<void> {
    await this.resetButton.click();
    await this.employeeNameInput.fill('');
  }

  async verifyLeaveResults(employee: string): Promise<void> {
    await expect(this.leaveTable).toBeVisible();
    const resultRow = this.leaveTable.getByRole('row').filter({ hasText: employee }).first();
    await expect(resultRow).toBeVisible();
    await expect(resultRow.getByText(/Pending Approval/)).toBeVisible();
  }

  async verifyRequiredColumns(): Promise<void> {
    for (const column of [
      'Date',
      'Employee Name',
      'Leave Type',
      'Leave Balance (Days)',
      'Number of Days',
      'Status',
      'Comments',
      'Actions',
    ]) {
      await expect(this.leaveTable.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }
  }
}
