# Task: Implement Playwright Automation for Scenario 3

You are working in an  existing Playwright automation project.

Your goal is to implement Scenario 3 from the project requirements while fully adhering to the existing project architecture, conventions, and authentication setup.

---

# Phase 1: Repository Analysis (Mandatory)

Before writing, modifying, or generating any code, inspect the repository thoroughly.

Review the following in order:

1. `Planner.md`
2. Existing `Pages/` (Page Object Model structure)
3. Existing test/spec directories
4. Playwright configuration files
5. Existing fixtures
6. `storage.json`
7. At least a few existing spec files that demonstrate project conventions

---

# Planner.md Requirements

Read the  **entire file** .

Locate **Scenario 3** and extract:

* All positive test cases
* All negative test cases
* Expected behaviors
* Test data requirements
* Validation requirements
* Error messages
* Boundary conditions
* Special conditions
* Any dependencies or preconditions

### Important

* Do not invent additional scenarios unless required by the framework.
* Implement only what Scenario 3 requires.

---

# Authentication Requirements

Authentication already exists via `storage.json`.

### Do NOT:

* Create login tests
* Navigate to login pages
* Enter usernames/passwords
* Create new authentication flows
* Duplicate existing auth logic

### Do:

* Reuse the existing authenticated browser context
* Follow the same approach used throughout the current project
* Assume `storage.json` is valid unless the framework indicates otherwise

---

# Page Object Model Requirements

Follow the existing architecture exactly.

### Reuse whenever possible:

* Existing Page Objects
* Locators
* Fixtures
* Test utilities
* Helpers
* Test data
* Custom commands

### If Scenario 3 requires new functionality:

* Add methods to the appropriate existing Page Object
* Keep locators inside Page Objects
* Do not place page interactions directly in spec files unless the project convention already does so

Maintain consistency with:

* Folder structure
* Naming conventions
* TypeScript style
* Playwright patterns

---

# Test Coverage Requirements

Ensure all Scenario 3 requirements are implemented.

### Positive Scenarios

Cover every successful workflow described in Planner.md.

Verify:

* Expected outcomes
* Correct UI state
* Success messages
* Data persistence (if applicable)
* Business rule validation

### Negative Scenarios

Cover every failure/validation scenario described in Planner.md.

Verify:

* Validation messages
* Error handling
* Restricted behavior
* Blocked actions
* Business rule enforcement

---

# Test Implementation Standards

### Required

* Meaningful test names
* Independent tests
* Reliable assertions
* Proper waits
* Reuse existing fixtures
* Reuse existing test data

# Test Data Management

Use existing test data when available.

If Scenario 3 needs new test data:

* Add it to the project's established test-data location
* Follow existing conventions
* Avoid embedding large datasets directly in spec files

---

# Validation Checklist Before Completion

Verify that:

* All Scenario 3 requirements are implemented
* Both positive and negative scenarios are covered
* No login flow has been added
* `storage.json` authentication is reused
* Page Object Model standards are followed
* No duplicated locators exist in spec files
* TypeScript builds successfully
* Playwright code follows project conventions

---

# Execution

If the environment allows:

1. Run the Scenario 3 spec
2. Investigate failures
3. Fix root causes
4. Re-run tests
5. Do not weaken assertions just to make tests pass

---

# Deliverables

## Code Changes

Provide:

* New spec file created
* Modified Page Objects
* Any supporting updates

---

## Final Summary

Include:

### Scenario 3 Test Cases Implemented

List all test cases.

### Positive Scenarios

* Test case 1
* Test case 2
* ...

### Negative Scenarios

* Test case 1
* Test case 2
* ...

### Page Object Changes

List:

* Files modified
* Methods added

### Spec File Created

Example:

**Plain Text**

1

tests/scenario3.spec.ts

Show more lines

### Authentication Confirmation

Confirm:

* Existing `storage.json` reused
* No login flow added

### Assumptions

Document any assumptions derived from `Planner.md`.

### Execution Results

Include:

* Tests executed
* Pass/fail counts
* Any issues resolved

---

**Primary objective:** Implement the complete Scenario 3 automation within the existing Playwright framework while reusing the current authentication setup, Page Object Model, fixtures, utilities, and project conventions.
