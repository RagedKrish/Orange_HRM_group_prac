import { expect, test } from '@playwright/test';
import { PIMPage, type EmployeeFormData } from '../pages/pim.page';

test.describe('Scenario 3 - Manage employee records', () => {
  test.describe('Negative scenarios', () => {
    test('S03-T01 - Validate blank Add Employee form blocks creation', async ({ page }) => {
      const pimPage = new PIMPage(page);

      await pimPage.goToEmployeeList();
      await pimPage.openAddEmployee();
      await pimPage.saveEmployee();

      await pimPage.expectRequiredValidation();
      await expect(page).toHaveURL(/\/pim\/addEmployee$/);
    });
  });

  test.describe('Positive scenarios', () => {
    test('S03-T02 - Create a unique employee, search it, and open edit form', async ({ page }) => {
      const pimPage = new PIMPage(page);
      const uniqueEmployee: EmployeeFormData = {
        firstName: 'QA',
        middleName: 'Playwright',
        lastName: 'Employee',
        // employeeId: `EMP_QA_${Date.now()}`,
        createLoginDetails: false,
      };
      const fullName = `${uniqueEmployee.firstName} ${uniqueEmployee.lastName}`;

      await pimPage.goToEmployeeList();
      await pimPage.openAddEmployee();
      await pimPage.fillEmployee(uniqueEmployee);
      await pimPage.saveEmployee();

      await expect(pimPage.employeeInformationHeading).toBeVisible();

      await pimPage.searchEmployees(fullName);
      await pimPage.expectEmployeeRow(fullName);

      await pimPage.editEmployee(fullName);
      await pimPage.expectPersonalDetailsPage();
    });

    test('S03-T03 - Guard employee deletion to the selected row', async ({ page }) => {
      const pimPage = new PIMPage(page);
      const uniqueEmployee: EmployeeFormData = {
        firstName: 'QA',
        middleName: 'Playwright',
        lastName: `Delete${Date.now()}`,
        // employeeId: `EMP_DEL_${Date.now()}`,
        createLoginDetails: false,
      };
      const fullName = `${uniqueEmployee.firstName} ${uniqueEmployee.lastName}`;

      await pimPage.goToEmployeeList();
      await pimPage.openAddEmployee();
      await pimPage.fillEmployee(uniqueEmployee);
      await pimPage.saveEmployee();

      await expect(pimPage.employeeInformationHeading).toBeVisible();

      await pimPage.searchEmployees(fullName);
      await pimPage.expectEmployeeRow(fullName);

      await pimPage.requestDeleteEmployee(fullName);
      await pimPage.expectDeleteDialog();
      await pimPage.cancelDeleteEmployee();

      await pimPage.searchEmployees(fullName);
      await pimPage.expectEmployeeRow(fullName);

      await pimPage.requestDeleteEmployee(fullName);
      await pimPage.expectDeleteDialog();
      await pimPage.confirmDeleteEmployee();

      await pimPage.searchEmployees(fullName);
      await pimPage.expectEmployeeNotFound(fullName);
    });
  });
});
