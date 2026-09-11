
Use the following test cases as the source of truth.

Generate a complete Playwright automation framework using the Page Object Model (POM) pattern.

Requirements:

- Create one Page Object per application area.
- Create reusable methods only.
- Use TypeScript.
- Use Playwright Test.
- Use robust locators (prefer getByRole, getByLabel, getByText where appropriate).
- Add assertions for every expected result.
- Follow POM best practices.
- Do not execute tests.
- Do not inspect the DOM.
- Do not analyze selectors from the live application.
- Do not debug existing automation.
- Generate the framework structure and implementation only.

Scenarios to automate:

S04-T01
Title: Validate Add User required controls
Description: Required and mismatched-password validation without saving.
Preconditions: Authenticated Admin; Add User page.
Test Data: Empty form; mismatched password.
Steps:

1. Click Save on empty form.
2. Enter mismatched password and confirm password.
3. Click Save.
   Expected:

- Validation prevents save.
- No user is created.

S04-T02
Title: Search an existing system user and open edit
Description: Verify row-level edit navigation.
Preconditions: Authenticated Admin; Admin row exists.
Test Data: Admin.
Steps:

1. Search for Admin.
2. Click Edit/Pencil icon.
   Expected:

- Edit form opens.
- Selected Admin details are displayed.

S04-T03
Title: Inspect My Info tabs and attachment controls
Description: Verify profile navigation and controls.
Preconditions: Authenticated Admin; My Info available.
Test Data: Verify all tabs.
Steps:

1. Navigate to My Info.
2. Verify all expected tabs.
3. Open Contact Details.
4. Return to profile.
5. Verify Save button.
6. Verify attachment Add/View/Delete controls.
   Expected:

- Tabs are accessible.
- Contact Details opens successfully.
- Save control visible.
- Attachment controls visible.
- No data modifications performed.

Generate:

pages/
  AdminPage.ts
  MyInfoPage.ts

tests/
  s04.spec.ts

Include:

- Full Page Object classes
- Full Playwright test implementations
- Assertions
- Comments explaining each validation

Output code only.
