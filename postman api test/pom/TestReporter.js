import { writeFile } from 'node:fs/promises';

export class TestReporter {
  constructor(reportPath) {
    this.reportPath = reportPath;
    this.results = [];
  }

  async run(testName, test) {
    const startedAt = Date.now();
    console.log(`\n${testName}`);
    try {
      const value = await test();
      this.results.push({
        testName,
        status: 'passed',
        durationMs: Date.now() - startedAt,
      });
      return value;
    } catch (error) {
      this.results.push({
        testName,
        status: 'failed',
        durationMs: Date.now() - startedAt,
        error: String(error.message || error),
      });
      console.error(`\n${testName} failed: ${String(error.stack || error)}`);
      return undefined;
    }
  }

  skip(testName, reason) {
    this.results.push({ testName, status: 'skipped', reason });
  }

  fail(testName, error) {
    this.results.push({
      testName,
      status: 'failed',
      error: String(error.message || error),
    });
  }

  async write() {
    const summary = Object.fromEntries(
      ['total', 'passed', 'failed', 'skipped'].map((status) => [
        status,
        status === 'total'
          ? this.results.length
          : this.results.filter((result) => result.status === status).length,
      ]),
    );

    await writeFile(this.reportPath, `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      summary,
      tests: this.results,
    }, null, 2)}\n`);
    console.log(`Report saved to ${this.reportPath}`);
    return summary;
  }
}
