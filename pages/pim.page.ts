import { expect, type Locator, type Page } from '@playwright/test';

<<<<<<< HEAD
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
=======
export type EmployeeFormData = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  employeeId?: string;
  createLoginDetails?: boolean;
};

export class PIMPage {
  readonly page: Page;
  readonly employeeInformationHeading: Locator;
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly createLoginDetailsCheckbox: Locator;
  readonly saveButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeInformationHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.addEmployeeButton = page.getByRole('button', { name: 'Add' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('input[name="employeeId"]');
    this.createLoginDetailsCheckbox = page.getByRole('checkbox', { name: 'Create Login Details' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.searchInput = page.getByPlaceholder('Type for hints...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
  }

  async goToEmployeeList(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(this.employeeInformationHeading).toBeVisible();
  }

  async openAddEmployee(): Promise<void> {
    await this.addEmployeeButton.click();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
  }

  async fillEmployee(data: EmployeeFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName ?? '');
    await this.middleNameInput.fill(data.middleName ?? '');
    await this.lastNameInput.fill(data.lastName ?? '');
    // await this.employeeIdInput.fill(data.employeeId ?? ''); Already filled

    // if (data.createLoginDetails !== undefined) {
    //   await this.createLoginDetailsCheckbox.setChecked(Boolean(data.createLoginDetails));
    // }
  }

  async saveEmployee(): Promise<void> {
    await this.saveButton.click();
  }

  async searchEmployees(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async resetFilters(): Promise<void> {
    await this.resetButton.click();
  }

  async expectRequiredValidation(): Promise<void> {
    const requiredMessages = this.page.getByText('Required');
    await expect(requiredMessages.first()).toBeVisible();
  }

  async expectEmployeeRow(employeeName: string): Promise<void> {
    const row = this.page.locator('.oxd-table-card, .oxd-table-row').filter({ hasText: employeeName }).first();
    await expect(row).toContainText(employeeName);
  }

  async expectEmployeeNotFound(employeeName: string): Promise<void> {
    const row = this.page.locator('.oxd-table-card, .oxd-table-row').filter({ hasText: employeeName }).first();
    await expect(row).toHaveCount(0);
  }

  async editEmployee(employeeName: string): Promise<void> {
    const row = this.page.locator('.oxd-table-card, .oxd-table-row').filter({ hasText: employeeName }).first();
    await row.locator('i.bi-pencil-fill').first().click();
  }

  async requestDeleteEmployee(employeeName: string): Promise<void> {
    const row = this.page.locator('.oxd-table-card, .oxd-table-row').filter({ hasText: employeeName }).first();
    await row.locator('i.bi-trash').first().click();
  }

  async expectDeleteDialog(): Promise<void> {
    await expect(this.page.getByRole('dialog')).toBeVisible();
  }

  async cancelDeleteEmployee(): Promise<void> {
    await this.page.getByRole('button', { name: /cancel/i }).first().click();
  }

  async confirmDeleteEmployee(): Promise<void> {
    await this.page.getByRole('button', { name: /delete/i }).first().click();
  }

  async expectPersonalDetailsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
    await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
>>>>>>> ed5a7e396e5e06cce2b4412ff49b3b236b7c6f96
  }
}
