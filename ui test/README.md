# SauceDemo UI Tests

Playwright end-to-end coverage for the Sauce Labs Backpack checkout flow on [SauceDemo](https://www.saucedemo.com/).

## Requirements

- Node.js 20 or newer
- npm

## Setup

From this folder, install the project dependencies and Chromium:

```bash
npm ci
npx playwright install chromium
```

## Run the test

```bash
npm test
```

To run with a visible browser:

```bash
npm run test:headed
```

To open the HTML report after a run:

```bash
npm run report
```

## Coverage

The test signs in with the SauceDemo standard-user credentials, adds the Sauce Labs Backpack to the cart, and completes checkout with generated customer information. It verifies the product details throughout the flow, cart quantity, checkout form values, payment and shipping information, price totals, and order confirmation.

Page interactions are organized into page objects under `pages/`, with the checkout scenario in `tests/checkout.spec.js`.

Playwright saves screenshots and traces when a test fails. Generated reports and test artifacts are excluded from version control.
