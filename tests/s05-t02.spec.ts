import { expect, test } from '@playwright/test';
import { LeavePage } from './pages/leave.page';

test('S05-T02 - Submit leave when balance permits', async ({ page }) => {
  const leavePage = new LeavePage(page);
  const request = {
    leaveType: 'CAN - Personal',
    fromDate: '2026-11-10',
    toDate: '2026-11-10',
    comments: 'QA leave request',
  };

  await test.step('Open the Apply Leave form and confirm the balance is available', async () => {
    await leavePage.openApplyLeave();
    const balance = await leavePage.getLeaveBalanceDays();
    expect(balance, 'Leave balance should be a readable numeric value.').toBeGreaterThanOrEqual(0);
    //test.skip(balance === 0, 'The current employee has no leave balance available for submission.');
  });

  await test.step('Submit a valid leave request', async () => {
    await leavePage.selectLeaveType(request.leaveType);
    await leavePage.enterFromDate(request.fromDate);
    await leavePage.enterToDate(request.toDate);
    await leavePage.selectDuration('Full Day');
    await leavePage.enterComments(request.comments);
    await leavePage.submitLeaveRequest();
  });

  await test.step('Verify the request appears in the Leave List', async () => {
    await leavePage.openLeaveList();
    const leaveRow = await leavePage.getLeaveRequestRow(request.comments);

    await expect(leaveRow).toBeVisible();
    await expect(leaveRow).toContainText(/Pending Approval|Pending/i);
  });
});
