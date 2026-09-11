import { expect, type Locator, type Page } from '@playwright/test';

export const myInfoTabs = [
  'Personal Details',
  'Contact Details',
  'Emergency Contacts',
  'Dependents',
  'Immigration',
  'Job',
  'Salary',
  'Report-to',
  'Qualifications',
  'Memberships',
] as const;

export class MyInfoPage {
  readonly page: Page;
  readonly attachmentsHeading: Locator;
  readonly saveButton: Locator;
  readonly attachmentAddButton: Locator;
  readonly attachmentViewButton: Locator;
  readonly attachmentDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.attachmentsHeading = page.getByRole('heading', { name: 'Attachments' });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true }).first();
    this.attachmentAddButton = page.getByRole('button', { name: /Add/ });
    this.attachmentViewButton = page.getByRole('button', { name: /View/ }).first();
    this.attachmentDeleteButton = page.getByRole('button', { name: /Delete/ }).first();
  }

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewMyDetails');
    await expect(this.page.getByRole('tab', { name: 'Personal Details' })).toBeVisible();
  }

  async expectAllTabs(): Promise<void> {
    for (const tabName of myInfoTabs) {
      await expect(this.page.getByRole('tab', { name: tabName, exact: true })).toBeVisible();
    }
  }

  async openTab(tabName: (typeof myInfoTabs)[number]): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
  }

  async expectPersonalDetailsControls(): Promise<void> {
    await this.openTab('Personal Details');
    await expect(this.saveButton).toBeVisible();
    await expect(this.attachmentsHeading).toBeVisible();
    await this.expectAttachmentControls();
  }

  async expectAttachmentControls(): Promise<void> {
    await expect(this.attachmentAddButton).toBeVisible();
    await expect(this.attachmentViewButton).toBeVisible();
    await expect(this.attachmentDeleteButton).toBeVisible();
  }
}