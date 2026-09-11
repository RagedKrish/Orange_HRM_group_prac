# OrangeHRM Verified UI Test Planner

# Application Overview

OrangeHRM OS 5.9 was inspected live at https://opensource-demo.orangehrmlive.com/web/index.php/auth/login with Admin/admin123. Login reached /web/index.php/dashboard/index. Dashboard verified Time at Work, My Actions, Quick Launch (Assign Leave, Leave List, Timesheets, Apply Leave, My Leave, My Timesheet), Buzz Latest Posts, Employees on Leave Today, and employee distribution widgets. The authenticated account displayed manda user.

# Module Analysis
Authentication verified username/password fields, Login, Forgot your password?, and OS version. The login URL redirected to Dashboard after authentication; fresh unauthenticated negative-login behavior was not re-entered because the planner session retained authentication. Navigation verified Admin (/web/index.php/admin/viewAdminModule), PIM (/web/index.php/pim/viewPimModule), Leave (/web/index.php/leave/viewLeaveModule), Time, Recruitment, My Info (/web/index.php/pim/viewMyDetails), Performance, Dashboard, Directory, Maintenance, Claim, and Buzz. Authenticated pages exposed the Search textbox.

Admin verified System Users at /web/index.php/admin/viewSystemUsers with Username, User Role, Employee Name (Type for hints...), Status, Reset, Search, Add, records table, edit and delete row actions. Add User at /web/index.php/admin/saveSystemUser verified required User Role, Employee Name, Status, Username, Password, Confirm Password, Cancel, Save.

PIM verified Employee Information at /web/index.php/pim/viewEmployeeList with filters, Reset, Search, Add, records, pagination, columns Id, First (& Middle) Name, Last Name, Job Title, Employment Status, Sub Unit, Supervisor, Actions. Row actions use bi-pencil-fill and bi-trash. Add Employee at /web/index.php/pim/addEmployee verified photo Choose File, firstName, middleName, lastName, Employee Id, Create Login Details checkbox, Cancel, Save. Blank Save produced two visible Required messages. Edit routed to /web/index.php/pim/viewPersonalDetails/empNumber/<id>.

Leave verified Leave List at /web/index.php/leave/viewLeaveList with Apply, My Leave, Leave List, Assign Leave, filters, Reset, Search, records, status and actions. Apply Leave at /web/index.php/leave/applyLeave verified required Leave Type, displayed Leave Balance, required From Date and To Date, Comments, Apply. Current account showed 0.00 Day(s), so positive submission was not assumed.

My Info verified /web/index.php/pim/viewPersonalDetails/empNumber/7 for manda user. Tabs: Personal Details, Contact Details, Emergency Contacts, Dependents, Immigration, Job, Salary, Report-to, Qualifications, Memberships. Personal Details and Custom Fields have Save; Attachments has Add and existing attachment actions.

# Framework Design
Use Playwright with TypeScript, POM, JSON data-driven tests, globalSetup.ts, globalTeardown.ts, storageState authentication, and isolated data. Suggested structure:

```text
playwright.config.ts
globalSetup.ts
globalTeardown.ts
pages/{login.page.ts,dashboard.page.ts,admin.page.ts,pim.page.ts,leave.page.ts,myInfo.page.ts}
tests/{auth.spec.ts,dashboard.spec.ts,admin.spec.ts,pim.spec.ts,leave.spec.ts,my-info.spec.ts}
test-data/{loginData.json,employeeData.json,adminUsers.json,leaveData.json}
utils/{testData.ts,selectors.ts,cleanup.ts}
playwright/.auth/admin.json
```

Use roles, labels, placeholders, hrefs, and stable attributes; avoid generated refs and positional selectors. Configure baseURL, Chromium, retries, trace on first retry, screenshot/video on failure. globalSetup opens login, fills input[name=username] and input[name=password], clicks button[type=submit], waits for /dashboard/index, asserts an authenticated control, saves storageState to playwright/.auth/admin.json, and closes the context. Authenticated suites use that state; auth tests use a fresh context. globalTeardown reads a run manifest and deletes only run-created records through guarded UI cleanup, leaving existing records untouched. No API seeding is assumed.

# Page Object Design
login.page.ts: login route, username/password, Login, validation. Locators: input[name=username], input[name=password], button[type=submit], Forgot your password?. Methods: goto, login, submit, expectLoginValidation.
dashboard.page.ts: dashboard, Quick Launch, profile, navigation. Locators: heading Dashboard, named Quick Launch buttons, navigation links. Methods: expectLoaded, openQuickLaunch, goToModule, openProfileMenu.
admin.page.ts: System Users filters, Search/Reset, Add User, table and row actions. Locators: heading System Users, field labels, named buttons, username-scoped rows, bi-pencil-fill/bi-trash. Methods: searchUsers, resetFilters, openAddUser, fillUser, saveUser, editUser, requestDeleteUser, expectUserRow.
pim.page.ts: Employee Information, pagination, Add Employee, edit/delete. Locators: heading Employee Information, First Name/Middle Name/Last Name, named buttons, Create Login Details, row-scoped icons. Methods: searchEmployees, resetFilters, openAddEmployee, fillEmployee, toggleLoginDetails, saveEmployee, editEmployee, requestDeleteEmployee, expectValidation.
leave.page.ts: Leave List, Apply Leave, balance, status. Locators: headings, required labels, Comments, Search/Reset/Apply, rows by employee/date. Methods: openLeaveList, searchLeaves, resetFilters, openApplyLeave, fillLeave, applyLeave, expectBalance, expectStatus.
myInfo.page.ts: profile tabs, Personal Details, Custom Fields, Attachments. Locators: tab names, headings, Save/Add, attachment rows. Methods: openTab, expectTabs, editPersonalDetails, savePersonalDetails, addAttachment, expectAttachment.

# Test Data Design
Store credentials and mutable data in JSON with environment overrides for secrets.

```json
// loginData.json
[{"name":"valid admin","username":"Admin","password":"admin123","expectedPath":"/web/index.php/dashboard/index"},{"name":"blank","username":"","password":"","expectedErrors":["Required"]}]
```
```json
// employeeData.json
{"uniqueEmployee":{"firstName":"QA","middleName":"Playwright","lastName":"Employee","employeeId":"EMP_QA_001","photoPath":"test-data/assets/avatar.png","createLoginDetails":false},"search":{"employeeName":"Amelia Brown"}}
```
```json
// adminUsers.json
{"uniqueUser":{"role":"ESS","employeeName":"Amelia Brown","status":"Enabled","username":"qa_admin_user","password":"Qa!23456pass","confirmPassword":"Qa!23456pass"},"search":{"username":"Admin","status":"Enabled"}}
```
```json
// leaveData.json
{"validIfBalanceAvailable":{"leaveType":"US - Bereavement","fromDate":"2026-11-10","toDate":"2026-11-11","comments":"QA leave request"},"invalidRange":{"leaveType":"US - Bereavement","fromDate":"2026-12-11","toDate":"2026-12-10","comments":"Invalid date range"}}
```
The live balance was 0.00; validIfBalanceAvailable is conditional and must be blocked when balance is unavailable.

# Automation Scenarios
Exactly five scenarios: S01 and S02 Smoke, S03 and S04 Regression, S05 End-to-End.

Scenario ID: S01
Scenario Name: Authenticate and navigate the workforce workspace
Business Objective: Confirm an authorized administrator can sign in and reach Dashboard and requested modules.
Priority: High
Preconditions: Fresh browser context; valid demo credentials.
Required Test Data: Valid loginData record.
Expected Outcomes: Dashboard loads and Admin, PIM, Leave, My Info routes load.

Scenario ID: S02
Scenario Name: Review dashboard and search/filter operational records
Business Objective: Confirm dashboard entry points and list filters find users, employees, and leave records.
Priority: High
Preconditions: Authenticated Admin; existing records.
Required Test Data: adminUsers search, employeeData search, Leave filters.
Expected Outcomes: Quick Launch is visible; Search and Reset produce filtered/default list states.

Scenario ID: S03
Scenario Name: Manage employee records
Business Objective: Confirm employee create validation, update navigation, and scoped delete affordance.
Priority: High
Preconditions: Authenticated Admin; unique employee data; cleanup permission.
Required Test Data: employeeData uniqueEmployee.
Expected Outcomes: Required fields are enforced; approved create is findable; edit opens Personal Details; delete is scoped and guarded.

Scenario ID: S04
Scenario Name: Manage system users and personal information
Business Objective: Confirm user validation and signed-in employee profile access.
Priority: High
Preconditions: Authenticated Admin; unique user data; existing profile.
Required Test Data: adminUsers uniqueUser and verified tabs.
Expected Outcomes: Add User validation works; row actions are scoped; My Info tabs and Save/Attachment controls are available.

Scenario ID: S05
Scenario Name: Apply and review leave
Business Objective: Confirm leave entry, validation, permitted submission, and review.
Priority: Medium
Preconditions: Authenticated user; configured leave type; positive balance for success.
Required Test Data: validIfBalanceAvailable and invalidRange.
Expected Outcomes: Required fields/balance visible; invalid ranges rejected; positive-balance request appears in Leave List; observed 0.00 blocks positive path.

# Test Cases
Each scenario has exactly three cases, for exactly fifteen total.

## S01-T01
Test Case ID: S01-T01
Title: Login with valid administrator credentials
Description: Authenticate from a fresh context.
Preconditions: No storageState; login URL available.
Test Data: Admin/admin123.
Steps: Open login URL; fill username; fill password; click Login.
Expected Results: /web/index.php/dashboard/index loads with Dashboard.
Automation Candidate: Yes

## S01-T02
Test Case ID: S01-T02
Title: Navigate from Dashboard to requested modules
Description: Verify visible side navigation.
Preconditions: Authenticated dashboard.
Test Data: Admin, PIM, Leave, My Info.
Steps: Select each requested navigation item in turn.
Expected Results: System Users, Employee Information, Leave List, Personal Details load without auth loss.
Automation Candidate: Yes

## S01-T03
Test Case ID: S01-T03
Title: Use Dashboard Quick Launch
Description: Verify Quick Launch entry points.
Preconditions: Authenticated Dashboard.
Test Data: Leave List and Apply Leave.
Steps: Open Leave List; return Dashboard; open Apply Leave.
Expected Results: Matching headings load.
Automation Candidate: Yes

## S02-T01
Test Case ID: S02-T01
Title: Search and reset System Users
Description: Use Admin filters.
Preconditions: Authenticated Admin; Admin row exists.
Test Data: Admin; Enabled.
Steps: Enter filters; Search; verify row; Reset.
Expected Results: Matching row returns and Reset restores list.
Automation Candidate: Yes

## S02-T02
Test Case ID: S02-T02
Title: Search and reset Employee Information
Description: Use employee filter.
Preconditions: Authenticated PIM; Amelia Brown exists.
Test Data: Amelia Brown.
Steps: Fill employee filter; Search; verify row; Reset.
Expected Results: Matching employee displays and Reset restores defaults.
Automation Candidate: Yes

## S02-T03
Test Case ID: S02-T03
Title: Filter Leave List and inspect status
Description: Verify Leave List search and status.
Preconditions: Authenticated Leave; existing records.
Test Data: manda akhil user; Pending Approval.
Steps: Apply available filter; Search; inspect columns/status; Reset.
Expected Results: Date, employee, type, balance, days, status, comments, actions display; Reset works.
Automation Candidate: Yes

## S03-T01
Test Case ID: S03-T01
Title: Validate blank Add Employee form
Description: Required validation without creation.
Preconditions: Authenticated PIM; Add Employee page.
Test Data: Empty form.
Steps: Click Add; leave fields blank; click Save.
Expected Results: Page remains and visible Required messages appear; no record created.
Automation Candidate: Yes

## S03-T02
Test Case ID: S03-T02
Title: Create and update a unique employee
Description: Create approved unique employee then open edit.
Preconditions: Authenticated Admin; unique data; cleanup manifest.
Test Data: QA/Playwright/Employee; EMP_QA_001.
Steps: Fill Add Employee; Save; search unique employee; click pencil.
Expected Results: Employee is findable and pencil routes to its Personal Details.
Automation Candidate: Yes

## S03-T03
Test Case ID: S03-T03
Title: Guard employee deletion to the selected row
Description: Verify scoped delete and confirmation.
Preconditions: Test-created employee; cleanup approval.
Test Data: S03-T02 identifier.
Steps: Click row trash; verify confirmation; cancel non-destructive variant or confirm cleanup; search.
Expected Results: Cancel preserves row; approved confirmation removes only test row.
Automation Candidate: Yes

## S04-T01
Test Case ID: S04-T01
Title: Validate Add User required controls
Description: Required and mismatched-password validation without saving.
Preconditions: Authenticated Admin; Add User page.
Test Data: Empty form; mismatched password.
Steps: Click Save empty; repeat with mismatch.
Expected Results: Validation prevents save; no user created.
Automation Candidate: Yes

## S04-T02
Test Case ID: S04-T02
Title: Search an existing system user and open edit
Description: Verify row-level edit navigation.
Preconditions: Authenticated Admin; Admin row exists.
Test Data: Admin.
Steps: Search Admin; click pencil action.
Expected Results: Selected user edit form opens with Admin identity.
Automation Candidate: Yes

## S04-T03
Test Case ID: S04-T03
Title: Inspect My Info tabs and attachment controls
Description: Verify profile navigation and controls.
Preconditions: Authenticated Admin; My Info available.
Test Data: Ten verified tab names.
Steps: Verify all tabs; open Contact Details and return; inspect Save and Attachment Add/actions.
Expected Results: Tabs route correctly; controls visible; no data changes.
Automation Candidate: Yes

## S05-T01
Test Case ID: S05-T01
Title: Validate Apply Leave required fields and date range
Description: Blank and invalid date submissions.
Preconditions: Authenticated Leave; Apply Leave page.
Test Data: Empty fields; invalidRange.
Steps: Apply blank; enter From Date later than To Date; Apply.
Expected Results: Required validation and invalid-range rejection; no request created.
Automation Candidate: Yes

## S05-T02
Test Case ID: S05-T02
Title: Submit leave when balance permits
Description: Submit only when balance supports it.
Preconditions: Authenticated Leave; positive balance.
Test Data: validIfBalanceAvailable.
Steps: Select type; enter dates/comments; Apply.
Expected Results: Request accepted and appears with status; blocked when observed balance is 0.00.
Automation Candidate: Yes

## S05-T03
Test Case ID: S05-T03
Title: Review submitted leave in Leave List
Description: Verify permitted request result.
Preconditions: S05-T02 succeeded.
Test Data: Unique comment/date combination.
Steps: Open Leave List; search; locate request; inspect status/days/comments/actions.
Expected Results: Matching request and status such as Pending Approval display.
Automation Candidate: Yes

# Smoke Suite
S01-T01, S01-T02, S01-T03, S02-T01, S03-T01, and S04-T03. S05-T02 is conditional and excluded from default smoke because balance was 0.00.

# Regression Suite
All fifteen cases. Run S03-T02, S03-T03, S05-T02, and S05-T03 only in an isolated environment with approved data, cleanup, and positive leave balance. Run filtering, validation, profile, and row-action checks for every release candidate.

# Risks & Assumptions
The public demo is shared; counts and names change. Current account is manda user and balance is 0.00. Some menu items use href="#" and client routing, so assert visible headings and accessible names. Icon-only actions require row scoping and class fallback. Active session prevented a fresh unauthenticated negative-login check after initial authentication. Create/update/delete/leave success paths were not executed to avoid persistent changes; forms and affordances were verified. Dates, balances, permissions, and backend effects are environment-dependent.

# Recommendations
Use unique identifiers, trace/screenshots on failure, and URL plus heading assertions after navigation. Add fresh-context blank/invalid/valid credential tests in a controlled run. Keep destructive tests opt-in with confirmation and manifest-limited teardown. Gate leave success on positive balance. Prefer accessible labels and row-scoped icons, with locator health checks after UI version changes.
