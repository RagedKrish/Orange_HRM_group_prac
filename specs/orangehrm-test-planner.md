# OrangeHRM UI Automation Blueprint

## 1. Solution Summary

| Item                    | Details                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| Application             | OrangeHRM Open Source 5.9                                          |
| Entry URL               | https://opensource-demo.orangehrmlive.com/web/index.php/auth/login |
| Test User               | Admin                                                              |
| Authentication Strategy | Storage State                                                      |
| Framework               | Playwright + TypeScript                                            |
| Design Pattern          | Page Object Model (POM)                                            |
| Test Data Strategy      | JSON Driven                                                        |
| Execution Model         | Authenticated and Non-Authenticated Suites                         |
| Browser                 | Chromium                                                           |

---

# 2. Functional Areas Assessed

| Module         | Key Capabilities Identified                     |
| -------------- | ----------------------------------------------- |
| Authentication | Login, Forgot Password, Session Handling        |
| Dashboard      | Widgets, Quick Launch, Navigation               |
| Admin          | User Search, Add User, Edit User, Delete User   |
| PIM            | Employee Search, Employee Maintenance           |
| Leave          | Leave List, Apply Leave, Status Tracking        |
| My Info        | Personal Information, Attachments, Profile Tabs |

---

# 3. Proposed Automation Framework

```text
playwright.config.ts

globalSetup.ts
globalTeardown.ts

pages/
├── login.page.ts
├── dashboard.page.ts
├── admin.page.ts
├── pim.page.ts
├── leave.page.ts
└── myInfo.page.ts

tests/
├── auth.spec.ts
├── dashboard.spec.ts
├── admin.spec.ts
├── pim.spec.ts
├── leave.spec.ts
└── my-info.spec.ts

test-data/
├── loginData.json
├── employeeData.json
├── adminUsers.json
└── leaveData.json

utils/
├── testData.ts
├── selectors.ts
└── cleanup.ts

playwright/.auth/
└── admin.json
```

---

# 4. Authentication Approach

| Component              | Purpose                                |
| ---------------------- | -------------------------------------- |
| globalSetup.ts         | Creates authenticated session          |
| admin.json             | Persists session state                 |
| globalTeardown.ts      | Cleans framework artifacts if required |
| Authenticated Suites   | Reuse storage state                    |
| Login Validation Suite | Executes with fresh browser context    |

---

# 5. Page Object Inventory

| Page Object       | Responsibilities                       |
| ----------------- | -------------------------------------- |
| login.page.ts     | Login workflow and validation          |
| dashboard.page.ts | Dashboard widgets and navigation       |
| admin.page.ts     | System Users filtering and maintenance |
| pim.page.ts       | Employee Information management        |
| leave.page.ts     | Leave filtering and submission         |
| myInfo.page.ts    | Employee profile and attachments       |

---

# 6. Test Data Repository

| File              | Purpose                        |
| ----------------- | ------------------------------ |
| loginData.json    | Login and validation scenarios |
| employeeData.json | Employee search and creation   |
| adminUsers.json   | User management scenarios      |
| leaveData.json    | Leave workflow validation      |

---

# 7. Scenario Catalog

| Scenario ID | Scenario Name                                          | Priority | Objective                                             |
| ----------- | ------------------------------------------------------ | -------- | ----------------------------------------------------- |
| S01         | Authenticate and navigate the workforce workspace      | High     | Verify successful authentication and module access    |
| S02         | Review dashboard and search/filter operational records | High     | Validate dashboard widgets and filtering capabilities |
| S03         | Manage employee records                                | High     | Validate employee maintenance workflows               |
| S04         | Manage system users and personal information           | High     | Validate administration and profile functionality     |
| S05         | Apply and review leave                                 | Medium   | Validate leave management process                     |

---

# 8. Detailed Test Matrix

## Scenario S01

### Authenticate and Navigate the Workforce Workspace

| Test Case ID | Title                                        | Description                       | Preconditions                        | Test Data                  | Expected Result                                      | Automation |
| ------------ | -------------------------------------------- | --------------------------------- | ------------------------------------ | -------------------------- | ---------------------------------------------------- | ---------- |
| S01-T01      | Login with valid administrator credentials   | Authenticate from a fresh context | No storageState; login URL available | Admin/admin123             | /web/index.php/dashboard/index loads with Dashboard  | Yes        |
| S01-T02      | Navigate from Dashboard to requested modules | Verify visible side navigation    | Authenticated dashboard              | Admin, PIM, Leave, My Info | Requested modules load without losing authentication | Yes        |
| S01-T03      | Use Dashboard Quick Launch                   | Verify Quick Launch navigation    | Authenticated Dashboard              | Leave List and Apply Leave | Appropriate screens open successfully                | Yes        |

---

## Scenario S02

### Review Dashboard and Search/Filter Operational Records

| Test Case ID | Title                                 | Description                         | Preconditions                          | Test Data                          | Expected Result                                                                     | Automation |
| ------------ | ------------------------------------- | ----------------------------------- | -------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- | ---------- |
| S02-T01      | Search and reset System Users         | Use Admin filters                   | Authenticated Admin; Admin row exists  | Admin; Enabled                     | Matching row returns and Reset restores list                                        | Yes        |
| S02-T02      | Search and reset Employee Information | Use employee filter                 | Authenticated PIM; Amelia Brown exists | Amelia Brown                       | Matching employee displays and Reset restores defaults                              | Yes        |
| S02-T03      | Filter Leave List and inspect status  | Verify Leave List search and status | Authenticated Leave; existing records  | manda akhil user; Pending Approval | Date, employee, type, balance, days, status, comments, actions display; Reset works | Yes        |

---

## Scenario S03

### Employee Records Administration

| Test Case ID | Title                                       | Description                                    | Preconditions                                      | Test Data                          | Expected Result                                       | Automation |
| ------------ | ------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------- | ----------------------------------------------------- | ---------- |
| S03-T01      | Validate blank Add Employee form            | Required validation without creation           | Authenticated PIM; Add Employee page               | Empty form                         | Validation messages displayed and no employee added   | Yes        |
| S03-T02      | Create and update a unique employee         | Create approved unique employee then open edit | Authenticated Admin; unique data; cleanup manifest | QA/Playwright/Employee; EMP_QA_001 | Employee created and Personal Details page accessible | Yes        |
| S03-T03      | Guard employee deletion to the selected row | Verify scoped delete and confirmation          | Test-created employee; cleanup approval            | S03-T02 identifier                 | Target row only is affected                           | Yes        |

---

## Scenario S04

### System User & Profile Administration

| Test Case ID | Title                                        | Description                                 | Preconditions                          | Test Data                       | Expected Result                                       | Automation |
| ------------ | -------------------------------------------- | ------------------------------------------- | -------------------------------------- | ------------------------------- | ----------------------------------------------------- | ---------- |
| S04-T01      | Validate Add User required controls          | Required and mismatched-password validation | Authenticated Admin; Add User page     | Empty form; mismatched password | Save prevented and validation shown                   | Yes        |
| S04-T02      | Search an existing system user and open edit | Verify row-level edit navigation            | Authenticated Admin; Admin row exists  | Admin                           | Edit page opens for selected user                     | Yes        |
| S04-T03      | Inspect My Info tabs and attachment controls | Validate profile navigation                 | Authenticated Admin; My Info available | Ten verified tab names          | Tabs and controls available without data modification | Yes        |

---

## Scenario S05

### Leave Management Workflow

| Test Case ID | Title                                               | Description                          | Preconditions                         | Test Data                       | Expected Result                            | Automation |
| ------------ | --------------------------------------------------- | ------------------------------------ | ------------------------------------- | ------------------------------- | ------------------------------------------ | ---------- |
| S05-T01      | Validate Apply Leave required fields and date range | Blank and invalid date submissions   | Authenticated Leave; Apply Leave page | Empty fields; invalidRange      | Validation prevents request creation       | Yes        |
| S05-T02      | Submit leave when balance permits                   | Submit only when balance supports it | Authenticated Leave; positive balance | validIfBalanceAvailable         | Request submitted when balance allows      | Yes        |
| S05-T03      | Review submitted leave in Leave List                | Verify permitted request result      | S05-T02 succeeded                     | Unique comment/date combination | Leave request appears with expected status | Yes        |

---
