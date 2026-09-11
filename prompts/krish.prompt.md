# OrangeHRM Playwright Automation Prompt

## Objective

You are a Senior Playwright Automation Engineer.

Your task is to generate production-ready Playwright TypeScript automation code for the OrangeHRM application using the provided test planner artifact.

## Application and Credentials

- Application URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- Username: `Admin`
- Password: `admin123`

## Framework Requirements

- Playwright + TypeScript
- Page Object Model (POM)
- Data-driven testing (DDT)
- JSON-based test data
- `globalSetup.ts`
- `globalTeardown.ts`
- `storageState` authentication
- Playwright Test Runner

## Folder Structure

```text
project-root/
├── pages/
│   └── login.page.ts
├── tests/
│   └── login.spec.ts
├── test-data/
│   └── loginData.json
├── storage/
│   └── admin.json
├── global-setup.ts
├── global-teardown.ts
├── playwright.config.ts
└── package.json
```

## Primary Objective

Generate complete code for:

1. `pages/login.page.ts`
2. `global-setup.ts`
3. `global-teardown.ts`
4. `tests/login.spec.ts`
5. `test-data/loginData.json`
6. Required `playwright.config.ts` updates

---

## Page Object Requirements

Create `pages/login.page.ts`.

### Implement

- `class LoginPage`

### Locators

- Username field
- Password field
- Login button
- Dashboard element
- Invalid credential error

### Methods

- `navigate()`
- `login(username: string, password: string)`
- `isDashboardVisible()`
- `getLoginError()`
- `logout()`
- `verifyLoginPage()`

Use robust Playwright locators and avoid XPath unless absolutely necessary.

---

## Global Setup Requirements

Create `global-setup.ts`.

### Workflow

1. Launch browser
2. Navigate to login page
3. Login using:
   - Username: `Admin`
   - Password: `admin123`
4. Verify dashboard loads
5. Save storage state

Storage file:

- `storage/admin.json`

Example target:

```ts
await page.context().storageState({
  path: 'storage/admin.json'
});
```

Close the browser after saving the storage state.

---

## Global Teardown Requirements

Create `global-teardown.ts`.

### Responsibilities

- Remove temporary test artifacts if required
- Optional logout
- Ensure clean framework shutdown

Do not over-engineer teardown.

---

## Playwright Config Requirements

Generate complete config updates.

### Include

- `globalSetup`
- `globalTeardown`
- `baseURL`
- `storageState`
- `trace`
- `screenshot`
- `video`

### Example

```ts
use: {
  baseURL: 'https://opensource-demo.orangehrmlive.com',
  storageState: 'storage/admin.json',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  video: 'retain-on-failure'
}
```

---

## Data-Driven Test Data

Create `test-data/loginData.json`.

Include both positive and negative cases.

### Example

```json
[
  {
    "testCaseId": "TC001",
    "scenario": "Valid Login",
    "username": "Admin",
    "password": "admin123",
    "expectedResult": "success"
  },
  {
    "testCaseId": "TC002",
    "scenario": "Invalid Username",
    "username": "InvalidUser",
    "password": "admin123",
    "expectedResult": "failure"
  },
  {
    "testCaseId": "TC003",
    "scenario": "Invalid Password",
    "username": "Admin",
    "password": "WrongPassword",
    "expectedResult": "failure"
  },
  {
    "testCaseId": "TC004",
    "scenario": "Empty Credentials",
    "username": "",
    "password": "",
    "expectedResult": "failure"
  }
]
```

---

## Test Spec Requirements

Create `tests/login.spec.ts`.

### Requirements

- Read test data from `loginData.json`
- Generate tests dynamically
- Use `LoginPage` class
- Follow Arrange → Act → Assert pattern
- Add descriptive test names
- Add Playwright test steps
- Use assertions

### Positive Tests

- Verify successful login
- Verify dashboard visible

### Negative Tests

- Invalid username
- Invalid password
- Empty credentials
- Verify error message

### Example Style

```ts
for (const data of loginData) {
  test(`${data.testCaseId} - ${data.scenario}`, async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });
}
```

---

## Authenticated Test Strategy

Implement two suites.

### Suite 1: Login Validation Tests

- No storage state
- Purpose: validate login functionality

### Suite 2: Authenticated Session Test

- Uses `storage/admin.json`
- Purpose: verify the user is already logged in
- Expected result: dashboard opens directly

---

## Coding Standards

- Strict TypeScript typing
- Async/await
- Reusable methods
- No hardcoded waits
- Use Playwright best practices
- Use `expect` assertions
- Follow SOLID principles
- Add comments only where required

---

## Output Format

Generate complete code for:

1. `login.page.ts`
2. `global-setup.ts`
3. `global-teardown.ts`
4. `playwright.config.ts`
5. `loginData.json`
6. `S01-T01.spec.ts`

Provide full source code for every file.

Do not provide explanations.

Output only the generated files.

---

## Add Test Cases S01-T02 and S01-T03

Create automation for Test Case IDs `S01-T02` and `S01-T03` from the provided test plan.

### Framework Requirements

- Use Playwright with Page Object Model (POM)
- Follow the existing project structure, coding standards, fixtures, utilities, and naming conventions
- Reuse the authenticated session created through global setup / storage state
- Do not implement login steps inside these tests if authentication is already handled by global setup

### Data-Driven Requirements

- Implement data-driven testing using external test data (`JSON`, `CSV`, or TS data file)
- All navigation items and expected page details must come from test data files, not hardcoded values
- Support adding new test data without modifying test logic

### POM Requirements

- Create or extend page objects only when necessary
- Keep selectors inside page object classes
- Test files should contain only test logic and assertions
- Reuse common methods wherever possible

### Traceability Requirements

- Include the Test Case ID in the test title
- Name files using the Test Case ID
- Add comments or metadata showing requirement coverage
- Reference any existing Test Case IDs already covered through shared flows or global setup when applicable

### Output Required

1. Folder structure
2. Test files
3. Page object files
4. Test data files
5. Any updates required in fixtures or utilities
6. Complete Playwright code following framework best practices
7. Explanation of how `S01-T02` and `S01-T03` map to the test plan and reuse existing authentication

Generate production-ready code and avoid duplicate functionality already available in the framework.

