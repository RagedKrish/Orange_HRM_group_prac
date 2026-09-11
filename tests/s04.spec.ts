import { expect, test } from '@playwright/test';
import { AdminPage } from '../pages/admin.page';
import { MyInfoPage } from '../pages/my-info.page';

test.describe('S04 - Manage system users and personal information', () => {
  test('S04-T01 - validates Add User required and mismatched-password controls', async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.openSystemUsers();
    await adminPage.openAddUser();
    await adminPage.submitEmptyUserForm();
    await expect(adminPage.requiredMessages).toHaveCount(5);
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);

    await adminPage.fillMismatchedPasswords('Password123!', 'Different123!');
    await adminPage.submitEmptyUserForm();
    await expect(adminPage.passwordMismatchMessage).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);
  });

  test('S04-T02 - searches Admin and opens the row-level edit form', async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.openSystemUsers();
    await adminPage.searchUser('Admin');
    await adminPage.openUserEdit('Admin');

    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);
    await adminPage.expectEditFormForUser('Admin');
  });

  test('S04-T03 - inspects My Info tabs and non-destructive controls', async ({ page }) => {
    const myInfoPage = new MyInfoPage(page);

    await myInfoPage.open();
    await myInfoPage.expectAllTabs();
    await myInfoPage.openTab('Contact Details');
    await expect(page).toHaveURL(/\/pim\/contactDetails\/empNumber\//);
    await myInfoPage.expectPersonalDetailsControls();
  });
});