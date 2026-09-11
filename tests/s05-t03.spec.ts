import { expect, test } from '@playwright/test';
import { LeavePage } from './pages/leave.page';

test('S05-T03 - Review submitted leave in Leave List', async ({ page }) => {
  const leavePage = new LeavePage(page);
  const expectedComment = 'QA leave request S05-T03';

  await test.step('Submit a leave request for review when leave is available', async () => {
    await leavePage.openApplyLeave();
    const balance = await leavePage.getLeaveBalanceDays();

    expect(balance, 'Leave balance should be a readable numeric value.').toBeGreaterThanOrEqual(0);
    //test.skip(balance === 0, 'The current employee has no leave balance available for submission.');
    await leavePage.selectLeaveType('CAN - Personal');
    await leavePage.enterFromDate('2026-11-12');
    await leavePage.enterToDate('2026-11-12');
    await leavePage.selectDuration('Full Day');
    await leavePage.enterComments(expectedComment);
    await leavePage.submitLeaveRequest();
  });

  await test.step('Open the Leave List page and locate the submitted request', async () => {
    await leavePage.openLeaveList();
    const leaveRow = await leavePage.getLeaveRequestRow(expectedComment);

    await expect(leaveRow).toBeVisible();
  });

  await test.step('Inspect the request status, days, and comments', async () => {
    const leaveRow = await leavePage.getLeaveRequestRow(expectedComment, true);

    expect(leaveRow).not.toBeNull();
    await expect(leaveRow!).toContainText(/Pending Approval|Pending/i);
    await expect(leaveRow!).toContainText(expectedComment);
    await expect(leaveRow!).toContainText(/\d+\.?\d*|\d+\s*day/i);
  });
});
