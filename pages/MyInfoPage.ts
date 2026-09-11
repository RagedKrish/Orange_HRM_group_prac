import { expect, type Locator, type Page } from '@playwright/test';

export class MyInfoPage {
  readonly page: Page;
  readonly saveButton: Locator;
  readonly attachmentSection: Locator;
  readonly attachmentAddControl: Locator;
  readonly attachmentViewControl: Locator;
  readonly attachmentDeleteControl: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true }).first();
    this.attachmentSection = page.getByText('Attachments', { exact: true });
    this.attachmentAddControl = page.getByRole('button', { name: /Add attachment|Add/ }).last();
    this.attachmentViewControl = page.getByRole('button', { name: /View attachment|View/ }).first();
    this.attachmentDeleteControl = page.getByRole('button', { name: /Delete attachment|Delete/ }).first();
  }

  private tab(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName, exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewMyDetails');
    await expect(this.tab('Personal Details')).toBeVisible();
  }

  async expectTabs(tabs: readonly string[]): Promise<void> {
    for (const tabName of tabs) {
      await expect(this.tab(tabName)).toBeVisible();
    }
  }

  async openTab(tabName: string): Promise<void> {
    await this.tab(tabName).click();
  }

  async expectContactDetailsOpen(): Promise<void> {
    await expect(this.tab('Contact Details')).toHaveAttribute('aria-selected', 'true');
  }

  async returnToProfile(): Promise<void> {
    await this.openTab('Personal Details');
    await expect(this.tab('Personal Details')).toHaveAttribute('aria-selected', 'true');
  }

  async expectSaveControl(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  async expectAttachmentControls(): Promise<void> {
    await expect(this.attachmentSection).toBeVisible();
    await expect(this.attachmentAddControl).toBeVisible();
    await expect(this.attachmentViewControl).toBeVisible();
    await expect(this.attachmentDeleteControl).toBeVisible();
  }
}