# Petstore API Test Suite

This folder contains a JavaScript API test suite for the Swagger Petstore endpoints, with API operations separated into a page-object-style client.

## Files

- `api-tests.js` - Test scenarios and assertions covering create, find-by-status, and delete pet API behavior.
- `api-test-report.json` - Generated test results, summary, and timing for the latest run.
- `pom/PetstoreApi.js` - Holds Petstore API requests and response checks.
- `pom/TestReporter.js` - Runs each case, records results, and writes the report.
- `package.json` - Enables ES modules for the API client and test script.

## Requirements

- A local Node.js runtime installed on your machine.

## Run the tests

From this folder, run:

```bash
node api-tests.js
```

If Node is not installed globally, use a local Node binary path, for example:

```bash
export PATH="$HOME/.local/node-v22.12.0-darwin-x64/bin:$PATH"
node api-tests.js
```

## Notes

- The tests call the live Swagger Petstore API at `https://petstore.swagger.io/v2`.
- The script prints the HTTP status for each test case and reports any assertion failures.
- Some negative test cases may fail against the real API if the service accepts data that the test expects to reject.
- Each test case runs independently. Failures are summarized after all runnable cases finish, and the script exits with a non-zero status if any case failed. Cases that depend on a pet that could not be created are reported as skipped.
- Every run writes or replaces `api-test-report.json` in this folder, including when test cases fail.
