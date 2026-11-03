# Petstore API Tests

Mocha and Chai integration tests for the Swagger Petstore API. `pom/PetstoreApi.js` keeps HTTP requests separate from test scenarios and assertions.

Requires Node.js 20.19+ or 22.12+.

## Run

Install dependencies once, then run the test suite from this folder:

```bash
npm install
npm test
```

The command generates an HTML and JSON report in `mochawesome-report/`. Tests call the live API at `https://petstore.swagger.io/v2`, so internet access is required. Mocha continues running later cases after an assertion fails, and the suite intentionally preserves the expected-error checks for an empty payload and an invalid status even when the live API returns `200`.
