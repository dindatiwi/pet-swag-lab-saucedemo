# Case Study

This project contains two independent test suites: API tests for Swagger Petstore and browser-based checkout tests for SauceDemo.

## Project folders

### `postman api test/`

Mocha and Chai API tests for the Swagger Petstore API.

- `api-tests.js` - Mocha test scenarios and Chai assertions for creating, finding, and deleting pets.
- `package.json` - Configures the Mocha test command and dependencies.
- `pom/PetstoreApi.js` - Page-object-style client for Petstore API requests.
- `README.md` - Folder-specific setup and usage notes.

### `ui test/`

Playwright end-to-end tests for the SauceDemo checkout flow.

- `package.json` and `package-lock.json` - Define and lock the Playwright dependency and test commands.
- `playwright.config.js` - Configures the test directory, Chromium browser, reporter, and failure artifacts.
- `tests/checkout.spec.js` - Tests a complete purchase of the Sauce Labs Backpack.
- `pages/` - Page objects for login, inventory, cart, checkout, and order confirmation.
- `playwright-report/` - Generated HTML report.
- `test-results/` - Generated test output, screenshots, and traces when applicable.
- `README.md` - Folder-specific setup and usage notes.

## Requirements

- Node.js 20.19+ or 22.12+ for both test suites.
- npm for installing and running the Playwright tests.
- Internet access to reach the Petstore API and SauceDemo website.

## Run the API tests

From the API test folder, install dependencies once and run:

```bash
cd "postman api test"
npm install
npm test
```

The tests call the live Swagger Petstore API, so internet access is required.

## Run the Playwright tests

From the project folder, install dependencies and the Chromium browser once:

```bash
cd "ui test"
npm ci
npx playwright install chromium
```

Run the test suite:

```bash
npm test
```

To run with a visible browser:

```bash
npm run test:headed
```

To open the HTML report:

```bash
npm run report
```
