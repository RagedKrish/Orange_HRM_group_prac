import { expect, type Locator, type Page } from '@playwright/test';

export class LeavePage {
  readonly page: Page;
  readonly leaveTypeDropdown: Locator;
  readonly durationDropdown: Locator;
  readonly applyButton: Locator;
  readonly dateInputs: Locator;
  readonly commentsField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leaveTypeDropdown = page.locator('.oxd-select-text').first();
    this.durationDropdown = page.locator('.oxd-select-text').nth(1);
    this.applyButton = page.getByRole('button', { name: /^Apply$/ });
    this.dateInputs = page.locator('input[placeholder="yyyy-dd-mm"]');
    this.commentsField = page.locator('textarea').first();
  }

  async openApplyLeave(): Promise<void> {
    await this.page.goto('/web/index.php/leave/applyLeave', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByRole('heading', { name: 'Apply Leave' })).toBeVisible();
  }

  async openLeaveList(): Promise<void> {
    await this.page.goto('/web/index.php/leave/viewLeaveList', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('.oxd-table, .oxd-table-body')).toBeVisible({ timeout: 15000 });
  }

  async selectLeaveType(leaveType: string): Promise<void> {
    await this.leaveTypeDropdown.click();
    await this.page.getByRole('option', { name: leaveType }).first().click();
  }

  async selectDuration(duration: string): Promise<void> {
    await this.durationDropdown.click();
    await this.page.getByText(duration, { exact: true }).last().click();
  }

  async enterFromDate(date: string): Promise<void> {
    const dateInput = this.dateInputs.nth(0);
    await dateInput.click();
    await dateInput.press('ControlOrMeta+A');
    await dateInput.press('Backspace');
    await dateInput.type(date);
  }

  async enterToDate(date: string): Promise<void> {
    const dateInput = this.dateInputs.nth(1);
    await dateInput.click();
    await dateInput.press('ControlOrMeta+A');
    await dateInput.press('Backspace');
    await dateInput.type(date);
  }

  async enterComments(comments: string): Promise<void> {
    await this.commentsField.fill(comments);
  }

  async submitLeaveRequest(): Promise<void> {
    await expect(this.page.locator('.oxd-form-loader')).toBeHidden({ timeout: 15000 });
    await expect(this.applyButton).toBeEnabled({ timeout: 15000 });
    await this.applyButton.click();
  }

  async getLeaveBalanceDays(): Promise<number> {
    const pageText = await this.page.locator('body').textContent();
    const match = pageText?.match(/Leave Balance\s*[\s\S]*?(\d+(?:\.\d+)?)\s*Day\(s\)/i);
    const value = match?.[1] ?? '0';

    return Number.parseFloat(value);
  }

  async getLeaveRequestRow(comment: string, skipIfMissing = false): Promise<Locator | null> {
    const rows = this.page.locator('table tbody tr, .oxd-table-card, .oxd-table-row');
    const rowCount = await rows.count();

    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index);
      const rowText = (await row.textContent()) ?? '';

      if (rowText.toLowerCase().includes(comment.toLowerCase())) {
        return row;
      }
    }

    if (skipIfMissing) {
      return null;
    }

    throw new Error(`Leave request with comment "${comment}" was not found in the Leave List.`);
  }
}
