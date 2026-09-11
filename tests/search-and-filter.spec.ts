import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { AdminPage } from '../pages/admin.page';
import { LeavePage } from '../pages/leave.page';
import { PimPage } from '../pages/pim.page';

test.use({ storageState: 'storage/admin.json' });

type SearchFilterData =
  | { testCaseId: 'S02-T01'; module: 'Admin'; username: string; status: string }
  | { testCaseId: 'S02-T02'; module: 'PIM'; employeeName: string }
  | { testCaseId: 'S02-T03'; module: 'Leave'; employeeName: string; status: string };

const searchFilterData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../test-data/searchFilterData.json'), 'utf-8'),
) as SearchFilterData[];

test.describe('Search and filter tests', () => {
  for (const data of searchFilterData) {
    test(`${data.testCaseId} ${data.module} search and reset`, async ({ page }) => {
      if (data.module === 'Admin') {
        const adminPage = new AdminPage(page);

        await test.step('Arrange: navigate to Admin Module', async () => {
          await adminPage.navigate();
        });
        await test.step('Act: search System Users', async () => {
          await adminPage.searchUser(data.username, data.status);
        });
        await test.step('Assert: verify matching user', async () => {
          await adminPage.verifyUserExists(data.username);
        });
        await test.step('Act: reset filters', async () => {
          await adminPage.resetSearch();
        });
        await test.step('Assert: verify default user list', async () => {
          await expect(adminPage.usernameInput).toHaveValue('');
          await expect(adminPage.usersTable).toBeVisible();
        });
        return;
      }

      if (data.module === 'PIM') {
        const pimPage = new PimPage(page);

        // The current public demo account has no PIM employee records to search.
        test.fixme(true, 'External demo data currently returns No Records Found for every PIM search.');

        await test.step('Arrange: navigate to PIM', async () => {
          await pimPage.navigate();
        });
        await test.step('Act: search Employee Information', async () => {
          await pimPage.searchEmployee(data.employeeName);
        });
        await test.step('Assert: verify matching employee', async () => {
          await pimPage.verifyEmployeeExists(data.employeeName);
        });
        await test.step('Act: reset filters', async () => {
          await pimPage.resetSearch();
        });
        await test.step('Assert: verify default employee list', async () => {
          await expect(pimPage.employeeNameInput).toHaveValue('');
          await expect(pimPage.employeeTable).toBeVisible();
        });
        return;
      }

      const leavePage = new LeavePage(page);
      await test.step('Arrange: navigate to Leave Module', async () => {
        await leavePage.navigate();
      });
      await test.step('Act: filter Leave List', async () => {
        await leavePage.searchLeave(data.employeeName, data.status);
      });
      await test.step('Assert: verify leave results and columns', async () => {
        await leavePage.verifyLeaveResults(data.employeeName);
        await leavePage.verifyRequiredColumns();
      });
      await test.step('Act: reset filters', async () => {
        await leavePage.resetSearch();
      });
      await test.step('Assert: verify default leave list', async () => {
        await expect(leavePage.employeeNameInput).toHaveValue('');
        await expect(leavePage.leaveTable).toBeVisible();
      });
    });
  }
});
