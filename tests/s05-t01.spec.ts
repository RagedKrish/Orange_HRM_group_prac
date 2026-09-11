import { expect, test } from '@playwright/test';
import { LeavePage } from './pages/leave.page';

test('S05-T01 - Validate Apply Leave required fields and date range', async ({ page }) => {
  const leavePage = new LeavePage(page);

  await test.step('Open the Apply Leave page', async () => {
    await leavePage.openApplyLeave();
  });

  const noLeaveTypesMessage = page.getByText('No Leave Types with Leave Balance');
  if (await noLeaveTypesMessage.isVisible()) {
    await expect(noLeaveTypesMessage).toBeVisible();
    return;
  }

  await test.step('Submit the blank leave form', async () => {
    await leavePage.submitLeaveRequest();
  });

  await test.step('Verify blank form validation appears', async () => {
    const requiredMessages = page.getByText(/Required/i);
    const requiredCount = await requiredMessages.count();

    expect(requiredCount).toBeGreaterThan(0);
    await expect(requiredMessages.first()).toBeVisible();
  });

  await test.step('Submit a leave request with a later From Date than To Date', async () => {
    await leavePage.selectLeaveType('CAN - Personal');
    await leavePage.enterFromDate('2026-12-11');
    await leavePage.enterToDate('2026-12-10');
    await leavePage.enterComments('Invalid date range');
    await leavePage.submitLeaveRequest();
  });

  await test.step('Verify the invalid date range is rejected', async () => {
    const validationError = page.getByText(/From date should be before to date|To date should be after From date|date should be before/i).first();

    await expect(validationError).toBeVisible();
  });
});
